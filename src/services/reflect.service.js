const ticketService = require('./ticket.service');

function reflectOnResult(ticket, observed) {
    if (observed.actionType === 'FIX_ISSUE' && observed.executed) {
        const updatedTicket = ticketService.updateTicket(ticket.id, {
            status: 'RESOLVED',
        });

        return {
            outcome: 'RESOLVED',
            ticket: updatedTicket,
            responseMessage: observed.resultMessage,
        };
    }

    if (observed.actionType === 'FIX_ISSUE' && !observed.executed) {
        const updatedTicket = ticketService.updateTicket(ticket.id, {
            status: 'ESCALATED',
            escalationNote: observed.investigationNote,
        });

        return {
            outcome: 'ESCALATED',
            ticket: updatedTicket,
            responseMessage: `We weren't able to verify this automatically, so we've escalated it to our support team with our findings. They'll follow up shortly.`,
        };
    }

    const updatedTicket = ticketService.updateTicket(ticket.id, {
        status: 'RESOLVED_SELF_SERVE',
    });

    return {
        outcome: 'RESOLVED_SELF_SERVE',
        ticket: updatedTicket,
        responseMessage: `${observed.resultMessage}\n\nIf this doesn't resolve your issue, let us know and we can escalate this to our support team.`,
    };
}

module.exports = { reflectOnResult };
