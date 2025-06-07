const express = require('express');
const cors = require('cors');
const Router = require('../routes');
require('dotenv').config();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// baca file swagger json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'litera-docs.json'), 'utf8')
);

// swagger ui di route /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(Router);

// https://backend-litera.vercel.app/
app.get('/', (req, res) => {
  res.send(`
    <h1>📚 Litera API is running!</h1>
    <br>
    <p>Welcome to Litera's backend!</p>
    <p>📄 Here is the full API documentation: <a href="/api-docs" target="_blank">/api-docs</a></p>
    <br>
    <p>Try running: <code>https://backend-litera.vercel.app/books/search?q=(judul+judul)</code></p>
    <h3>Example:</h3>
    <p><a href="https://backend-litera.vercel.app/books/search?q=the+stranger" target="_blank">https://backend-litera.vercel.app/books/search?q=the+stranger</a></p>
    <p><a href="https://backend-litera.vercel.app/books/search?q=on+earth+we're+briefly+gorgeous" target="_blank">https://backend-litera.vercel.app/books/search?q=on+earth+we're+briefly+gorgeous</a></p>

  `);
});

// server running port
app.listen(3000, () => {
  console.log(`Server berjalan di http://localhost:3000`);
});
