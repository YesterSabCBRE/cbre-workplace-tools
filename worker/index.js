/**
 * CBRE Workplace Tools — Cloudflare Worker API Proxy
 * 
 * This Worker sits between your team's browser and the Anthropic API.
 * Your API key never leaves Cloudflare's servers.
 * 
 * Deploy: wrangler deploy
 * Set key: wrangler secret put ANTHROPIC_API_KEY
 */

const ALLOWED_ORIGINS = [
  // Add your GitHub Pages URL here once you have it, e.g.:
  // 'https://your-org.github.io',
  // 'https://your-custom-domain.com',
  'http://localhost:3000',   // for local development
  'http://localhost:8080',
  'http://127.0.0.1:5500',  // VS Code Live Server
];

// Optional: set a simple password so only your team can use the Worker.
// Set via: wrangler secret put ACCESS_PASSWORD
// Leave blank / unset to disable password protection.
const ACCESS_HEADER = 'x-cbre-access-token';

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, request, env);
    }

    const origin = request.headers.get('Origin') || '';
    const isAllowed = isAllowedOrigin(origin, env);

    // ── Health check ────────────────────────────────────────────────
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return corsResponse(JSON.stringify({ status: 'ok', service: 'CBRE Workplace Tools API' }), 200, request, env);
    }

    // ── Only allow POST to /api/claude ──────────────────────────────
    if (url.pathname !== '/api/claude' || request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'Not found' }), 404, request, env);
    }

    // ── Optional access token check ─────────────────────────────────
    if (env.ACCESS_PASSWORD) {
      const token = request.headers.get(ACCESS_HEADER);
      if (token !== env.ACCESS_PASSWORD) {
        return corsResponse(JSON.stringify({ error: 'Unauthorized' }), 401, request, env);
      }
    }

    // ── Parse request body ──────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: 'Invalid JSON body' }), 400, request, env);
    }

    // ── Validate required fields ────────────────────────────────────
    if (!body.messages || !Array.isArray(body.messages)) {
      return corsResponse(JSON.stringify({ error: 'messages array required' }), 400, request, env);
    }

    // ── Enforce safe defaults ────────────────────────────────────────
    const payload = {
      model: body.model || 'claude-sonnet-4-20250514',
      max_tokens: Math.min(body.max_tokens || 2000, 4000), // cap at 4k
      messages: body.messages,
    };
    if (body.system) payload.system = body.system;

    // ── Forward to Anthropic ─────────────────────────────────────────
    try {
      const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      });

      const data = await anthropicResp.json();

      if (!anthropicResp.ok) {
        return corsResponse(JSON.stringify({ error: data.error?.message || 'Anthropic API error', status: anthropicResp.status }), anthropicResp.status, request, env);
      }

      return corsResponse(JSON.stringify(data), 200, request, env);

    } catch (err) {
      return corsResponse(JSON.stringify({ error: 'Failed to reach Anthropic API', detail: err.message }), 502, request, env);
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────────────

function isAllowedOrigin(origin, env) {
  // If ALLOWED_ORIGINS_EXTRA is set in env, merge it
  const extra = env.ALLOWED_ORIGINS_EXTRA ? env.ALLOWED_ORIGINS_EXTRA.split(',').map(s => s.trim()) : [];
  const all = [...ALLOWED_ORIGINS, ...extra];
  return all.some(o => origin.startsWith(o));
}

function corsResponse(body, status, request, env) {
  const origin = request.headers.get('Origin') || '*';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowedOrigin(origin, env) ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': `Content-Type, ${ACCESS_HEADER}`,
    'Access-Control-Max-Age': '86400',
  };
  return new Response(body, { status, headers });
}
