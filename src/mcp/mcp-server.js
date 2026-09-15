const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const llmService = require('../services/llm.service');
const ticketService = require('../services/ticket.service');
const { default: z } = require('zod');
const categoryHandler = require('../handlers/category.handler');

const server = new McpServer({
    name: 'supportflow-ai',
    version: '1.0.0'
});

// create_ticket tool 
server.registerTool(
    'create_ticket',
    {
        title: 'Create Support Ticket',
        description: 'Creates a support ticket from a natural language description of the issue',
        inputSchema: {
            message: z.string().describe('The user\'s issue described in plain English')
        }
    },
    async ({ message }) => {
        try {
            const result = await llmService.classifyTicketWithRetry(message);
            if (!result.success) {
                return {
                    content: [{
                        type: 'text',
                        text: `Could not classify this ticket after retries: ${JSON.stringify(result.errors)}`
                    }],
                    isError: true
                };
            }
            const ticket = await ticketService.createTicketFromMessage(result.data);
            return {
                content: [{
                    type: 'text',
                    text: `Ticket created successfully!\nID: ${ticket.id}\nCategory: ${ticket.category}\nPriority: ${ticket.priority}\nAssigned to: ${ticket.assignedTeam}`
                }]
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: `Failed to create ticket: ${error.message}` }],
                isError: true
            };
        }
    }
);

// get_ticket_status tool 
server.registerTool(
    'get_ticket_status',
    {
        title: 'Get Ticket Status',
        description: 'Retrieves the current status and details of a support ticket using its ticket ID',
        inputSchema: {
            ticketId: z.string().describe('The unique ID of the ticket to look up')
        }
    },
    async ({ ticketId }) => {
        const ticket = ticketService.getTicketById(ticketId);
        if (!ticket) {
            return {
                content: [{
                    type: 'text',
                    text: `No ticket found with ID: ${ticketId}`
                }],
                isError: true
            };
        }
        return {
            content: [{
                type: 'text',
                text: `Ticket ID: ${ticket.id}\nCategory: ${ticket.category}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\nAssigned to: ${ticket.assignedTeam}`
            }]
        };
    }

);

// escalate_ticket tool
server.registerTool(
    'escalate_ticket',
    {
        title: 'Escalate Ticket',
        description: 'Escalates an existing ticket to human attention by setting its priority to CRITICAL',
        inputSchema: {
            ticketId: z.string().describe('The unique ID of the existing ticket to escalate')
        }
    },
    async ({ ticketId }) => {
        const ticket = ticketService.getTicketById(ticketId);

        if (!ticket) {
            return {
                content: [{
                    type: 'text',
                    text: `No ticket found with ID: ${ticketId}`
                }],
                isError: true
            };
        }
        const criticalTicket = { ...ticket, priority: 'CRITICAL' };
        const escalated = categoryHandler.handleCriticalEscalation(criticalTicket);

        const updatedTicket = ticketService.updateTicket(ticketId, escalated);
        return {
            content: [{
                type: 'text',
                text: `Ticket ${updatedTicket.id} successfully escalated to human attention.\nPriority: ${updatedTicket.priority}\nAssigned to: ${updatedTicket.assignedTeam}`
            }]
        };
    }
);

const transport = new StdioServerTransport();
server.connect(transport);

console.error('SupportFlow AI MCP Server running...');