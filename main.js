require('dotenv').config({
    path: require('path').join(__dirname, 'URL.env')
});
console.log('ENV loaded:', !!process.env.DATABASE_URL);

const express = require('express');
const { Client } = require('pg');


const app = express();
app.use(express.json()); // Add this line to parse JSON request bodies

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.on('error', err => console.log('Database error:', err.message));

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Connection failed:', err.message));

    app.use(express.static('public'));

app.get('/data', async (req, res) => {
    const data = await client.query('SELECT * FROM secondmain ORDER BY id ASC');
    res.json(data.rows);
});

app.post('/data', async (req, res) => {
    const { who,what } = req.body;
    await client.query('INSERT INTO secondmain (who, what) VALUES ($1, $2)', [who, what]);
    //await client.query('DROP TABLE IF EXISTS "secondMain"');
    res.sendStatus(200);
});

app.patch('/data/:id', async (req, res) => {
    const id = req.params.id;
    const { who, what } = req.body;

    await client.query(
        'UPDATE secondmain SET who = $1, what = $2 WHERE id = $3',
        [who, what, id]
    );

    wss.clients.forEach(socket => {
        if (socket.readyState === 1) {
            socket.send('updated');
        }   
    });

    res.sendStatus(200);
});

const setupWebSocket = require('./websocket');

const server = app.listen(process.env.PORT || 3000);

const wss = setupWebSocket(server);