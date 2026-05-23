/**
 * WHITE-BOX & INTEGRATION TESTS FOR CLOUDFLARE WORKER
 * Verifies CORS checks, KV telemetry logging, and Gemini API dual-key failover.
 * Runs 100% locally with zero external npm dependencies.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// ── 1. COMPILE WORKER CODE IN VM CONTEXT ───────────────────────────
const workerPath = path.join(__dirname, '../cloudflare-worker/worker.js');
let workerCode = fs.readFileSync(workerPath, 'utf8');

// Convert ESM to CommonJS-style global exposure
workerCode = workerCode.replace(/export\s+default\s+/, 'global.worker = ');

// Ensure Node Fetch globals are present or polyfilled
const MockResponse = class {
    constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map(Object.entries(init.headers || {}));
    }
    async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
    async text() {
        return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    }
};

const sandbox = vm.createContext({
    console: console,
    Response: global.Response || MockResponse,
    Headers: global.Headers || Map,
    URL: global.URL,
    atob: atob,
    btoa: btoa,
    // We will inject a custom mock fetch inside individual tests
    fetch: null 
});
sandbox.global = sandbox;

vm.runInContext(workerCode, sandbox);
const worker = sandbox.global.worker;

// ── 2. HELPER TO CREATE MOCK REQUESTS ──────────────────────────────
function createMockRequest(urlPath, method, body, origin = 'https://rounak161106.github.io') {
    const headers = new Map([
        ['Origin', origin],
        ['Content-Type', 'application/json']
    ]);
    return {
        url: `https://rounak-ai-proxy.workers.dev${urlPath}`,
        method: method,
        headers: {
            get(key) {
                return headers.get(key) || null;
            }
        },
        async json() {
            return body;
        }
    };
}

// ── 3. DEFINE TESTS ──────────────────────────────────────────────────

test('Worker CORS Origin Verification', async (t) => {
    const env = { GEMINI_API_KEY: 'key1' };
    const invalidOriginRequest = createMockRequest('/visitor', 'POST', {}, 'https://malicious-site.com');
    
    const response = await worker.fetch(invalidOriginRequest, env);
    assert.strictEqual(response.status, 403);
    
    const data = await response.json();
    assert.strictEqual(data.error, 'Forbidden');
});

test('Worker Visitor Telemetry Tracking (KV Store)', async (t) => {
    const kvStore = {};
    const env = {
        GEMINI_API_KEY: 'key1',
        VISITORS_KV: {
            async get(key) { return kvStore[key] || null; },
            async put(key, val) { kvStore[key] = val; }
        }
    };

    const visitorPayload = {
        sessionId: 'test_session_123',
        name: 'John Doe',
        firstVisit: '2026-05-23T10:00:00Z',
        lastVisit: '2026-05-23T10:05:00Z'
    };

    const request = createMockRequest('/visitor', 'POST', visitorPayload);
    const response = await worker.fetch(request, env);
    
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.ok, true);

    // Verify KV entry exists and matches
    const kvEntry = JSON.parse(kvStore['visitor_test_session_123']);
    assert.strictEqual(kvEntry.name, 'John Doe');
    assert.strictEqual(kvEntry.sessionId, 'test_session_123');
});

test('Worker Dual-Key Failover Mechanism', async (t) => {
    const env = {
        GEMINI_API_KEY: 'broken-key-exceeded-limit',
        GEMINI_API_KEY_2: 'working-backup-key'
    };

    const chatPayload = {
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    };

    const request = createMockRequest('/', 'POST', chatPayload);

    // Mock global fetch within sandbox to simulate failover scenario
    sandbox.fetch = async (url) => {
        const parsedUrl = new URL(url);
        const apiKey = parsedUrl.searchParams.get('key');
        
        if (apiKey === 'broken-key-exceeded-limit') {
            // First key returns 429 quota error
            return new MockResponse(JSON.stringify({
                error: { message: 'Resource has been exhausted (e.g. queries per minute).' }
            }), { status: 429 });
        } else if (apiKey === 'working-backup-key') {
            // Second backup key succeeds
            return new MockResponse(JSON.stringify({
                candidates: [{ content: { parts: [{ text: 'Hello! I am Pracy! 🌸' }] } }]
            }), { status: 200 });
        }
        return new MockResponse('', { status: 500 });
    };

    const response = await worker.fetch(request, env);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.ok(data.candidates);
    assert.strictEqual(data.candidates[0].content.parts[0].text, 'Hello! I am Pracy! 🌸');
});
