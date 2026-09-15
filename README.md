# SupportFlow AI

Companion codebase for the Pluralsight course "AI-Native Backend Engineering with JavaScript."

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and add your Anthropic API key
3. `node server.js` to run the REST server
4. `node src/mcp/mcp-server.js` to run the MCP server separately

## Branches
Each branch is a checkpoint — the codebase exactly as it stood at the end of that module.

- `module-1` — Schema First Validation for user input
- `module-2` — Schema First Validation for LLM output
- `module-3` — Intent-Driven Routing
- `module-4` — Model Context Protocol
- `module-5` — Agentic Lifecycle Pattern

`main` always reflects the final, Module 5 state.
