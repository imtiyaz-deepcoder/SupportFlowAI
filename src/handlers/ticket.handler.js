const ticketService = require('../services/ticket.service');

function createTicketHandler(req, res) {
    const ticket = ticketService.createTicketFromMessage(req.validatedData);
    res.status(201).json(ticket);
}

function getAllTicketsHandler(req, res) {
    const tickets = ticketService.getAllTickets();
    res.status(200).json(tickets);
}

function getTicketByIdHandler(req, res) {
    const ticket = ticketService.getTicketById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json(ticket);
}

module.exports = {
    createTicketHandler, getAllTicketsHandler, getTicketByIdHandler
};