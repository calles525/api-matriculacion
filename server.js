const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Servidor API corriendo en http://localhost:${port}`);
});