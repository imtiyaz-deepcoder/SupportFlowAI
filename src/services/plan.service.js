const { searchKnowledgeBase } = require('./knowledge-base.service');

function planTicket(ticket) {
    const query = `${ticket.title} ${ticket.description}`;
    const kbMatch = searchKnowledgeBase(query);

    if (kbMatch) {
        return {
            source: 'KNOWLEDGE_BASE',
            actionType: kbMatch.actionType,
            kbEntry: kbMatch,
        };
    }

    return {
        source: 'LLM_FALLBACK',
        actionType: 'PROVIDE_INFO',
        kbEntry: null,
    };
}

module.exports = { planTicket };
