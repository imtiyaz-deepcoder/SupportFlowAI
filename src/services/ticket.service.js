const fs = require('fs');
const path = require('path');
const { routeTicket } = require('../services/intent-router.service');

const DATA_FILE = path.join(__dirname, '../../data/tickets.json');

function createTicketFromMessage(data) {
    const tickets = readTickets();

    let ticket = {
        id: crypto.randomUUID(), // Generating UUID
        ...data,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
    };

    ticket = routeTicket(ticket);

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

function updateTicket(id, changes) {
    const tickets = readTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) {
        return null;
    }
    const updatedTicket = { ...tickets[index], ...changes };
    tickets[index] = updatedTicket;
    writeTickets(tickets);
    return updatedTicket;
}
module.exports = { createTicketFromMessage, getAllTickets, getTicketById, updateTicket };