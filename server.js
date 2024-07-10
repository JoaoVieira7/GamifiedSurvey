const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// Configuração do bodyParser para interpretar JSON
app.use(bodyParser.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'world',
    password: 'admin',
    port: 5432,
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
    const {
        player,
        workenvironment,
        color,
        cuisine,
        transportation,
        music_genre,
        vacation_preference,
        leisure_activity,
        favorite_season,
        weekend_preference,
        form_loaded_at
    } = req.body;

    // Logs para debug
    console.log('Dados recebidos:', req.body);

    // Converter datas
    const formLoadedAtConverted = convertISOToPostgresFormat(form_loaded_at);
    const formSubmittedAt = convertISOToPostgresFormat(new Date().toISOString());

    const query = `
        INSERT INTO gamified_responses (player, workenvironment, color, cuisine, transportation, music_genre, vacation_preference, leisure_activity, favorite_season, weekend_preference, form_loaded_at, form_submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    const values = [
        player || null,
        workenvironment || null,
        color || null,
        cuisine || null,
        transportation || null,
        music_genre || null,
        vacation_preference || null,
        leisure_activity || null,
        favorite_season || null,
        weekend_preference || null,
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
        INSERT INTO retention_data (form_loaded_at, form_submitted_at)
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
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gamified_responses ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).json({ message: 'Erro ao buscar dados do banco de dados', error: err });
    }
});

// Rota para buscar os dados do banco de dados da retenção dos Users
app.get('/retention-data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM retention_data ORDER BY id ASC ');
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

app.get('/final', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'final.html'));
});
// Rota básica para a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/tables', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tables.html'));
})

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
