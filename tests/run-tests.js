/**
 * WHITE-BOX UNIT TESTS FOR CHATBOT.JS
 * Powered by Node.js native test runner and assert modules.
 * Runs 100% locally with zero external npm dependencies.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// ── 1. MOCK THE BROWSER ENVIRONMENT FOR NODE.JS ─────────────────────
const mockWindow = {
    innerWidth: 1024,
    localStorage: {
        store: {},
        getItem(key) { return this.store[key] || null; },
        setItem(key, val) { this.store[key] = String(val); },
        removeItem(key) { delete this.store[key]; }
    },
    addEventListener() {},
    visualViewport: {
        addEventListener() {},
        offsetTop: 0,
        height: 800
    },
    location: { pathname: '/' }
};

const mockElement = {
    addEventListener() {},
    classList: {
        contains() { return false; },
        add() {},
        remove() {}
    },
    style: {},
    setAttribute() {},
    removeAttribute() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    dispatchEvent() {},
    focus() {},
    appendChild() {},
    remove() {},
    textContent: '',
    value: ''
};

const mockDocument = {
    readyState: 'complete',
    getElementById() { return mockElement; },
    querySelector() { return mockElement; },
    querySelectorAll() { return [mockElement]; },
    createElement() { return mockElement; },
    body: mockElement,
    documentElement: mockElement,
    addEventListener() {}
};

// ── 2. EXECUTE THE CHATBOT CODE IN VM SANDBOX ───────────────────────
const chatbotFilePath = path.join(__dirname, '../static/js/chatbot.js');
const chatbotCode = fs.readFileSync(chatbotFilePath, 'utf8');

const sandbox = vm.createContext({
    window: mockWindow,
    document: mockDocument,
    localStorage: mockWindow.localStorage,
    navigator: {
        userAgent: 'NodeTestRunner',
        sendBeacon() { return true; }
    },
    console: console,
    Blob: class {},
    Event: class {},
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
});

// Run the chatbot file inside our mock context
vm.runInContext(chatbotCode, sandbox);

// Retrieve the exposed test utilities
const utils = sandbox.window.chatbotUtils;

if (!utils) {
    throw new Error("Failed to expose chatbotUtils to sandbox window. Check chatbot.js export block!");
}

// ── 3. DEFINE TESTS ──────────────────────────────────────────────────

test('Markdown Parser Unit Tests', (t) => {
    // Bold
    assert.match(utils.renderMarkdown('This is **bold** text'), /<strong>bold<\/strong>/);
    
    // Italic
    assert.match(utils.renderMarkdown('This is *italic* text'), /<em>italic<\/em>/);
    
    // Links
    const renderedLink = utils.renderMarkdown('[Portfolio](https://rounak.io)');
    assert.match(renderedLink, /<a href="https:\/\/rounak.io"/);
    assert.match(renderedLink, /target="_blank"/);
    
    // Inline code
    assert.match(utils.renderMarkdown('Code `const x = 5` here'), /<code>const x = 5<\/code>/);
});

test('Subject Generator Unit Tests', (t) => {
    // Check if collaboration intent triggers correct subject lines
    assert.strictEqual(utils.generateSubject('I want to collaborate with you'), 'Collaboration Opportunity');
    assert.strictEqual(utils.generateSubject('can we work together on a project?'), 'Collaboration Opportunity');
    
    // Check hiring queries
    assert.strictEqual(utils.generateSubject('hire you for an internship'), 'Internship / Hiring Inquiry');
    
    // Fallback subject
    assert.strictEqual(utils.generateSubject('just connecting'), 'Connecting via Your Portfolio');
});

test('Action Parameter Parser Unit Tests', (t) => {
    // Single parameter
    const params1 = utils.parseParams("target: about");
    assert.strictEqual(params1.target, 'about');
    
    // Multiple parameters
    const params2 = utils.parseParams("name: 'Rounak', email: \"test@gmail.com\"");
    assert.strictEqual(params2.name, 'Rounak');
    assert.strictEqual(params2.email, 'test@gmail.com');
});

test('Offline Local Reframer Unit Tests', (t) => {
    // Compiling a compliment fallback
    const complimentMsg = utils.localReframer('I love your awesome chatbot', 'Alice');
    assert.match(complimentMsg, /blown away/i);
    assert.match(complimentMsg, /Pracy AI/i);
    
    // Hiring opportunities
    const hireMsg = utils.localReframer('we want to hire you for a job', 'Bob');
    assert.match(hireMsg, /internship/i);
    assert.match(hireMsg, /PyTorch/i);
});
