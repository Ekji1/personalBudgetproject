const app = require('./app.js');
const PORT = 3000;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
});