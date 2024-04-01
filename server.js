const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Inicialize o Express
const app = express();

// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ferreiros7!',
    database: 'survey_db'
});

// Conecte-se ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
    console.log('Conectado ao banco de dados');
});

// Função para converter o timestamp do ISO 8601 para o formato MySQL DATETIME
function convertISOToMySqlFormat(isoString) {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Middleware para analisar o corpo da solicitação em JSON e URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para receber dados do formulário
app.post('/submit', (req, res) => {
    const { first_name, last_name, form_loaded_at } = req.body;
    const formLoadedAtConverted = convertISOToMySqlFormat(form_loaded_at);
    const formSubmittedAt = convertISOToMySqlFormat(new Date().toISOString());

    const query = 'INSERT INTO responses (first_name, last_name, form_loaded_at, form_submitted_at) VALUES (?, ?, ?, ?)';
    db.query(query, [first_name, last_name, formLoadedAtConverted, formSubmittedAt], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).json({ message: 'Erro ao inserir dados no banco de dados', error: err });
            return;
        }
        res.status(200).json({ message: 'Dados submetidos com sucesso' });
    });
});

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
