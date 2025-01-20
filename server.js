const express = require('express');
const cors = require('cors');
const app = express();

// เปิดใช้งาน CORS
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

//สำหรับแปลง JSON
app.use(express.json());


app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!f_Name || !l_Name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  res.json({ message: 'User registered successfully.' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

 
});
app.listen(3000, () => console.log('Server running on port 3000'));
