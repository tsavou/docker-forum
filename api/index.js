const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//config bdd
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

//execute init.sql pour initaliser la bdd avec la table message
const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
pool.query(initSql)
    .then(() => {
        console.log('Tables initialisées avec succès');
    })
    .catch((err) => {
        console.error('Erreur lors de l\'initialisation des tables:', err);
    });


app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});


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