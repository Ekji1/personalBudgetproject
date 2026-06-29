const express = require('express');
const app = express();
const { lerDados, salvarDados } = require('./storage');

app.use(express.json());

app.get('/', (req, res) => {
    const dados = lerDados();
    res.json(dados);
});

app.get('/receitas', (req, res) => {
    const dados = lerDados();
    res.status(200).json(dados.receitas);
});

app.get('/despesas', (req, res) => {
    const dados = lerDados();
    res.status(200).json(dados.despesas);
});

app.get('/receitas/:id', (req, res) => {
   const dados = lerDados(); 
   const item = dados.receitas.find(i =>  i.id === parseInt(req.params.id));

   if(!item) {
    return res.status(404).json({mensagem: "Valor não encontrado"});
   }
   res.status(200).json(item);
});

app.get('/despesas/:id', (req, res) => {
    const dados = lerDados(); 
    const item = dados.despesas.find(i => i.id === parseInt(req.params.id));
    if(!item) {
        return res.status(404).json({mensagem: "Valor não encontrado"});
    }
    res.status(200).json(item);
});

app.get('/total', (req, res) => {
    const dados = lerDados();

    const totalReceitas = dados.receitas.reduce((acc, i) => acc + i.valor, 0);
    const totalDespesas = dados.despesas.reduce((acc, i) => acc + i.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    res.status(200).json({
        totalReceitas,
        totalDespesas,
        saldo
     })
})

app.post('/receitas', (req, res) => {

    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }
    if(isNaN(req.body.valor) || req.body.valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido." });
    }

    const dados = lerDados();
    const novoItem = {
        id: dados.receitas.length > 0 ? dados.receitas[dados.receitas.length -1].id + 1 : 1,
        nome: req.body.nome,
        valor: req.body.valor
    };

    dados.receitas.push(novoItem);
    salvarDados(dados);

    res.status(201).json({ mensagem: "Receita adicionada.", item: novoItem });

});

app.post('/despesas', (req, res) => {

    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }
    if(isNaN(req.body.valor) || req.body.valor <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido." });
    }

    const dados = lerDados();
    const novoItem = {
        id: dados.despesas.length > 0  ? dados.despesas[dados.despesas.length -1].id + 1 : 1,
        nome: req.body.nome,
        valor: req.body.valor
    };

    dados.despesas.push(novoItem);
    salvarDados(dados);

    res.status(201).json({ mensagem: "Despesa adicionada.", item: novoItem });
});


app.put('/receitas/:id', (req, res) => {
    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }

    const dados = lerDados();
    const idParam = parseInt(req.params.id);
  
    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    const index = dados.receitas.findIndex(i => i.id === idParam);

    if(index === -1) {
        return res.status(404).json({ mensagem: "Recita não encontrada para atualização." });
    }

    dados.receitas[index] = {
        id: idParam,
        nome: req.body.nome,
        valor: req.body.valor
    };

    salvarDados(dados);
    res.status(200).json({ mensagem: "Receita atualizada com sucesso", item: dados.receitas[index] });
});

app.put('/despesas/:id', (req, res) => {
    if(!req.body.nome || !req.body.valor) {
        return res.status(400).json({ mensagem: "Nome e valor obrigatórios." });
    }

    const dados = lerDados();
    const idParam = parseInt(req.params.id);

    if(isNaN(idParam)) {
       return res.status(400).json({ mensagem: "ID inválido." });
    }

    const index = dados.despesas.findIndex(i => i.id === idParam);

    if(index === -1) {
        return res.status(404).json({ mensagem: "Despesa não encontrada para atualização." })
    }

    dados.despesas[index] = {
        id: idParam,
        nome: req.body.nome,
        valor: req.body.valor
    };

    salvarDados(dados);
    res.status(200).json({ mensagem: "Despesa atualizada com sucesso", item: dados.despesas[index] });
});

app.delete('/receitas/:id', (req, res) => {
    const dados = lerDados();
    const idParam = parseInt(req.params.id);

    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    const index = dados.receitas.findIndex(i => i.id === idParam);

    if(index === -1) {
        return res.status(404).json({ mensagem: "Receita não encontrada." })
    }

    dados.receitas.splice(index, 1);
    salvarDados(dados);

    res.status(200).json({ mensagem: `Receita de id: ${idParam} deletada com sucesso.` });
});

app.delete('/despesas/:id', (req, res) => {
    const dados = lerDados();
    const idParam = parseInt(req.params.id);

    if(isNaN(idParam)) {
        return res.status(400).json({ mensagem: "ID inválido." });
    }

    const index = dados.despesas.findIndex(i => i.id === idParam);

    if(index === -1) {
        return res.status(404).json({ mensagem: "Despesa não encontrada." })
    }

    dados.despesas.splice(index, 1);
    salvarDados(dados);

    res.status(200).json({ mensagem: `Despesa de id: ${idParam} deletada com sucesso.`})
});


module.exports = app;