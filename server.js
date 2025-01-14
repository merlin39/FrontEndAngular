const express = require('express');
const cors = require('cors');
const app = express();

// เปิดใช้งาน CORS
app.use(cors({
  origin: 'http://localhost:4200', // หรือ '*' หากต้องการอนุญาตทุก origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// จัดการ preflight request (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// // ตัวอย่าง endpoint
// app.post('/login', (req, res) => {
//   res.json({
//     token: 'example-token',
//     user: { id: 1, name: 'John Doe', email: 'user@example.com' }
//   });
// });

app.listen(3000, () => console.log('Server running on port 3000'));
