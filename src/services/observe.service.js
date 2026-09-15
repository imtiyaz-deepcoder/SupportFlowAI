function buildInvestigationNote(ticket) {
    if (!ticket.referenceId) {
        return `Customer requested a fix, but provided no reference ID. Unable to verify the claim without one.`;
    }

    return `Customer provided reference ID "${ticket.referenceId}", but the claim could not be verified against our records. Needs human review.`;
}

function observeResult(actionResult, ticket) {
    const observed = {
        actionType: actionResult.actionType,
        executed: actionResult.executed,
        resultMessage: actionResult.resultMessage,
        observedAt: new Date().toISOString(),
    };

    if (actionResult.actionType === 'FIX_ISSUE' && !actionResult.executed) {
        observed.discrepancy = true;
        observed.investigationNote = buildInvestigationNote(ticket);
    }

    return observed;
}

module.exports = { observeResult };
