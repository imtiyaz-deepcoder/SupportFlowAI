require('dotenv').config();

const { planTicket } = require('../src/services/plan.service');
const { performAction } = require('../src/services/act.service');
const { observeResult } = require('../src/services/observe.service');
const { reflectOnResult } = require('../src/services/reflect.service');
const ticketService = require('../src/services/ticket.service');

(async () => {
    const tickets = ticketService.getAllTickets();
    const ticket = tickets[0];

    const plan = planTicket(ticket);
    const actionResult = await performAction(plan, ticket);
    const observed = observeResult(actionResult, ticket);
    const reflected = reflectOnResult(ticket, observed);

    console.log(JSON.stringify(reflected, null, 2));
})();
