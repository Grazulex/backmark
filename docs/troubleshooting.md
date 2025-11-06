# 🔧 Troubleshooting Guide

Common issues and solutions for Backmark.

---

## 📋 Table of Contents

1. [Installation Issues](#-installation-issues)
2. [Command Errors](#-command-errors)
3. [Performance Issues](#-performance-issues)
4. [Data Issues](#-data-issues)
5. [Display Issues](#-display-issues)
6. [Integration Issues](#-integration-issues)
7. [Getting Help](#-getting-help)

---

## 📦 Installation Issues

### Issue: `command not found: backmark`

**Symptoms**:
```bash
$ backmark --version
bash: backmark: command not found
```

**Solutions**:

1. **Check if installed globally**:
   ```bash
   npm list -g @grazulex/backmark
   ```

2. **Reinstall globally**:
   ```bash
   npm install -g @grazulex/backmark
   ```

3. **Check npm global path**:
   ```bash
   npm config get prefix
   # Should output something like: /usr/local

   # Add to PATH if needed (in ~/.bashrc or ~/.zshrc)
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

4. **Use npx if global install fails**:
   ```bash
   npx @grazulex/backmark --version
   ```

---

### Issue: `EACCES: permission denied`

**Symptoms**:
```bash
$ npm install -g @grazulex/backmark
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/@grazulex
npm ERR! errno -13
```

**Solutions**:

1. **Use sudo (not recommended)**:
   ```bash
   sudo npm install -g @grazulex/backmark
   ```

2. **Fix npm permissions (recommended)**:
   ```bash
   # Create a directory for global packages
   mkdir ~/.npm-global

   # Configure npm to use new directory
   npm config set prefix '~/.npm-global'

   # Add to PATH (in ~/.bashrc or ~/.zshrc)
   export PATH=~/.npm-global/bin:$PATH

   # Reload shell config
   source ~/.bashrc  # or source ~/.zshrc

   # Now install without sudo
   npm install -g @grazulex/backmark
   ```

---

### Issue: Node.js version too old

**Symptoms**:
```bash
$ backmark --version
SyntaxError: Unexpected token '?'
```

**Solution**:

Backmark requires **Node.js 16+**. Check your version:
```bash
node --version
# Should be v16.0.0 or higher
```

**Upgrade Node.js**:

**Using nvm (recommended)**:
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest LTS
nvm install --lts
nvm use --lts
```

**Using package manager**:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (Homebrew)
brew install node

# Windows (Chocolatey)
choco install nodejs-lts
```

---

## ⚠️ Command Errors

### Issue: `Backlog not initialized`

**Symptoms**:
```bash
$ backmark task list
Error: Backlog not initialized. Run `backmark init` first.
```

**Solution**:

Initialize Backmark in your project:
```bash
backmark init "My Project"
```

This creates the `backlog/` directory with configuration.

---

### Issue: `Task not found`

**Symptoms**:
```bash
$ backmark task view 999
Error: Task #999 not found
```

**Solutions**:

1. **List all tasks to find the correct ID**:
   ```bash
   backmark task list
   ```

2. **Search for the task**:
   ```bash
   backmark search "keyword"
   ```

3. **Check if task was deleted**:
   - Tasks in Backmark are file-based
   - Check if the task file exists: `ls backlog/task-*.md`

---

### Issue: `Invalid status`

**Symptoms**:
```bash
$ backmark task edit 1 --status "Working"
Error: Invalid status. Must be one of: To Do, In Progress, Review, Done
```

**Solution**:

Use one of the configured statuses:
```bash
# Default statuses
backmark task edit 1 --status "To Do"
backmark task edit 1 --status "In Progress"
backmark task edit 1 --status "Review"
backmark task edit 1 --status "Done"

# Check your configured statuses
cat backlog/config.yml | grep -A 10 "columns:"
```

**Custom statuses**: Edit `backlog/config.yml`:
```yaml
board:
  columns:
    - "Backlog"
    - "To Do"
    - "In Progress"
    - "Testing"
    - "Done"
```

---

### Issue: `Invalid priority`

**Symptoms**:
```bash
$ backmark task create "Test" --priority urgent
Error: Invalid priority. Must be one of: low, medium, high, critical
```

**Solution**:

Use valid priority levels:
```bash
backmark task create "Test" --priority low
backmark task create "Test" --priority medium
backmark task create "Test" --priority high
backmark task create "Test" --priority critical
```

---

### Issue: `Circular dependency detected`

**Symptoms**:
```bash
$ backmark task create "Task C" --depends-on "5"
Error: Circular dependency detected: Task #5 depends on task #3, which depends on task #1, which would depend on task #5
```

**Solution**:

You're trying to create a dependency loop. Review your task dependencies:

```bash
# Check dependencies
backmark task deps 5

# Fix the circular reference
# Either remove the problematic dependency or restructure your tasks
```

**Example of circular dependency**:
```
Task A depends on Task B
Task B depends on Task C
Task C depends on Task A  ← This creates a circle!
```

---

## 🐌 Performance Issues

### Issue: Slow task listing with many tasks

**Symptoms**:
```bash
$ backmark task list
# Takes 5+ seconds with 1000+ tasks
```

**Solutions**:

1. **Enable indexing** (recommended):

   Edit `backlog/config.yml`:
   ```yaml
   performance:
     useIndex: true
     rebuildIndexOnStart: false
   ```

2. **Rebuild index if corrupted**:
   ```bash
   # Delete the cache
   rm -rf backlog/.cache/

   # Next command will rebuild index
   backmark task list
   ```

3. **Use filters to narrow results**:
   ```bash
   # Instead of listing all
   backmark task list --status "In Progress"
   backmark task list --milestone "v1.0"
   ```

---

### Issue: Board view laggy

**Symptoms**:
- Board takes long to load
- Slow navigation in board TUI

**Solutions**:

1. **Enable indexing** (see above)

2. **Reduce number of tasks shown**:
   ```bash
   # Filter by milestone
   backmark board --milestone "current-sprint"
   ```

3. **Close the board and use list view**:
   ```bash
   # Exit board with 'q'
   # Use list view instead
   backmark task list --status "In Progress"
   ```

---

### Issue: Search is slow

**Symptoms**:
```bash
$ backmark search "keyword"
# Takes 10+ seconds
```

**Solutions**:

1. **Enable indexing** (recommended)

2. **Narrow search with filters**:
   ```bash
   backmark search "keyword" --status "In Progress"
   ```

3. **Check number of tasks**:
   ```bash
   # If you have 10,000+ tasks, search will be slow
   # Consider archiving old tasks
   ```

---

## 💾 Data Issues

### Issue: Tasks disappeared

**Symptoms**:
- Tasks were there yesterday, now gone
- `backmark task list` shows fewer tasks

**Solutions**:

1. **Check if files still exist**:
   ```bash
   ls -la backlog/task-*.md
   ```

2. **Check git history if using version control**:
   ```bash
   git log --all --full-history -- "backlog/task-*.md"
   ```

3. **Restore from backup**:
   - If you have backups, restore the `backlog/` directory

4. **Check if index is corrupted**:
   ```bash
   rm -rf backlog/.cache/
   backmark task list  # Rebuilds index
   ```

---

### Issue: Task file corrupted

**Symptoms**:
```bash
$ backmark task view 5
Error: Failed to parse task file: Invalid YAML in frontmatter
```

**Solutions**:

1. **Find the corrupted file**:
   ```bash
   # Task #5 is in a file like:
   ls backlog/task-005*.md
   # or
   ls backlog/task-5*.md
   ```

2. **Check the YAML frontmatter**:
   ```bash
   head -20 backlog/task-005-*.md
   ```

3. **Common YAML errors**:
   ```yaml
   # BAD: Unescaped colon
   title: Fix: Login bug

   # GOOD: Quote strings with colons
   title: "Fix: Login bug"

   # BAD: Unescaped quotes
   description: He said "hello"

   # GOOD: Escape quotes
   description: "He said \"hello\""

   # BAD: Invalid array
   labels: bug, feature

   # GOOD: Proper array syntax
   labels:
     - bug
     - feature
   ```

4. **Fix manually or restore from git**:
   ```bash
   # Restore from git
   git checkout HEAD -- backlog/task-005-*.md
   ```

---

### Issue: Lost AI notes/documentation

**Symptoms**:
- Had AI notes yesterday, now gone
- `ai_plan` field is empty

**Solutions**:

1. **Check git history**:
   ```bash
   git log -p backlog/task-*.md | grep -A 10 "ai_plan"
   ```

2. **Restore from git**:
   ```bash
   git checkout HEAD~1 -- backlog/task-042-*.md
   ```

3. **Prevention**: Always commit AI work:
   ```bash
   git add backlog/
   git commit -m "AI: Added plan for task #42"
   ```

---

## 🎨 Display Issues

### Issue: Colors not showing

**Symptoms**:
- Output is plain text, no colors
- Icons show as squares/question marks

**Solutions**:

1. **Check if terminal supports colors**:
   ```bash
   echo $TERM
   # Should output something like: xterm-256color
   ```

2. **Set TERM variable**:
   ```bash
   export TERM=xterm-256color
   ```

3. **Windows PowerShell/CMD**: Limited color support
   - Use **Windows Terminal** instead (modern, full color support)
   - Or use **Git Bash** or **WSL**

---

### Issue: Unicode icons broken

**Symptoms**:
```
? Task #42
? Status: In Progress
```

**Solutions**:

1. **Install a font with icon support**:
   - [Nerd Fonts](https://www.nerdfonts.com/)
   - [Fira Code](https://github.com/tonsky/FiraCode)

2. **Configure terminal to use the font**

3. **Check locale**:
   ```bash
   locale
   # Should include UTF-8
   # Example: LANG=en_US.UTF-8
   ```

---

### Issue: Table formatting broken

**Symptoms**:
```
| ID | Title     | Status |
| 1  | Fix bug   | To Do  |
    | Another task | Done
```

**Solutions**:

1. **Widen terminal window**:
   - Tables need minimum width
   - Try fullscreen

2. **Use narrow view**:
   ```bash
   # Future feature: Add --narrow flag
   # For now, use list format
   backmark task list --format simple
   ```

---

## 🔗 Integration Issues

### Issue: MCP server not working with Claude Code

**Symptoms**:
- Claude Code can't access Backmark via MCP
- MCP server not responding
- "Server not found" errors

**Solutions**:

1. **Verify MCP server configuration**:
   - Check your Claude Code MCP settings
   - Should include:
   ```json
   {
     "mcpServers": {
       "backmark": {
         "command": "npx",
         "args": ["-y", "@grazulex/backmark", "mcp-server"],
         "cwd": "/path/to/your/project"
       }
     }
   }
   ```

2. **Test MCP server manually**:
   ```bash
   # Run server directly
   npx @grazulex/backmark mcp-server
   # Should start without errors
   ```

3. **Check Backmark installation**:
   ```bash
   # Verify backmark is installed
   npm list -g @grazulex/backmark
   # Or in local project
   npm list @grazulex/backmark
   ```

4. **Verify project has backlog initialized**:
   ```bash
   ls backlog/config.yml
   # Should exist
   ```

5. **Check Claude Code MCP support**:
   - Requires Claude Code with MCP support
   - Update Claude Code if needed

6. **Restart Claude Code**:
   - Exit and restart
   - MCP servers reload on startup

---

### Issue: Git conflicts in task files

**Symptoms**:
```
<<<<<<< HEAD
status: "In Progress"
=======
status: "Done"
>>>>>>> feature-branch
```

**Solutions**:

1. **Resolve manually**:
   ```bash
   # Edit the file
   vim backlog/task-042-*.md

   # Remove conflict markers, keep desired version
   status: "Done"

   # Add and commit
   git add backlog/task-042-*.md
   git commit -m "Resolved conflict in task #42"
   ```

2. **Prevention**: Use separate tasks per branch
   - Branch A works on tasks #1-10
   - Branch B works on tasks #11-20
   - Less likely to conflict

---

## 🐛 Debugging

### Enable Debug Mode

Get detailed logs for troubleshooting:

```bash
# Enable debug logging
DEBUG=backmark* backmark task list

# Or set environment variable
export DEBUG=backmark*
backmark task list
```

### Common Debug Patterns

**Check configuration**:
```bash
cat backlog/config.yml
```

**Check database index**:
```bash
ls -lh backlog/.cache/
# Should see tasks.db if indexing is enabled
```

**Test with minimal task**:
```bash
backmark task create "Test" --description "Minimal test"
backmark task view 1
```

**Check file permissions**:
```bash
ls -la backlog/
# All files should be readable/writable
```

---

## ❓ FAQ

### Q: Can I use Backmark with multiple projects?

**A**: Yes! Each project has its own `backlog/` directory.

```bash
# Project A
cd ~/projects/project-a
backmark init "Project A"

# Project B
cd ~/projects/project-b
backmark init "Project B"

# Each has independent tasks
```

---

### Q: Can I share tasks between team members?

**A**: Yes! Commit the `backlog/` directory to git:

```bash
git add backlog/
git commit -m "Add backlog"
git push

# Team members can pull
git pull
backmark task list  # See shared tasks
```

**Note**: If using indexed mode, each developer's `.cache/` directory is local (in `.gitignore`).

---

### Q: How do I backup my tasks?

**A**: Multiple options:

1. **Git** (recommended):
   ```bash
   git add backlog/
   git commit -m "Backup tasks"
   git push
   ```

2. **Manual backup**:
   ```bash
   cp -r backlog/ backlog-backup-$(date +%Y%m%d)/
   ```

3. **Cloud sync**:
   - Store project in Dropbox/Google Drive/OneDrive
   - `backlog/` syncs automatically

---

### Q: Can I rename task files?

**A**: Not recommended! Task files are named automatically.

If you must:
```bash
# Backmark identifies tasks by ID in frontmatter, not filename
# So renaming file is safe BUT not recommended
mv "backlog/task-001 - Old Name.md" "backlog/task-001 - New Name.md"

# Better: Change title in frontmatter
backmark task edit 1 --title "New Name"
# File will be renamed automatically
```

---

### Q: How do I delete a task?

**A**: Currently, delete the file manually:

```bash
# Find the task file
ls backlog/task-042-*.md

# Delete it
rm backlog/task-042-*.md

# If using indexed mode, rebuild index
rm -rf backlog/.cache/
backmark task list  # Rebuilds
```

**Future**: `backmark task delete <id>` command coming soon!

---

### Q: Can I export tasks to CSV/JSON?

**A**: Not yet, but planned for v0.7.0!

**Workaround**: Tasks are Markdown files, parse them:

```bash
# Extract all task titles
for f in backlog/task-*.md; do
  grep "^title:" "$f"
done

# Or use yq for YAML parsing
npm install -g yq
for f in backlog/task-*.md; do
  yq eval '.title' "$f"
done
```

---

### Q: How do I change board columns?

**A**: Edit `backlog/config.yml`:

```yaml
board:
  columns:
    - "Backlog"      # Add your columns
    - "To Do"
    - "In Progress"
    - "Code Review"
    - "Testing"
    - "Done"
```

Then update task statuses to match:
```bash
backmark task edit 5 --status "Code Review"
```

---

### Q: Can I use Backmark offline?

**A**: Yes! Backmark is **100% offline-first**.

- No internet required
- No cloud sync
- All data stored locally in `backlog/`

---

## 🆘 Getting Help

### Still stuck?

1. **Check documentation**:
   - [Quick Start Guide](quick-start.md)
   - [AI Workflow Guide](ai-workflow.md)
   - [README](../README.md)

2. **Search GitHub Issues**:
   - [Existing Issues](https://github.com/Grazulex/backmark/issues)
   - Someone might have had the same problem!

3. **Ask in Discussions**:
   - [GitHub Discussions](https://github.com/Grazulex/backmark/discussions)
   - Community Q&A

4. **Report a Bug**:
   - [Create Issue](https://github.com/Grazulex/backmark/issues/new)
   - Include:
     - Backmark version: `backmark --version`
     - Node.js version: `node --version`
     - OS: `uname -a` (macOS/Linux) or `ver` (Windows)
     - Command that failed
     - Error message
     - Steps to reproduce

### Debug Information Template

When reporting issues, provide:

```bash
# System info
backmark --version
node --version
npm --version
echo $SHELL
echo $TERM
uname -a  # or 'ver' on Windows

# Backmark config
cat backlog/config.yml

# Task count
ls backlog/task-*.md | wc -l

# Recent error (if any)
DEBUG=backmark* backmark [command that failed]
```

---

## 🔄 Common Workflows

### Reset everything (start fresh)

```bash
# Backup first!
cp -r backlog/ backlog-backup/

# Remove backlog
rm -rf backlog/

# Reinitialize
backmark init "My Project"
```

---

### Migrate from old version

```bash
# Backmark auto-migrates config on load
# Just run any command
backmark task list

# Check config was updated
cat backlog/config.yml
# Should see new fields like 'performance' and 'validations'
```

---

### Fix corrupted index

```bash
# Delete cache
rm -rf backlog/.cache/

# Rebuild index (automatic on next command)
backmark task list
```

---

### Bulk edit tasks

```bash
# Example: Change all 'To Do' tasks to 'Backlog'
for file in backlog/task-*.md; do
  # Use sed to replace in frontmatter
  sed -i 's/^status: "To Do"/status: "Backlog"/' "$file"
done

# Rebuild index if using indexed mode
rm -rf backlog/.cache/
backmark task list
```

---

## 📞 Support

- **Documentation**: [Full docs](../README.md)
- **Discussions**: [GitHub Discussions](https://github.com/Grazulex/backmark/discussions)
- **Issues**: [Report bugs](https://github.com/Grazulex/backmark/issues)
- **Twitter/X**: [@grazulex](https://twitter.com/grazulex)

---

**Still having issues? Don't hesitate to reach out! The Backmark community is here to help.** 🤝
