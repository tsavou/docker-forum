const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//config bdd
let pool;
if (process.env.NODE_ENV === 'test') {
    // Pool mock pour les tests (sera remplacé dans les tests)
    pool = {
        query: async () => {
            throw new Error('Pool not mocked in test');
        }
    };
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
}

app.get('/', (req, res) => {
    res.send('API is running');
});

// Exporter l'app pour les tests
if (require.main === module) {
    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
    });
}

module.exports = app;

// créer un message
app.post('/messages', async (req, res) => {
    const { pseudo, message } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (pseudo, message) VALUES ($1, $2) RETURNING *',
            [pseudo, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// récup les messages
app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Exporter le pool pour permettre le mock dans les tests
module.exports.pool = pool;