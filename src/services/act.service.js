const Anthropic = require('@anthropic-ai/sdk');
const { FALLBACK_SYSTEM_PROMPT } = require('../prompts/agent-fallback.prompt');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

function validateClaim(ticket) {
    // In a real system, this would check the customer's claim against
    // actual business records - payment logs, order history, account
    // activity, whatever's relevant. We're simulating that check here.
    if (!ticket.referenceId) {
        return false;
    }

    if (ticket.referenceId === 'INVALID-REF') {
        return false;
    }

    return true;
}

async function askLLMDirectly(ticket) {
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        system: FALLBACK_SYSTEM_PROMPT,
        messages: [
            { role: 'user', content: `Title: ${ticket.title}\nDescription: ${ticket.description}` },
        ],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock?.text || null;
}

async function performAction(plan, ticket) {
    if (plan.actionType === 'FIX_ISSUE' && plan.source === 'KNOWLEDGE_BASE') {
        const isValid = validateClaim(ticket);

        if (isValid) {
            return {
                actionType: 'FIX_ISSUE',
                executed: true,
                resultMessage: plan.kbEntry.solution,
            };
        }

        return {
            actionType: 'FIX_ISSUE',
            executed: false,
            resultMessage: null,
        };
    }

    if (plan.source === 'KNOWLEDGE_BASE') {
        return {
            actionType: 'PROVIDE_INFO',
            executed: false,
            source: 'KNOWLEDGE_BASE',
            resultMessage: plan.kbEntry.solution,
        };
    }

    const llmAnswer = await askLLMDirectly(ticket);
    return {
        actionType: 'PROVIDE_INFO',
        executed: false,
        source: 'LLM',
        resultMessage: llmAnswer,
    };
}

module.exports = { performAction };
