#!/bin/bash
set -e

echo "🚀 Setting up Echo (pi + Absurd swarm system)..."

# 1. Check Postgres
if ! command -v psql &> /dev/null; then
  echo "❌ PostgreSQL is required. Please install it first."
  exit 1
fi

# 2. Create absurd2 database if it doesn't exist
echo "→ Creating absurd2 database (if needed)..."
createdb absurd2 2>/dev/null || true

# 3. Apply Absurd schema (you may need to adjust path)
echo "→ Applying Absurd schema..."
# uvx absurdctl apply-schema --db absurd2 || echo "⚠️  Run this manually if schema fails"

# 4. Install pi skill (symlink)
echo "→ Installing Echo as a pi skill..."
mkdir -p ~/.pi/agent/skills
ln -sfn ~/.pi/agent/swarm ~/.pi/agent/skills/echo 2>/dev/null || true

echo ""
echo "✅ Echo setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start a worker:     /echo worker"
echo "  2. Run a test:         /echo test"
echo "  3. Open dashboard:     habitat run -db-name absurd2"
echo ""
echo "You can now use natural language or YAML workflows with Echo."
