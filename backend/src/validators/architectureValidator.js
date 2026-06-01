/**
 * Validates the /api/ai/generate-architecture request body.
 * @param {object} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateArchitectureRequest(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    errors.push('Request body must be a JSON object');
    return { valid: false, errors };
  }

  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string') {
    errors.push('"prompt" is required and must be a string');
  } else if (prompt.trim().length === 0) {
    errors.push('"prompt" must not be empty');
  } else if (prompt.length > 10000) {
    errors.push('"prompt" must not exceed 10,000 characters');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateArchitectureRequest };
