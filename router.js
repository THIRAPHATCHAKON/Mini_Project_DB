const express = require('express');
const router = express.Router();

let threads = [
  { id: 1, title: 'Welcome Thread', author: 'Admin', posts: [] }
];
let nextThreadId = 2;

router.get('/', (req, res) => {
  res.render('index', { threads });
});

// สร้าง thread ใหม่
router.post('/thread', (req, res) => {
  const { title, author } = req.body;
  threads.push({ id: nextThreadId++, title, author, posts: [] });
  res.redirect('/');
});

// หน้า thread
router.get('/thread/:id', (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.send('Thread not found');
  res.render('thread', { thread });
});

// เพิ่ม post ใน thread
router.post('/thread/:id/post', (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.send('Thread not found');
  const { author, content } = req.body;
  thread.posts.push({ author, content });
  res.redirect(`/thread/${thread.id}`);
});

router.get('/login', (req, res) => {
  res.render('login', { name: 'Tofu' });
});

router.get('/register', (req, res) => {
  res.render('register'); // จะไปหา views/register.ejs
});

module.exports = router;