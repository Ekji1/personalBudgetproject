const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./database');
const authRoutes = require('./auth');
const autenticar = require('./middleware');

app.use(cors());

app.use(express.json());

app.use(authRoutes);

app.use('/receitas', autenticar);

app.use('/despesas', autenticar);

app.get('/', async (req, res) => {
    try {
        const receitas = await pool.query('SELECT * FROM receitas WHERE usuario_id = $1', [req.usuario.id]);
        const despesas = await pool.query('SELECT * FROM despesas WHERE usuario_id = $1', [req.usuario.id]);
        res.status(200).json({
            receitas: receitas.rows,
            despesas: despesas.rows
        });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao buscar dados."});
    }
});

app.get('/receitas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM receitas WHERE usuario_id = $1', [req.usuario.id]);
        res.status(200).json(resultado.rows);
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao buscar receitas." });
    }
});

app.get('/despesas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM despesas WHERE usuario_id = $1', [req.usuario.id]);
        res.status(200).json(resultado.rows);
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao buscar despesas" });
    }
}); 

app.get('/receitas/:id', async (req, res) => {
   try {
    const idParam = parseInt(req.params.id);
    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }
    const resultado = await pool.query('SELECT * FROM receitas WHERE id = $1 AND usuario_id = $2', [idParam, req.usuario.id]);
    if(resultado.rows.length === 0) {
        return res.status(404).json({ mensagem: "Receita não encontrada." });
    }
        res.status(200).json(resultado.rows[0]);
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao buscar receita." });
   }
});

app.get('/despesas/:id', async (req, res) => {
    try {
        const idParam = parseInt(req.params.id);
        if(isNaN(idParam)) {
            return res.status(400).json({ mensagem: "ID inválido." });
        }
        const resultado = await pool.query('SELECT * FROM despesas WHERE id = $1 AND usuario_id = $2', [idParam, req.usuario.id]);
        if(resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Despesa não encontrada." });
        }
        res.status(200).json(resultado.rows[0]);
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao buscar despesa." });
    }
});

app.get('/total', autenticar, async (req, res) => {
    try {
        const receitas = await pool.query('SELECT SUM(valor) FROM receitas WHERE usuario_id = $1', [req.usuario.id]);
        const despesas = await pool.query('SELECT SUM(valor) FROM despesas WHERE usuario_id = $1', [req.usuario.id]);
        const totalReceitas = parseFloat(receitas.rows[0].sum) || 0;
        const totalDespesas = parseFloat(despesas.rows[0].sum) || 0;

    res.status(200).json({
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas
     });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao calcular total." });
    }
});

app.post('/receitas', async (req, res) => {

    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }
    if(isNaN(req.body.valor) || req.body.valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido." });
    }

    try {
        const resultado = await pool.query('INSERT INTO receitas (nome, valor, usuario_id) VALUES ($1, $2, $3) RETURNING *', [req.body.nome, req.body.valor, req.usuario.id]);
        res.status(201).json({ mensagem: "Receita adicionada.", item: resultado.rows[0] });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao criar receita." });
    }
});

app.post('/despesas', async (req, res) => {

    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }
    if(isNaN(req.body.valor) || req.body.valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido." });
    }

    try {
        const resultado = await pool.query('INSERT INTO despesas (nome, valor, usuario_id) VALUES ($1, $2, $3) RETURNING *', [req.body.nome, req.body.valor, req.usuario.id]);
        res.status(201).json({ mensagem: "Despesa adicionada.", item: resultado.rows[0] });    
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao criar despesa." });
    }
});


app.put('/receitas/:id', async (req, res) => {
    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }  
    const idParam = parseInt(req.params.id);
  
    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    try {
        const resultado = await pool.query('UPDATE receitas SET nome = $1, valor = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *', [req.body.nome, req.body.valor, idParam, req.usuario.id]);
        if(resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Receita não encontrada." });      
    } 
        res.status(200).json({ mensagem: "Receita atualizada.", item: resultado.rows[0] });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao atualizar receita." });
    }
});

app.put('/despesas/:id', async (req, res) => {
    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }
    const idParam = parseInt(req.params.id);

    if(isNaN(idParam)) {
       return res.status(400).json({ mensagem: "ID inválido." });
    }

    try {
        const resultado = await pool.query('UPDATE despesas SET nome = $1, valor = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *', [req.body.nome, req.body.valor, idParam, req.usuario.id]);
        if(resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Desepesa não encontrada." });
        }
        res.status(200).json({ mensagem: "Despesa atualizada.", item: resultado.rows[0] });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao atualizar despesa." });
    }
});

app.delete('/receitas/:id', async (req, res) => {
    const idParam = parseInt(req.params.id);

    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    try {
        const resultado = await pool.query('DELETE FROM receitas WHERE id = $1 AND usuario_id = $2 RETURNING *', [idParam, req.usuario.id]);
        if(resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Receita não encontrada." });
        }
        res.status(200).json({ mensagem: `Receita de id: ${idParam} deletada com sucesso.` });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao deletar receita." });
    }  
});

app.delete('/despesas/:id', async (req, res) => {
    const idParam = parseInt(req.params.id);
    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    try {
        const resultado = await pool.query('DELETE FROM despesas WHERE id = $1 AND usuario_id = $2 RETURNING *', [idParam, req.usuario.id]);
        if(resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Despesa não encontrada." });
        }
        res.status(200).json({ mensagem: `Desepesa de id: ${idParam} deletada com sucesso.` });
    } catch(err) {
        res.status(500).json({ mensagem: "Erro ao deletar despesa."});
    }
});


module.exports = app;