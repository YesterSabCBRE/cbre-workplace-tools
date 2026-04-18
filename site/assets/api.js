/**
 * CBRE Workplace Tools — Shared API Client
 * 
 * Every tool page imports this to call Claude via the Worker.
 * Update WORKER_URL after you deploy your Cloudflare Worker.
 */

// ── UPDATE THIS after deploying your Worker ──────────────────────────
const WORKER_URL = 'https://cbre-workplace-tools-api.YOUR-SUBDOMAIN.workers.dev';
// ─────────────────────────────────────────────────────────────────────

// Optional: if you set ACCESS_PASSWORD on the Worker, set it here too.
// For a team intranet this is usually fine in the JS. For public sites, 
// use environment variables or prompt the user.
const ACCESS_TOKEN = '';  // e.g. 'my-team-password'

/**
 * Call Claude via the Worker proxy.
 * @param {Array} messages  - Anthropic messages array
 * @param {Object} options  - { system, model, max_tokens }
 * @returns {Promise<string>} - The assistant's text response
 */
export async function callClaude(messages, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (ACCESS_TOKEN) headers['x-cbre-access-token'] = ACCESS_TOKEN;

  const resp = await fetch(`${WORKER_URL}/api/claude`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      system: options.system,
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: options.max_tokens || 2000,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `Worker error ${resp.status}`);
  }

  const data = await resp.json();
  const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
  return text;
}

/**
 * Parse JSON from Claude's response safely.
 * Claude sometimes wraps JSON in ```json fences.
 */
export function parseJSON(text) {
  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(clean);
}

/**
 * Get Worker URL (useful for status checks)
 */
export function getWorkerUrl() {
  return WORKER_URL;
}
