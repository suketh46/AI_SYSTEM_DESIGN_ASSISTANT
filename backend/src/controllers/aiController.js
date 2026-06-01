const githubModels = require('../services/githubModels');
const { parseLLMResponse } = require('../utils/parseLLMResponse');
const { validateArchitectureRequest } = require('../validators/architectureValidator');

/**
 * Build the system-design prompt sent to the LLM.
 * The prompt is engineered to produce a strict JSON response
 * matching the frontend's expected schema.
 */
function buildArchitecturePrompt(userPrompt) {
  return [
    {
      role: 'system',
      content: `You are an expert system design architect. Given a system design request, generate a structured architecture design.

Return ONLY valid JSON in the following format, with no markdown, no code fences, and no additional text:

{
  "title": "System title (e.g., Social Media Platform Architecture)",
  "overview": "High-level architecture overview in 2-3 concise paragraphs covering the system purpose, key design decisions, and technology stack rationale.",
  "components": [
    {
      "name": "ComponentName",
      "type": "microservice|api-gateway|load-balancer|cache|cdn|message-queue|worker|serverless-function|web-server|app-server",
      "description": "What this component does and its responsibility in the system"
    }
  ],
  "databases": [
    {
      "name": "DBName",
      "type": "relational|document|key-value|graph|time-series|blob|search",
      "description": "Purpose and what data it stores",
      "technology": "PostgreSQL|MongoDB|Redis|Cassandra|Elasticsearch|etc"
    }
  ],
  "communication": [
    {
      "method": "REST|gRPC|GraphQL|WebSocket|MessageQueue|EventBus|HTTP",
      "between": ["source-component-name", "target-component-name"],
      "description": "What kind of data flows and why this pattern was chosen"
    }
  ],
  "scalability": [
    {
      "strategy": "horizontal-scaling|caching|sharding|CDN|async-processing|read-replicas|auto-scaling|load-balancing|database-indexing|connection-pooling",
      "description": "How this strategy is applied and what bottleneck it addresses",
      "component": "Name of the component this applies to"
    }
  ],
  "diagramNodes": [
    {
      "id": "unique-kebab-case-id",
      "label": "Display Label",
      "type": "service|database|gateway|cache|queue|client|external",
      "group": "logical-group-name"
    }
  ],
  "diagramEdges": [
    {
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "HTTP/WS/gRPC/Internal",
      "style": "solid|dashed|dotted"
    }
  ]
}

RULES:
- Every component, database, and external system must have a corresponding node in diagramNodes.
- Every communication method must have one or more corresponding edges in diagramEdges.
- IDs in diagramNodes must use kebab-case (e.g., "api-gateway", "user-service").
- Edge source/target values must match node IDs exactly.
- Types must be chosen from the allowed lists above.
- Be specific with real technology choices (AWS, GCP, Azure services where appropriate).
- The overview should explain why the architecture is designed this way.
- Keep descriptions concise but informative — 1-2 sentences each.
- Return ONLY the JSON object. No introductory text, no explanations, no markdown.`,
    },
    {
      role: 'user',
      content: `System design request: ${userPrompt}`,
    },
  ];
}

/**
 * Generate code, documentation, and references for a given architecture.
 * Shared between the auto-flow in generateArchitecture and the standalone endpoint.
 */
async function generateCodeImpl(architecture) {
  const messages = [
    {
      role: 'system',
      content: `You are a DevOps and infrastructure expert. Given a system architecture, provide practical code snippets, documentation, and references.

Return ONLY valid JSON in this format:
{
  "docker": "Docker Compose YAML snippet or empty string",
  "terraform": "Terraform/ IaC snippet or empty string",
  "deployment": "Step-by-step deployment commands or empty string",
  "apiDocs": "Key API endpoint documentation (method, path, description) or empty string",
  "setupGuide": "Brief component setup guide or empty string",
  "architecture": "Architecture decision record explaining key choices or empty string",
  "githubRepos": [{ "name": "Repo name", "url": "https://github.com/example/repo", "description": "What it provides" }],
  "tools": [{ "name": "Tool name", "description": "How it fits the architecture" }],
  "bestPractices": ["Tip 1", "Tip 2"],
  "references": [{ "title": "Article or doc title", "url": "https://example.com/doc", "description": "What it covers" }]
}

Do NOT include markdown fences. Return ONLY the JSON object.`,
    },
    {
      role: 'user',
      content: `Generate code, documentation, and references for this architecture:\n${JSON.stringify(architecture, null, 2)}`,
    },
  ];

  const llmResponse = await githubModels.createChatCompletion(messages, { temperature: 0.4, maxTokens: 4096 });
  const rawContent = llmResponse?.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
  } catch {
    parsed = {
      docker: '', terraform: '', deployment: '', apiDocs: '', setupGuide: '', architecture: '',
      githubRepos: [], tools: [], bestPractices: [], references: [],
    };
  }
  return parsed;
}

/**
 * POST /api/ai/generate-architecture
 *
 * Accepts: { prompt: "Design a social media platform" }
 * Returns: Structured architecture JSON + auto-generated code, documentation, and references.
 */
async function generateArchitecture(req, res, next) {
  try {
    const validation = validateArchitectureRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const { prompt } = req.body;
    const messages = buildArchitecturePrompt(prompt);

    const llmResponse = await githubModels.createChatCompletion(messages);

    const rawContent = llmResponse?.choices?.[0]?.message?.content || '';
    const architecture = parseLLMResponse(rawContent);

    // Auto-generate code, documentation, and references for the architecture
    let codeDocs = null;
    try {
      codeDocs = await generateCodeImpl(architecture);
    } catch {
      codeDocs = null;
    }

    return res.json({
      success: true,
      data: architecture,
      codeDocs: codeDocs,
      meta: {
        model: llmResponse?.model || 'unknown',
        usage: llmResponse?.usage || null,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/ai/models
 *
 * Lists available models from GitHub Models.
 */
async function listModels(req, res, next) {
  try {
    const models = await githubModels.listModels();
    return res.json({ success: true, data: models });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/ai/generate-code
 *
 * Accepts: { architecture: { title, components, databases, ... } }
 * Returns: Code snippets, documentation, and references for the architecture.
 */
async function generateCode(req, res, next) {
  try {
    const { architecture } = req.body || {};
    if (!architecture || !architecture.title) {
      return res.status(400).json({ success: false, error: 'Valid architecture object is required' });
    }
    const parsed = await generateCodeImpl(architecture);
    return res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateArchitecture, listModels, generateCode };
