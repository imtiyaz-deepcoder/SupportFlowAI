const { z } = require('zod');

const TicketRequestSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be under 200 characters'),
    description: z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000, 'Description must be under 2000 characters'),
    customerEmail: z.email('Enter a valid email address'),
    category: z.enum(['BILLING', 'TECHNICAL', 'ACCOUNT', 'GENERAL'], 'Category must be one of the supported types'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], 'Priority must be one of the supported levels'),
    referenceId: z.string().min(1, 'referenceId must not be empty').optional(),
});
const TicketRequestSchemaLenient = TicketRequestSchema.extend({
    customerEmail: z.email('Enter a valid email address').nullable(),
});
const SavedTicketSchema = TicketRequestSchema.extend({
    id: z.uuid('Ticket id must be a valid UUID'),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED', 'RESOLVED_SELF_SERVE']),
    createdAt: z.iso.datetime('createdAt must be a valid ISO datetime'),
});
module.exports = { TicketRequestSchema, SavedTicketSchema, TicketRequestSchemaLenient };
