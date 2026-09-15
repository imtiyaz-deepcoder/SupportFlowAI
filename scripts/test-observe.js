require('dotenv').config();

const { planTicket } = require('../src/services/plan.service');
const { performAction } = require('../src/services/act.service');
const { observeResult } = require('../src/services/observe.service');

(async () => {
    const invalidFixTicket = {
        title: 'Refund request',
        description: 'I was charged twice, please refund.',
        referenceId: 'INVALID-REF',
    };
    const plan = planTicket(invalidFixTicket);
    const actionResult = await performAction(plan, invalidFixTicket);

    console.log('Observed result:');
    console.log(observeResult(actionResult, invalidFixTicket));
})();
