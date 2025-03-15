const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('./db/database.db');
db.pragma('journal_mode = WAL');


app.post('/login/unsafe', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log(query);

  try {
    const result = db.prepare(query).all();
    res.json({ success: !!result, user: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login/safe', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  try {
    const stmt = db.prepare(query);
    const result = stmt.get(username, password);
    res.json({ success: !!result, user: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', (req, res) => {
  try {
    const result = db.prepare('SELECT * FROM users').all();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
