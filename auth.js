const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./database');

router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios." });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const resultado = await pool.query( 
            'INSERT INTO usuarios (nome, senha, email) VALUES ($1, $2, $3) RETURNING id, nome, email',
        [nome, senhaHash, email]);
        res.status(201).json({ mensagem: "Usuário criado com successo.", usuario: resultado.rows[0] });
    } catch(err) {
        res.status(500).json({ mensagem: err.message });
    }
});


router.post('/login', async (req, res) => {
    const {email, senha} = req.body;

    if(!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = resultado.rows[0];

        if(!usuario) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
        if(!senhaCorreta) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ mensagem: "Login realizado com sucesso.", token }); 
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao realizar login." });
    }
});

module.exports = router;