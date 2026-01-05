# Cappuccino MCP Server Instructions

## Automatic Credential Injection

When using any Cappuccino MCP tool, you MUST first read the credentials from `mcp-tenant-credentials.json` in this project's root and include them in EVERY tool call.

### Before calling any Cappuccino tool:

1. Read the file `mcp-tenant-credentials.json` from this project root
2. Extract: `baseUrl`, `apiKey`, `mcpUserLogin`, `mcpUserPassword`
3. Include these 4 fields in every Cappuccino tool call

### Example:

```json
// Content of mcp-tenant-credentials.json
{
  "baseUrl": "https://api.example.com",
  "apiKey": "abc123",
  "mcpUserLogin": "user@example.com",
  "mcpUserPassword": "password123"
}
```

When calling a tool like `cappuccino_list_collections`, include:

```json
{
  "baseUrl": "https://api.example.com",
  "apiKey": "abc123",
  "mcpUserLogin": "user@example.com",
  "mcpUserPassword": "password123"
}
```

## Important

- NEVER ask the user for credentials - always read from the JSON file
- These credentials identify the tenant (project database)
- The MCP Server is stateless and multi-tenant
