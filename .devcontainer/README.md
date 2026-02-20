## SAFE YOLO MODE WITH DEV CONTAINERS

Allow Claude Code to perform any action while maintaining safety through containerization. This enables rapid development without destructive behavior on your host machine.

**Prerequisites:**

- Install [Docker](https://www.docker.com/)
- VS Code (or compatible editors)

**Security Features:**

- Network isolation with whitelist
- No access to host filesystem
- Restricted outbound connections
- Safe experimentation environment

**Setup Process:**

1. **Open in VS Code** and press `F1`
2. **Select** "Dev Containers: Reopen in Container"
3. **Wait** for container build
4. **Open terminal** (`Ctrl+J`)
5. **Authenticate** Claude Code in container
6. **Run in YOLO mode**:
   ```bash
   claude --dangerously-skip-permissions
   ```

**Why Use Dev Containers?**

- Test dangerous operations safely
- Experiment with system changes
- Rapid prototyping
- Consistent development environment
- No fear of breaking your system
