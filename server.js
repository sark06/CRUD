const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('database.sqlite');
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

// Routes
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) return res.json({ message: 'Username already exists' });
        res.json({ message: 'Account created successfully' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (row) return res.json({ success: true, user: row, message: 'Login successful' });
        res.json({ success: false, message: 'Invalid credentials' });
    });
});

app.put('/update', (req, res) => {
    const { id, username, password } = req.body;
    db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], function (err) {
        if (err) return res.json({ message: 'Update failed' });
        res.json({ message: 'Account updated successfully' });
    });
});

app.delete('/delete', (req, res) => {
    const { id } = req.body;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) return res.json({ message: 'Delete failed' });
        res.json({ success: true, message: 'Account deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
