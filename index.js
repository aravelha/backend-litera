const express = require('express');
const Router = require('./routes');
const path = require('path');

const app = express();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(Router);

app.listen(3000, () => {
  console.log(`server berjalan di http://localhost:3000`);
});
