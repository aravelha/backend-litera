const express = require('express');
const cors = require('cors');
const Router = require('./routes');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})
);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(Router);

app.listen(3000, () => {
  console.log(`server berjalan di http://localhost:3000`);
});
