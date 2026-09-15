const { planTicket } = require('./plan.service');
const { performAction } = require('./act.service');
const { observeResult } = require('./observe.service');
const { reflectOnResult } = require('./reflect.service');

async function resolveTicket(ticket) {
    const plan = planTicket(ticket);
    const actionResult = await performAction(plan, ticket);
    const observed = observeResult(actionResult, ticket);
    const reflected = reflectOnResult(ticket, observed);

    return reflected;
}

module.exports = { resolveTicket };
