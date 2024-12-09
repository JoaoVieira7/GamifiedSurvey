require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const fs = require('fs');

// Configuração do bodyParser para interpretar JSON
app.use(bodyParser.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Função para converter data ISO para formato PostgreSQL
function convertISOToPostgresFormat(isoString) {
    if (!isoString) return null; // Verifica se isoString é nulo ou indefinido
    
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
        // Se o valor não puder ser convertido em uma data válida, retorna nulo
        return null;
    }

    return date.toISOString(); // Retorna a data formatada para o PostgreSQL
}


// Rota para receber os dados do formulário
app.post('/submit', async (req, res) => {
    console.log('Dados recebidos no backend:', req.body); // Verifica os dados no backend

    const {
        curso,
        anos_curso,
        motivo_curso,
        satisfacao_curso,
        atividades_extracurriculares,
        suporte_academico,
        recursos_universidade,
        preparacao_mercado,
        experiencia_profissional,
        oportunidades_estagio,
        orientacao_profissional,
        tipo_empresa,
        area_trabalho,
        objetivos_carreira_curto,
        objetivos_carreira_longo,
        equilibrio_vida,
        medidas_equilibrio,
        falhas_curso,
        mudancas_curriculo,
        melhorias_universidade,
        relacao_teoria_pratica,
        sugestoes_experiencia,
        form_loaded_at
    } = req.body;

    // Logs para debug
    console.log('Dados recebidos:', req.body);


    const medidasEquilibrioValues = medidas_equilibrio || null;
    const falhasCursoValues = falhas_curso || null;
    const mudancasCurriculoValues = mudancas_curriculo || null;
    const melhoriasUniversidadeValues = melhorias_universidade || null;
    const sugestoesExperienciaValues = sugestoes_experiencia || null;

    // Converter datas
    const formLoadedAtConverted = convertISOToPostgresFormat(form_loaded_at);
    const formSubmittedAt = convertISOToPostgresFormat(new Date().toISOString());

    const query = `
        INSERT INTO final_table (curso,
        anos_curso,
        motivo_curso,
        satisfacao_curso,
        atividades_extracurriculares,
        suporte_academico,
        recursos_universidade,
        preparacao_mercado,
        experiencia_profissional,
        oportunidades_estagio,
        orientacao_profissional,
        tipo_empresa,
        area_trabalho,
        objetivos_carreira_curto,
        objetivos_carreira_longo,
        equilibrio_vida,
        medidas_equilibrio,
        falhas_curso,
        mudancas_curriculo,
        melhorias_universidade,
        relacao_teoria_pratica,
        sugestoes_experiencia,
        form_loaded_at,
        form_submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
    `;

    const values = [
        curso || null,
        anos_curso || null,
        motivo_curso || null,
        satisfacao_curso || null,
        atividades_extracurriculares || null,
        suporte_academico || null,
        recursos_universidade || null,
        preparacao_mercado || null,
        experiencia_profissional || null,
        oportunidades_estagio || null,
        orientacao_profissional || null,
        tipo_empresa || null,
        area_trabalho || null,
        objetivos_carreira_curto || null,
        objetivos_carreira_longo || null,
        equilibrio_vida || null,
        medidasEquilibrioValues ,
        falhasCursoValues ,
        mudancasCurriculoValues ,
        melhoriasUniversidadeValues ,
        relacao_teoria_pratica || null,
        sugestoesExperienciaValues ,
        formLoadedAtConverted || null,
        formSubmittedAt
    ];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Dados submetidos com sucesso', redirectUrl: '/final' });
    } catch (err) {
        console.error('Erro ao inserir dados:', err);
        res.status(500).json({ message: 'Erro ao inserir dados no banco de dados', error: err });
    }
    
});

 // Rota para registrar a tentativa de saída da página
app.post('/leave', async (req, res) => {
    const { form_loaded_at, form_submitted_at } = req.body;

    const query = `
        INSERT INTO retention_data_gamified (form_loaded_at, form_submitted_at)
        VALUES ($1, $2)
    `;

    const values = [
        convertISOToPostgresFormat(form_loaded_at),
        convertISOToPostgresFormat(form_submitted_at)
    ];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Dados de saída registrados com sucesso' });

    } catch (err) {
        console.error('Erro ao registrar dados de saída:', err);
        res.status(500).json({ message: 'Erro ao registrar dados no banco de dados', error: err });
    }
});
 

// Rota para buscar os dados do banco de dados
/* app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gamified_responses ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ message: 'Erro ao buscar dados do banco de dados', error: err });
    }
}); */

 // Rota para buscar os dados do banco de dados da retenção dos Users
app.get('/retention-data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM retention_data_gamified ORDER BY id ASC ');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ message: 'Erro ao buscar dados do banco de dados', error: err });
    }
}); 

// Rota para lidar com métodos POST incorretos
app.get('/post', (req, res) => {
    res.status(404).send('Endpoint POST não existe. Use o método POST para enviar dados para /submit.');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'PaginaInicial.html'));
})

app.get('/final', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'final.html'));
});
// Rota básica para a raiz
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

/* app.get('/tables', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tables.html'));
}) */

/* app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
}) */

/* app.get('/create_survey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create_survey.html'));
}) */

/* app.get('/newsurvey', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newsurvey.html'));
}) */

/* app.post('/create_survey', (req, res) => {
    const surveyData = req.body;
    fs.writeFileSync('survey.json', JSON.stringify(surveyData, null, 2));
    res.json({ success: true });
}); */

/* app.get('/get_survey', (req, res) => {
    const surveyData = fs.readFileSync('survey.json');
    res.json(JSON.parse(surveyData));
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
