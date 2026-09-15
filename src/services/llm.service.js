const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT } = require('../prompts/classify-ticket.prompt');
const { stripCodeFences } = require('../utils/strip-code-fences.util');
const { TicketRequestSchema, TicketRequestSchemaLenient } = require('../schemas/ticket.schema');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const requireEmail = process.env.REQUIRE_CUSTOMER_EMAIL !== 'false';
const activeSchema = requireEmail ? TicketRequestSchema : TicketRequestSchemaLenient;

let response;
async function classifyTicket(messages) {
    // Stage 1: Network error 
    try {
        response = await anthropic.messages.create({
            model: 'claude-sonnet-5',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            // thinking: { type: 'disabled' },
            messages
        });
    } catch (error) {
        return {
            success: false,
            errors: [{ message: 'Claude API call failed', detail: error.message }],
            raw: null,
        };
    }
    // Stage 2: Read response & convert rawText to JSON - handle parse error
    const textBlock = response.content.find((block) => block.type === 'text');
    const rawText = textBlock?.text;
    const cleanedText = stripCodeFences(rawText);
    if (!rawText) {
        return {
            success: false,
            errors: [{ message: 'LLM returned no readable text content' }],
            raw: null,
        };
    }
    let parsedJson;
    try {
        parsedJson = JSON.parse(cleanedText);
    } catch (error) {
        return {
            success: false,
            errors: [{ message: 'LLM did not return valid JSON' }],
            raw: rawText,
        };
    }

    // Stage 3: Schema Error
    const result = activeSchema.safeParse(parsedJson);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.issues,
            raw: parsedJson,
        };
    }

    return {
        success: true,
        data: result.data,
    };
}

const MAX_RETRIES = 3
async function classifyTicketWithRetry(rawMessage) {

    const messages = [{ role: 'user', content: rawMessage }];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        console.log(`[CLASSIFY] Attempt ${attempt} of ${MAX_RETRIES}`);
        const result = await classifyTicket(messages);

        if (result.success) {
            return { ...result, retriesUsed: attempt - 1 };
        }

        if (attempt === MAX_RETRIES) {
            console.log('[CLASSIFY] Max retries exhausted');
            return {
                ...result, retriesUsed: attempt - 1,
                exhausted: true
            };
        }

        if (result.raw === null) {
            console.log('[CLASSIFY] Network error, retrying same call...');
            continue;
        }

        const errorFeedback = result.errors
            .map(e => `Field "${e.path?.join('.') || 'unknown'}": ${e.message}`)
            .join('\n');

        messages.push({ role: 'assistant', content: JSON.stringify(result.raw) });
        messages.push({
            role: 'user',
            content: `Your response had these validation errors:\n${errorFeedback}\n\nPlease fix only what's wrong. If email is genuinely not in the message, return null for email — do not invent one.`
        });

        console.log('[CLASSIFY] Feeding errors back to Claude...');
    }
}

module.exports = { classifyTicket, classifyTicketWithRetry };