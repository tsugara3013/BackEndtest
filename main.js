require('dotenv').config({
    path: require('path').join(__dirname, 'URL.env')
});
console.log('ENV loaded:', !!process.env.DATABASE_URL);

const express = require('express');
const { Client } = require('pg');

const app = express();

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.on('error', err => console.log('Database error:', err.message));

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Connection failed:', err.message));

    app.use(express.static('public'));

app.get('/data', async (req, res) => {
    const data = await client.query('SELECT * FROM main');
    res.json(data.rows);
});

app.listen(process.env.PORT || 3000);