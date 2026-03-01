<img width="347" height="63" alt="image" src="https://github.com/user-attachments/assets/4d7f90d7-7e8f-47c5-9fc7-eeccac4f7ed7" /># Bird Twitter Safe Skill for Openclaw

This skill provides a secured, read-only interface to Twitter/X using the `bird` CLI. It is designed for agents that need to **monitor** or **research** Twitter without the risk of accidentally posting, liking, or following users.


# Installation

- Copy this project folder(bird-twitter-safe) to your skill folder e.g. ~/.openclaw/skills or ~/.openclaw/workspace/skills
- The folder shall be like this:
```text
    skills/
    ├── bird-twitter-safe/
    |   └── skill.md
    |   ├── bin/
    |   |   └── bird-safe.js
```

# Configuation

- Tell the agent about this skill.
- Give the agent the twitter cookie token and ct0 and ask the agent to finish the configuration.
- Raise request to your openclaw agent to fetch information from X.com(Twitter)
