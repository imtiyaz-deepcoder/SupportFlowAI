const handleBillingTicket = (ticket) => {
    console.log(`[BILLING HANDLER] Processing ticket ${ticket.id}`);
    return {
        ...ticket,
        assignedTeam: 'BILLING_SUPPORT',
        routedAt: new Date().toISOString()
    };
};

const handleTechnicalTicket = (ticket) => {
    console.log(`[TECHNICAL HANDLER] Processing ticket ${ticket.id}`);
    return {
        ...ticket,
        assignedTeam: 'TECHNICAL_SUPPORT',
        routedAt: new Date().toISOString()
    };
};

const handleAccountTicket = (ticket) => {
    console.log(`[ACCOUNT HANDLER] Processing ticket ${ticket.id}`);
    return {
        ...ticket,
        assignedTeam: 'ACCOUNT_SUPPORT',
        routedAt: new Date().toISOString()
    };
};

const handleGeneralTicket = (ticket) => {
    console.log(`[GENERAL HANDLER] Processing ticket ${ticket.id}`);
    return {
        ...ticket,
        assignedTeam: 'GENERAL_SUPPORT',
        routedAt: new Date().toISOString()
    };
};

const handleCriticalEscalation = (ticket) => {
    console.log(`[CRITICAL ESCALATION] Ticket ${ticket.id} flagged for immediate human attention!`);
    return {
        ...ticket,
        status: 'ESCALATED',
        assignedTeam: 'HUMAN_ESCALATION',
        requiresImmediateAttention: true,
        routedAt: new Date().toISOString()
    };
};

module.exports = {
    handleBillingTicket,
    handleTechnicalTicket,
    handleAccountTicket,
    handleGeneralTicket,
    handleCriticalEscalation
};

