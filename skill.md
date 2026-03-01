---
name: bird-twitter-safe
description: Safe, read-only Twitter/X access via 'bird' CLI with enforced rate limiting (1s delay). Requires auth_token and ct0 config. Blocks all write actions.
metadata: { "openclaw": { "requires": { "bins": ["bird"] }, "emoji": "🐦🔒" }
---

# Bird Twitter Safe (Read-Only)

This skill provides a secured, read-only interface to Twitter/X using the `bird` CLI. It is designed for agents that need to **monitor** or **research** Twitter without the risk of accidentally posting, liking, or following users.


## Prerequisites & Auto-Configuration ⚠️

This skill requires Twitter Cookies (`auth_token` and `ct0`) to run. The configuration is stored in `config.toml` within this skill directory.

### Configuration Workflow
If `config.toml` is missing or empty, follow these steps **automatically**:

1.  **Guide the User**:
    - Inform the user that Twitter authentication is required.
    - Instruct them to:
      1. Log in to [Twitter](https://twitter.com).
      2. Press `F12` to open Developer Tools.
      3. Go to **Application** -> **Cookies** -> `https://twitter.com`.
      4. Copy the values of `auth_token` and `ct0`.
    - Ask the user to provide these two values in the chat.

2.  **Create the File**:
    - Once the user provides the tokens, **do not** ask them to edit files manually.
    - Instead, use your built-in **file writing tool** to create/update `config.toml` in the current skill directory (`bird-twitter-safe/`).
    - The file content must be strictly formatted as follows:
      ```toml
      [twitter]
      auth_token = "<user_provided_auth_token>"
      ct0 = "<user_provided_ct0>"
      ```
    - Replace `<user_provided_...>` with the actual values provided by the user.

3.  **Confirm & Proceed**:
    - Confirm to the user that `config.toml` has been successfully created.

> **Security Note**: When asking for tokens, reassure the user that these values are saved **locally** in their own server's `config.toml` file and are never transmitted to any third-party service other than Twitter's official API.


## Safety Features
1. **Read-Only Enforcement**: Explicitly blocks all write commands (`tweet`, `reply`, `follow`, `unfollow`, `like`, `unbookmark`).
2. **Rate Limiting**: Automatically inserts a **1-second delay** before every command execution to prevent API throttling or account bans.
3. **POSIX Compatible**: Uses a standard `sh` script for maximum compatibility across Linux/macOS environments.

## 🛑 CRITICAL USAGE INSTRUCTIONS FOR THE AGENT

**YOU MUST USE THE NODE.JS WRAPPER SCRIPT FOR ALL OPERATIONS.**

1. **Execution Command**: 
   Always run the script using `node` and the `{baseDir}` variable which points to this skill's root folder.
   
   - ✅ **Correct**: 
     ```bash
     node {baseDir}/bin/bird-safe.js search "news" --json
     ```
   
   - ❌ **WRONG** (Hardcoded path): 
     ```bash
     node ./skills/bird-twitter-safe/bin/bird-safe.js ...
     ```
   - ❌ **WRONG** (Bypasses security): 
     ```bash
     bird search "news"
     ```

2. **How it works**:
   - `{baseDir}` will be automatically replaced by the system with the correct path (e.g., `/app/skills/bird-twitter-safe` or `~/.openclaw/skills/bird-twitter-safe`).
   - You do not need to know the exact location. Just use `{baseDir}`.

## Available Commands
Use the wrapper script with the following safe subcommands:

| Command | Example |
| :--- | :--- |
| `search <query>` | `node {baseDir}/bin/bird-safe.js search "AI" --json` |
| `read <id>` | `node {baseDir}/bin/bird-safe.js read 123456789` |

> **Note**: Always append `--json` for easier parsing.

## Error Hangdling
Tell the user about the error, do not try to repair or use other commands.
