const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch(err) {
        return res.status(403).json({ mensagem: err.message });
    }
}

module.exports = autenticar;