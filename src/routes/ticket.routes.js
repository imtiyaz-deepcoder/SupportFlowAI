const express = require('express');
const router = express.Router();

const { validate } = require('../middleware/validate.middleware');
const { TicketRequestSchema } = require('../schemas/ticket.schema');
const {
    createTicketHandler,
    getAllTicketsHandler,
    getTicketByIdHandler,
    classifyTicketHandler,
} = require('../handlers/ticket.handler');

router.post('/', validate(TicketRequestSchema), createTicketHandler);
router.get('/', getAllTicketsHandler);
router.get('/:id', getTicketByIdHandler);
router.post('/classify', classifyTicketHandler);

module.exports = router;