const {
    handleBillingTicket,
    handleTechnicalTicket,
    handleAccountTicket,
    handleGeneralTicket,
    handleCriticalEscalation
} = require('../handlers/category.handler');

// The router map — category to handler function
const routeMap = {
    BILLING: handleBillingTicket,
    TECHNICAL: handleTechnicalTicket,
    ACCOUNT: handleAccountTicket,
    GENERAL: handleGeneralTicket
};

const routeTicket = (ticket) => {
    // Priority check happens BEFORE category routing
    // Critical tickets always go to human escalation, regardless of category
    if (ticket.priority === 'CRITICAL') {
        console.log(`[ROUTER] CRITICAL priority detected. Escalating to human, bypassing ${ticket.category} handler.`);
        return handleCriticalEscalation(ticket);
    }
    const handler = routeMap[ticket.category];

    if (!handler) {
        console.log(`[ROUTER] No handler found for category: ${ticket.category}. Falling back to GENERAL.`);
        return handleGeneralTicket(ticket);
    }

    console.log(`[ROUTER] Routing ticket ${ticket.id} to ${ticket.category} handler`);
    return handler(ticket);
};

module.exports = { routeTicket };