const express = require('express');
const app = express();

// ตั้งค่า view engine เป็น ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { name: 'Tofu' });
});

app.get('/login', (req, res) => {
  res.render('login', { name: 'Tofu' });
});

app.get('/register', (req, res) => {
  res.render('register'); // จะไปหา views/register.ejs
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
