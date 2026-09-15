require('dotenv').config();

const { planTicket } = require('../src/services/plan.service');
const { performAction } = require('../src/services/act.service');

(async () => {
    const validFixTicket = {
        title: 'Refund request',
        description: 'I was charged twice, please refund.',
        referenceId: 'TXN1001',
    };
    console.log('Test 1 - valid fix:');
    console.log(await performAction(planTicket(validFixTicket), validFixTicket));

    const invalidFixTicket = {
        title: 'Refund request',
        description: 'I was charged twice, please refund.',
        referenceId: 'INVALID-REF',
    };
    console.log('\nTest 2 - failed validation:');
    console.log(await performAction(planTicket(invalidFixTicket), invalidFixTicket));

    const fallbackTicket = {
        title: 'Dark mode request',
        description: 'Could you add dark mode to the settings screen please?',
    };
    console.log('\nTest 3 - LLM fallback:');
    console.log(await performAction(planTicket(fallbackTicket), fallbackTicket));
})();
