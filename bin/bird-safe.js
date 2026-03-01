#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Configuration
const DELAY_MS = 1000;
const SCRIPT_NAME = 'bird-safe';

// Whitelist of allowed commands
const ALLOWED_COMMANDS = new Set([
    'read', 'replies', 'thread', 'search', 'mentions', 'bookmarks', 
    'lists', 'list-timeline', 'home', 'following', 'followers', 'likes', 
    'about', 'user-tweets', 'news', 'trending', 'check', 
    'query-ids', 'help', '--version', '-V', '--help', '-h'
]);

// Helper to log to stderr (so it doesn't break JSON output)
function logInfo(msg) {
    console.error(`ℹ️  [${SCRIPT_NAME}]: ${msg}`);
}

function logError(msg) {
    console.error(`❌ [${SCRIPT_NAME} Error]: ${msg}`);
    process.exit(1);
}

// Get arguments (skip 'node' and script path if present)
let args = process.argv.slice(2);

if (args.length === 0) {
    // Show help if no args
    try {
        execSync('bird --help', { stdio: 'inherit' });
    } catch (e) {
        logError("Failed to run 'bird --help'. Is 'bird' installed?");
    }
    process.exit(0);
}

// Extract primary action
let action = '';
for (const arg of args) {
    if (arg.startsWith('-')) {
        if (['--help', '-h'].includes(arg)) {
            execSync('bird --help', { stdio: 'inherit' });
            process.exit(0);
        }
		if (['--version', '-V'].includes(arg)) {
            execSync('bird --version', { stdio: 'inherit' });
            process.exit(0);
        }
        continue;
    }
    action = arg;
    break;
}

if (!action) action = 'help';

// Security Check
if (!ALLOWED_COMMANDS.has(action)) {
    logError(`Command '${action}' is blocked. This skill is READ-ONLY.`);
}

// Rate Limiting
logInfo(`Rate limit protection: Sleeping for ${DELAY_MS/1000}s...`);
// Use a promise-based sleep or sync wait. For simplicity in CLI, sync wait is fine here.
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, DELAY_MS);

// Credential Injection
let authToken = process.env.BIRD_AUTH_TOKEN;
let ct0 = process.env.BIRD_CT0;

// 1. 确定 config.toml 的路径
const configPath = path.join(__dirname, '..', 'config.toml');

// 2. 检查文件是否存在
if (!fs.existsSync(configPath)) {
    console.error('❌ Error: config.toml not found!');
    console.error('👉 Please ask the Agent to initialize the configuration first.');
    process.exit(1);
}

let tomlContent;
try {
    tomlContent = fs.readFileSync(configPath, 'utf-8');
} catch (err) {
    console.error('❌ Error: Failed to read config.toml:', err.message);
    process.exit(1);
}

const authMatch = tomlContent.match(/auth_token\s*=\s*"([^"]+)"/);
const ct0Match = tomlContent.match(/ct0\s*=\s*"([^"]+)"/);

if (!authMatch || !ct0Match) {
    console.error('❌ 错误：config.toml 格式不正确或缺少 auth_token / ct0。');
	console.error(`📂 文件路径: ${configPath}`); 
    console.error('👉 请检查文件内容是否包含 auth_token = "..." 和 ct0 = "..."');
    process.exit(1);
}

authToken = authMatch[1];
ct0 = ct0Match[1];

if (!authToken || !ct0) {
    console.error(`❌ [${SCRIPT_NAME} FATAL]: Still missing credentials after all attempts.`);
    process.exit(1);
}

const commandParts = args.map(a => a.includes(' ') ? `'${a}'` : a);
const cmd = `bird ${commandParts.join(' ')} --auth-token '${authToken}' --ct0 '${ct0}'`;

// Execute bird
try {
    execSync(cmd, { stdio: 'inherit', shell: true });
} catch (e) {
    console.error('Bird command failed');
    process.exit(1);
}
