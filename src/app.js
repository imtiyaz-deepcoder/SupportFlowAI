const express = require('express');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/tickets', ticketRoutes);

module.exports = app;