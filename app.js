const express = require('express');
const app = express();

// ตั้งค่า view engine เป็น ejs
app.set('view engine', 'ejs');

// ประกาศตัวแปร threads ก่อนใช้
let threads = [
  { id: 1, title: 'Welcome Thread', author: 'Admin', posts: [] }
];
let nextThreadId = 2;

app.get('/', (req, res) => {
  res.render('index', { threads });
});

// สร้าง thread ใหม่
app.post('/thread', (req, res) => {
  const { title, author } = req.body;
  threads.push({ id: nextThreadId++, title, author, posts: [] });
  res.redirect('/');
});

// หน้า thread
app.get('/thread/:id', (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.send('Thread not found');
  res.render('thread', { thread });
});

// เพิ่ม post ใน thread
app.post('/thread/:id/post', (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.send('Thread not found');
  const { author, content } = req.body;
  thread.posts.push({ author, content });
  res.redirect(`/thread/${thread.id}`);
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
