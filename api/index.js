const express = require('express');
const cors = require('cors');
const Router = require('../routes');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(Router);

app.get('/', (req, res) => {
  res.send(`
    <h1>📚 Litera API is running!</h1>
    <p>Welcome to Litera's backend!</p>
    <p>Try running: <code>https://backend-litera.vercel.app/books/search?q=(judul+judul)</code></p>
    <h3>Example:</h3>
    <p><a href="https://backend-litera.vercel.app/books/search?q=the+stranger" target="_blank">https://backend-litera.vercel.app/books/search?q=the+stranger</a></p>
    <p><a href="https://backend-litera.vercel.app/books/search?q=the+stranger" target="_blank">https://backend-litera.vercel.app/books/search?q=laut+bercerita</a></p>
  `);
});



app.listen(3000, () => {
  console.log(`server berjalan di http://localhost:3000`);
});