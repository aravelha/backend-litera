const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log(`server berjalan di http://localhost:3000`);
});
