const ticketService = require('../services/ticket.service');
const llmService = require('../services/llm.service');

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

async function classifyTicketHandler(req, res) {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'A "message" string is required' });
    }

    const result = await llmService.classifyTicketWithRetry(message);

    if (!result.success) {
        return res.status(422).json({
            error: 'LLM output failed validation',
            retriesUsed: result.retriesUsed,
            details: result.errors,
        });
    }

    const ticket = ticketService.createTicketFromMessage(result.data);
    res.status(201).json(ticket);

}

module.exports = {
    createTicketHandler, getAllTicketsHandler, getTicketByIdHandler, classifyTicketHandler
};