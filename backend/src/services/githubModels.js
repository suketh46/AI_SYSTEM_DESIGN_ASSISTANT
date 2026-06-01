const config = require('../config');

/**
 * GitHub Models API client.
 *
 * Uses the Azure AI Inference API that powers GitHub Models.
 * Doc reference: https://docs.github.com/en/github-models
 */
class GitHubModelsService {
  constructor() {
    this.baseUrl = config.github.baseUrl.replace(/\/+$/, '');
    this.token = config.github.token;
    this.model = config.github.model;
  }

  /**
   * List available models from GitHub Models.
   * @returns {Promise<Array<{id: string, name: string}>>}
   */
  async listModels() {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`GitHub Models API error (${response.status}): ${body}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Send a chat completion request to the GitHub Models API.
   * @param {Array<{role: string, content: string}>} messages
   * @param {object} options - Additional parameters (temperature, max_tokens, etc.)
   * @returns {Promise<object>} The parsed JSON response body
   */
  async createChatCompletion(messages, options = {}) {
    const payload = {
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
      response_format: { type: 'json_object' },
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`GitHub Models API error (${response.status}): ${body}`);
    }

    const data = await response.json();
    return data;
  }
}

module.exports = new GitHubModelsService();
