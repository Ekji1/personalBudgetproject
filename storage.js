const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './budget.json');

function lerDados() {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function salvarDados(dados) {
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
}

module.exports = { lerDados, salvarDados };