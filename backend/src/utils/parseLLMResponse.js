const ARCHITECTURE_SCHEMA = {
  title: '',
  overview: '',
  components: [],
  databases: [],
  communication: [],
  scalability: [],
  diagramNodes: [],
  diagramEdges: [],
};

/**
 * Strip markdown code fences and trim whitespace from raw LLM output.
 * @param {string} raw
 * @returns {string}
 */
function sanitize(raw) {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Fill in any missing top-level keys with empty defaults.
 * @param {object} obj
 * @returns {object}
 */
function applyDefaults(obj) {
  const result = { ...ARCHITECTURE_SCHEMA };
  for (const key of Object.keys(ARCHITECTURE_SCHEMA)) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Attempt to parse the LLM response as JSON.
 * Returns the parsed architecture object on success,
 * or a fallback error-shaped object on failure.
 * @param {string} raw - Raw content from the LLM response
 * @returns {object}
 */
function parseLLMResponse(raw) {
  if (!raw || typeof raw !== 'string') {
    return {
      ...ARCHITECTURE_SCHEMA,
      title: 'Error',
      overview: 'The model returned an empty response. Please try again.',
    };
  }

  const cleaned = sanitize(raw);

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Parsed value is not a plain object');
    }
    return applyDefaults(parsed);
  } catch (parseErr) {
    return {
      ...ARCHITECTURE_SCHEMA,
      title: 'Parsing Error',
      overview:
        'The model returned invalid JSON. A retry has been suggested. Raw response excerpt: ' +
        raw.slice(0, 500),
    };
  }
}

module.exports = { parseLLMResponse };
