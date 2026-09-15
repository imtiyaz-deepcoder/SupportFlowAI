const { z } = require('zod');

const TicketRequestSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be under 200 characters'),
    description: z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description must be under 2000 characters'),
    customerEmail: z.email('Enter a valid email address'),
});
const TicketRequestSchemaLenient = TicketRequestSchema.extend({
    customerEmail: z.email('Enter a valid email address').nullable(),
});
const SavedTicketSchema = TicketRequestSchema.extend({
    id: z.uuid('Ticket id must be a valid UUID'),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    createdAt: z.iso.datetime('createdAt must be a valid ISO datetime'),
});
module.exports = { TicketRequestSchema, SavedTicketSchema, TicketRequestSchemaLenient };
