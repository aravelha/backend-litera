const express = require('express');
const cors = require('cors');
const Router = require('../routes');
require('dotenv').config();
const path = require('path');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS || "http://litera-wine.vercel.app"

app.use(cors({
  origin: allowedOrigins,
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
