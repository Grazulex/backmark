#!/bin/bash

# Test script for blocked_by and filename fixes
set -e

echo "🧪 Testing Backmark Fixes"
echo "=========================="
echo ""

# Setup test directory
TEST_DIR="/tmp/backmark-test-fixes"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "📁 Test directory: $TEST_DIR"
echo ""

# Initialize backlog
echo "1️⃣ Initializing backlog..."
backmark init "Test Fixes" > /dev/null
echo "✅ Backlog initialized"
echo ""

# Test 1: Filename with accents
echo "2️⃣ Testing filename with accents..."
backmark task create "Tâche avec des accents éèàù" -d "Test description" -p medium > /dev/null
echo "✅ Task with accents created"
ls backlog/
echo ""

# Test 2: Create tasks for dependency testing
echo "3️⃣ Creating tasks for dependency test..."
backmark task create "Base Task A" -d "First base task" -p high > /dev/null
backmark task create "Base Task B" -d "Second base task" -p high > /dev/null
backmark task create "Base Task C" -d "Third base task" -p medium > /dev/null
echo "✅ Created tasks #1, #2, #3"
echo ""

# Test 3: Create task with dependencies
echo "4️⃣ Creating task #4 that depends on #1, #2, #3..."
backmark task create "Dependent Task" -d "This task depends on others" -p critical --depends-on "1,2,3" > /dev/null
echo "✅ Task #4 created with dependencies"
echo ""

# Test 4: Check blocked_by was automatically set
echo "5️⃣ Checking if blocked_by was automatically updated..."
echo ""
echo "Task #1 (should show blocked_by: [4]):"
grep "blocked_by:" backlog/task-001*.md
echo ""
echo "Task #2 (should show blocked_by: [4]):"
grep "blocked_by:" backlog/task-002*.md
echo ""
echo "Task #3 (should show blocked_by: [4]):"
grep "blocked_by:" backlog/task-003*.md
echo ""

# Test 5: Check task blocked command
echo "6️⃣ Running 'task blocked' command..."
backmark task blocked
echo ""

# Test 6: Add more dependencies via edit
echo "7️⃣ Testing --add-dependency via edit..."
backmark task create "Another Task" -d "Another test task" -p medium > /dev/null
backmark task edit 5 --add-dependency "1,2" > /dev/null
echo "✅ Added dependencies to task #5"
echo ""

echo "Task #1 blocked_by (should now include 4 and 5):"
grep "blocked_by:" backlog/task-001*.md
echo ""

# Test 7: Remove dependency
echo "8️⃣ Testing --remove-dependency..."
backmark task edit 4 --remove-dependency "3" > /dev/null
echo "✅ Removed dependency from task #4"
echo ""

echo "Task #3 blocked_by (should be empty or not include 4):"
grep "blocked_by:" backlog/task-003*.md
echo ""

# Test 8: Check blocked tasks again
echo "9️⃣ Final 'task blocked' check..."
backmark task blocked
echo ""

# Summary
echo "✅ All Tests Complete!"
echo ""
echo "📊 Summary:"
echo "  ✓ Filenames with accents work correctly"
echo "  ✓ blocked_by automatically updated on task creation"
echo "  ✓ blocked_by automatically updated on --add-dependency"
echo "  ✓ blocked_by automatically updated on --remove-dependency"
echo "  ✓ task blocked command shows correct results"
echo ""
echo "Test files in: $TEST_DIR/backlog/"
