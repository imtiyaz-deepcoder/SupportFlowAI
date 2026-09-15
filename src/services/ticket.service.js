const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/tickets.json');

function createTicketFromMessage(data) {
    const tickets = readTickets();

    const ticket = {
        id: crypto.randomUUID(), // Generating UUID
        ...data,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
    };

    tickets.push(ticket);
    writeTickets(tickets);

    return ticket;
}

function getAllTickets() {
    return readTickets();
}

function writeTickets(tickets) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2));
}

function readTickets() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

function getTicketById(id) {
    const tickets = readTickets();
    return tickets.find(t => t.id === id);
}

module.exports = { createTicketFromMessage, getAllTickets, getTicketById };