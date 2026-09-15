const ticketService = require('../services/ticket.service');
const llmService = require('../services/llm.service');
const { resolveTicket } = require('../services/agent.service');
const categoryHandler = require('../handlers/category.handler');

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

async function resolveTicketHandler(req, res) {
    const ticket = ticketService.getTicketById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.priority === 'CRITICAL') {
        return res.status(200).json({
            ticket,
            message: `This ticket is already escalated to a human. Our team will be in touch shortly.`,
        });
    }

    const reflected = await resolveTicket(ticket);

    res.status(200).json({
        ticket: reflected.ticket,
        message: reflected.responseMessage,
    });
}

function escalateTicketHandler(req, res) {
    const ticket = ticketService.getTicketById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const criticalTicket = { ...ticket, priority: 'CRITICAL' };
    const escalated = categoryHandler.handleCriticalEscalation(criticalTicket);
    const updatedTicket = ticketService.updateTicket(req.params.id, escalated);

    res.status(200).json({
        ticket: updatedTicket,
        message: `This ticket has been escalated to our team. We'll be in touch shortly.`,
    });
}

module.exports = {
    createTicketHandler,
    getAllTicketsHandler,
    getTicketByIdHandler,
    classifyTicketHandler,
    resolveTicketHandler,
    escalateTicketHandler,
};
