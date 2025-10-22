#!/bin/bash

# Backmark Installation Script
# Installs Backmark globally for use with Claude Code

set -e

echo "🎯 Backmark Installation"
echo "========================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo ""

# Link globally
echo "🔗 Linking globally..."
npm link
echo ""

# Verify installation
echo "✅ Verifying installation..."
if command -v backmark &> /dev/null; then
    echo "✅ Backmark installed successfully!"
    echo ""
    echo "Version: $(backmark --version)"
    echo "Location: $(which backmark)"
    echo ""
else
    echo "❌ Installation failed: backmark command not found"
    exit 1
fi

# Create Claude Code skill directory if needed
SKILL_DIR="$HOME/.config/claude-code/skills"
SKILL_FILE="$SKILL_DIR/backmark.md"

if [ ! -d "$SKILL_DIR" ]; then
    echo "📁 Creating Claude Code skills directory..."
    mkdir -p "$SKILL_DIR"
fi

# Copy agent file as skill
if [ ! -f "$SKILL_FILE" ]; then
    echo "📝 Installing Backmark skill for Claude Code..."
    cp .claude/agents/backmark-agent.md "$SKILL_FILE"
    echo "✅ Skill installed at: $SKILL_FILE"
    echo ""
fi

# Instructions
echo "🚀 Next Steps"
echo "============"
echo ""
echo "1. Navigate to your project:"
echo "   cd /path/to/your/project"
echo ""
echo "2. Initialize Backmark:"
echo "   backmark init \"Your Project Name\""
echo ""
echo "3. Create your first task:"
echo "   backmark task create \"First task\" -a \"Claude\" -p high"
echo ""
echo "4. View the Kanban board:"
echo "   backmark board show"
echo ""
echo "5. Read the documentation:"
echo "   cat $(pwd)/README.md"
echo "   cat $(pwd)/CLAUDE_CODE_SETUP.md"
echo ""
echo "Happy vibe coding! 🎉"
