function stripCodeFences(text) {
    return text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
}

module.exports = { stripCodeFences };