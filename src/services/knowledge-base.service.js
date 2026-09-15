const fs = require('fs');
const path = require('path');

const KB_FILE = path.join(__dirname, '../../data/knowledge-base.json');

function loadKnowledgeBase() {
    const raw = fs.readFileSync(KB_FILE, 'utf-8');
    return JSON.parse(raw);
}

function searchKnowledgeBase(query) {
    const knowledgeBase = loadKnowledgeBase();
    const queryWords = query.toLowerCase().split(/\W+/).filter(Boolean);

    for (const entry of knowledgeBase) {
        const isMatch = entry.keywords.some(keyword => queryWords.includes(keyword));
        if (isMatch) {
            return entry;
        }
    }

    return null;
}

module.exports = { searchKnowledgeBase };
