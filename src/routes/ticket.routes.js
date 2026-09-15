const express = require('express');
const router = express.Router();

const { validate } = require('../middleware/validate.middleware');
const { TicketRequestSchema } = require('../schemas/ticket.schema');
const {
    createTicketHandler,
    getAllTicketsHandler,
    getTicketByIdHandler,
    classifyTicketHandler,
    resolveTicketHandler,
    escalateTicketHandler,
} = require('../handlers/ticket.handler');

router.post('/', validate(TicketRequestSchema), createTicketHandler);
router.get('/', getAllTicketsHandler);
router.get('/:id', getTicketByIdHandler);
router.post('/classify', classifyTicketHandler);
router.post('/:id/resolve', resolveTicketHandler);
router.post('/:id/escalate', escalateTicketHandler);

module.exports = router;
