const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'controle_ponto'
};

// Middleware de autenticação
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, 'SEGREDO_JWT', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Rotas de autenticação
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const conn = await mysql.createConnection(dbConfig);
    
    const [rows] = await conn.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).send('Credenciais inválidas');
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.senha);
    if (!validPassword) return res.status(401).send('Credenciais inválidas');
    
    const token = jwt.sign({ id: user.id, email: user.email }, 'SEGREDO_JWT', { expiresIn: '1h' });
    res.json({ token });
});

// Rotas protegidas
app.get('/api/funcionarios', authenticateToken, async (req, res) => {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM funcionarios WHERE ativo = TRUE');
    res.json(rows);
});

app.post('/api/registro-ponto', authenticateToken, async (req, res) => {
    const { tipo } = req.body;
    const agora = new Date();
    const hora = agora.toTimeString().split(' ')[0].substring(0, 5);
    const data = agora.toISOString().split('T')[0];
    
    const conn = await mysql.createConnection(dbConfig);
    
    // Verificar se já existe registro hoje
    const [registros] = await conn.execute(
        'SELECT * FROM registros_ponto WHERE funcionario_id = ? AND data = ?',
        [req.user.id, data]
    );
    
    let registro = registros[0];
    if (!registro) {
        await conn.execute(
            'INSERT INTO registros_ponto (funcionario_id, data) VALUES (?, ?)',
            [req.user.id, data]
        );
        registro = { funcionario_id: req.user.id, data };
    }
    
    // Atualizar o campo correspondente
    await conn.execute(
        `UPDATE registros_ponto SET ${tipo} = ? WHERE funcionario_id = ? AND data = ?`,
        [hora, req.user.id, data]
    );
    
    res.json({ success: true, hora });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});