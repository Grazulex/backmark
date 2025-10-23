import { Box, Text, render, useApp, useInput } from 'ink';
// biome-ignore lint/style/useImportType: React is required for JSX
import React, { useCallback, useEffect, useState } from 'react';
import type { Backlog } from '../core/backlog.js';
import type { ProjectConfig, Task } from '../types/index.js';

interface BoardProps {
  backlog: Backlog;
  columns: string[];
}

const Board: React.FC<BoardProps> = ({ backlog, columns }) => {
  const { exit } = useApp();
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [tasksByColumn, setTasksByColumn] = useState<Record<string, Task[]>>({});
  const [projectName, setProjectName] = useState('Unknown');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  const VISIBLE_TASKS = 12; // Number of tasks visible at once

  // Load tasks
  const loadTasks = useCallback(async () => {
    const newTasksByColumn: Record<string, Task[]> = {};
    for (const column of columns) {
      newTasksByColumn[column] = await backlog.getTasksByStatus(column);
    }
    setTasksByColumn(newTasksByColumn);

    const project = backlog.getConfig<ProjectConfig>('project');
    setProjectName(project?.name || 'Unknown');
    setLastUpdate(new Date());
  }, [backlog, columns]);

  // Initial load and auto-refresh
  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 3000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  // Keyboard navigation
  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      if (showDetails) {
        setShowDetails(false);
      } else {
        exit();
      }
    }

    if (input === 'r') {
      loadTasks();
    }

    if (showDetails) {
      // Only ESC works in details mode
      return;
    }

    // Move task to next status (s key)
    if (input === 's') {
      const currentColumnTasks = tasksByColumn[columns[selectedColumn]] || [];
      const task = currentColumnTasks[selectedTaskIndex];
      if (task) {
        // Get next status in cycle
        const currentStatusIndex = columns.indexOf(task.status);
        const nextStatusIndex = (currentStatusIndex + 1) % columns.length;
        const nextStatus = columns[nextStatusIndex];

        // Update task status
        backlog.updateTask(task.id, { status: nextStatus }).then(() => {
          loadTasks();
        });
      }
    }

    if (key.leftArrow) {
      setSelectedColumn((prev) => Math.max(0, prev - 1));
      setSelectedTaskIndex(0);
      setScrollOffset(0);
    }

    if (key.rightArrow) {
      setSelectedColumn((prev) => Math.min(columns.length - 1, prev + 1));
      setSelectedTaskIndex(0);
      setScrollOffset(0);
    }

    if (key.upArrow) {
      const currentColumnTasks = tasksByColumn[columns[selectedColumn]] || [];
      if (currentColumnTasks.length > 0) {
        setSelectedTaskIndex((prev) => Math.max(0, prev - 1));
        if (selectedTaskIndex <= scrollOffset) {
          setScrollOffset((prev) => Math.max(0, prev - 1));
        }
      }
    }

    if (key.downArrow) {
      const currentColumnTasks = tasksByColumn[columns[selectedColumn]] || [];
      if (currentColumnTasks.length > 0) {
        setSelectedTaskIndex((prev) => Math.min(currentColumnTasks.length - 1, prev + 1));
        if (selectedTaskIndex >= scrollOffset + VISIBLE_TASKS - 1) {
          const maxOffset = Math.max(0, currentColumnTasks.length - VISIBLE_TASKS);
          setScrollOffset((prev) => Math.min(maxOffset, prev + 1));
        }
      }
    }

    if (key.return || input === ' ') {
      const currentColumnTasks = tasksByColumn[columns[selectedColumn]] || [];
      if (currentColumnTasks.length > 0) {
        setShowDetails(true);
      }
    }
  });

  const getTotalTasks = () => {
    return Object.values(tasksByColumn).reduce((sum, tasks) => sum + tasks.length, 0);
  };

  // Get current selected task
  const currentColumnTasks = tasksByColumn[columns[selectedColumn]] || [];
  const selectedTask = currentColumnTasks[selectedTaskIndex];

  // Calculate dynamic title width based on terminal width
  const terminalWidth = process.stdout.columns || 120;
  const columnCount = columns.length;
  // Account for borders (2 per column), margins (1 between columns), padding (2 per column)
  const usedSpace = columnCount * 4 + (columnCount - 1) * 1 + 4; // 4 extra for main borders
  const availableWidth = terminalWidth - usedSpace;
  const columnWidth = Math.floor(availableWidth / columnCount);
  // Reserve space for "#001 M " (8 chars)
  const titleWidth = Math.max(10, columnWidth - 8);

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="round" borderColor="cyan" paddingX={1}>
        <Text bold color="cyan">
          Backmark Kanban Board
        </Text>
        <Text dimColor> | </Text>
        <Text>{projectName}</Text>
        <Text dimColor> | </Text>
        <Text dimColor>
          {getTotalTasks()} task{getTotalTasks() !== 1 ? 's' : ''}
        </Text>
      </Box>

      {/* Columns - Only show if not in details mode */}
      {!showDetails && (
        <Box flexDirection="row" flexGrow={1} marginTop={1}>
          {columns.map((column, index) => {
            const tasks = tasksByColumn[column] || [];
            const isSelected = index === selectedColumn;
            const visibleTasks = tasks.slice(scrollOffset, scrollOffset + VISIBLE_TASKS);

            return (
              <Box
                key={column}
                flexDirection="column"
                borderStyle="round"
                borderColor={isSelected ? 'yellow' : getColumnColor(column)}
                flexGrow={1}
                flexBasis={0}
                minWidth={20}
                marginRight={index < columns.length - 1 ? 1 : 0}
                paddingX={1}
              >
                {/* Column header */}
                <Text bold color={getColumnColor(column)}>
                  {truncate(column, 12)} ({tasks.length})
                </Text>

                {/* Tasks */}
                <Box flexDirection="column" marginTop={1}>
                  {visibleTasks.length === 0 ? (
                    <Text dimColor>Empty</Text>
                  ) : (
                    visibleTasks.map((task, idx) => {
                      const absoluteIndex = scrollOffset + idx;
                      const isTaskSelected = isSelected && absoluteIndex === selectedTaskIndex;
                      return (
                        <Box key={task.id} flexDirection="column">
                          {/* Single line: ID + Priority + Title */}
                          <Text
                            inverse={isTaskSelected}
                            color={isTaskSelected ? 'black' : undefined}
                            backgroundColor={isTaskSelected ? 'white' : undefined}
                          >
                            <Text bold color={isTaskSelected ? 'black' : 'cyan'}>
                              #{String(task.id).padStart(3, '0')}
                            </Text>
                            <Text> </Text>
                            <Text
                              color={isTaskSelected ? 'black' : getPriorityColor(task.priority)}
                            >
                              {getPrioritySymbol(task.priority)}
                            </Text>
                            <Text> {truncate(task.title, titleWidth)}</Text>
                          </Text>
                        </Box>
                      );
                    })
                  )}
                </Box>

                {/* Scroll indicator */}
                {tasks.length > VISIBLE_TASKS && (
                  <Box marginTop={1}>
                    <Text dimColor>
                      {scrollOffset + 1}-{Math.min(scrollOffset + VISIBLE_TASKS, tasks.length)} of{' '}
                      {tasks.length}
                      {isSelected && ' ↑↓'}
                    </Text>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Task Details View */}
      {showDetails && selectedTask && (
        <Box flexDirection="column" flexGrow={1} marginTop={1} paddingX={2}>
          <Box borderStyle="double" borderColor="yellow" padding={1} flexDirection="column">
            <Text bold color="yellow">
              Task #{selectedTask.id} - {selectedTask.title}
            </Text>
            <Text dimColor>{'─'.repeat(Math.min(80, terminalWidth - 10))}</Text>

            {/* Main Info */}
            <Box marginTop={1} flexDirection="column">
              <Text>
                <Text bold>Status: </Text>
                <Text color={getColumnColor(selectedTask.status)}>{selectedTask.status}</Text>
                <Text bold> | Priority: </Text>
                <Text color={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Text>
              </Text>

              {selectedTask.assignees.length > 0 && (
                <Text>
                  <Text bold>Assignees: </Text>
                  {selectedTask.assignees.join(', ')}
                </Text>
              )}

              {selectedTask.milestone && (
                <Text>
                  <Text bold>Milestone: </Text>
                  <Text color="cyan">{selectedTask.milestone}</Text>
                </Text>
              )}

              {selectedTask.keywords.length > 0 && (
                <Text>
                  <Text bold>Keywords: </Text>
                  <Text dimColor>{selectedTask.keywords.join(', ')}</Text>
                </Text>
              )}

              {selectedTask.labels.length > 0 && (
                <Text>
                  <Text bold>Labels: </Text>
                  <Text dimColor>{selectedTask.labels.join(', ')}</Text>
                </Text>
              )}
            </Box>

            {/* Dates */}
            <Box marginTop={1} flexDirection="column">
              <Text bold>Dates:</Text>
              {selectedTask.created_date && (
                <Text dimColor>
                  {' '}
                  Created: {new Date(selectedTask.created_date).toLocaleDateString()}
                </Text>
              )}
              {selectedTask.updated_date && (
                <Text dimColor>
                  {' '}
                  Updated: {new Date(selectedTask.updated_date).toLocaleDateString()}
                </Text>
              )}
              {selectedTask.start_date && <Text> Start: {selectedTask.start_date}</Text>}
              {selectedTask.end_date && <Text> End: {selectedTask.end_date}</Text>}
              {selectedTask.release_date && (
                <Text color="yellow"> Release: {selectedTask.release_date}</Text>
              )}
            </Box>

            {/* Acceptance Criteria */}
            {selectedTask.acceptance_criteria.length > 0 && (
              <Box marginTop={1} flexDirection="column">
                <Text bold>
                  Acceptance Criteria (
                  {selectedTask.acceptance_criteria.filter((c) => c.checked).length}/
                  {selectedTask.acceptance_criteria.length}):
                </Text>
                {selectedTask.acceptance_criteria.map((criteria, idx) => (
                  <Text key={`criteria-${idx}-${criteria.text.substring(0, 10)}`}>
                    <Text color={criteria.checked ? 'green' : 'gray'}>
                      {criteria.checked ? '  [x] ' : '  [ ] '}
                    </Text>
                    <Text dimColor={!criteria.checked}>{criteria.text}</Text>
                  </Text>
                ))}
              </Box>
            )}

            {/* Dependencies */}
            {(selectedTask.dependencies.length > 0 || selectedTask.blocked_by.length > 0) && (
              <Box marginTop={1} flexDirection="column">
                <Text bold>Dependencies:</Text>
                {selectedTask.dependencies.length > 0 && (
                  <Text>
                    <Text> Depends on: </Text>
                    <Text color="cyan">
                      {selectedTask.dependencies.map((id) => `#${id}`).join(', ')}
                    </Text>
                  </Text>
                )}
                {selectedTask.blocked_by.length > 0 && (
                  <Text>
                    <Text color="red"> Blocked by: </Text>
                    <Text color="red">
                      {selectedTask.blocked_by.map((id) => `#${id}`).join(', ')}
                    </Text>
                  </Text>
                )}
              </Box>
            )}

            {/* Hierarchy */}
            {(selectedTask.parent_task || selectedTask.subtasks.length > 0) && (
              <Box marginTop={1} flexDirection="column">
                <Text bold>Hierarchy:</Text>
                {selectedTask.parent_task && (
                  <Text>
                    <Text> Parent: </Text>
                    <Text color="cyan">#{selectedTask.parent_task}</Text>
                  </Text>
                )}
                {selectedTask.subtasks.length > 0 && (
                  <Text>
                    <Text> Subtasks: </Text>
                    <Text color="cyan">
                      {selectedTask.subtasks.map((id) => `#${id}`).join(', ')}
                    </Text>
                  </Text>
                )}
              </Box>
            )}

            {/* Description */}
            {selectedTask.description && (
              <Box marginTop={1} flexDirection="column">
                <Text bold>Description:</Text>
                <Text>{selectedTask.description}</Text>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Box borderStyle="round" borderColor="blue" paddingX={1} marginTop={1}>
        {showDetails ? (
          <>
            <Text bold>ESC/q</Text>
            <Text>:Back to board</Text>
          </>
        ) : (
          <>
            <Text bold>r</Text>
            <Text>:Refresh </Text>
            <Text bold>&lt;-&gt;</Text>
            <Text>:Switch </Text>
            <Text bold>^v</Text>
            <Text>:Scroll </Text>
            <Text bold>s</Text>
            <Text>:Next status </Text>
            <Text bold>Enter</Text>
            <Text>:View </Text>
            <Text bold>q</Text>
            <Text>:Quit </Text>
            <Text dimColor>| Updated: {lastUpdate.toLocaleTimeString()}</Text>
          </>
        )}
      </Box>
    </Box>
  );
};

function getColumnColor(column: string): 'gray' | 'yellow' | 'cyan' | 'green' | 'red' {
  const colors: Record<string, 'gray' | 'yellow' | 'cyan' | 'green' | 'red'> = {
    'To Do': 'gray',
    'In Progress': 'yellow',
    Review: 'cyan',
    Done: 'green',
    Blocked: 'red',
  };
  return colors[column] || 'gray';
}

function getPriorityColor(priority: string): 'blue' | 'yellow' | 'red' | 'magenta' | 'white' {
  const colors: Record<string, 'blue' | 'yellow' | 'red' | 'magenta' | 'white'> = {
    low: 'blue',
    medium: 'yellow',
    high: 'red',
    critical: 'magenta',
  };
  return colors[priority] || 'white';
}

function getPrioritySymbol(priority: string): string {
  const symbols: Record<string, string> = {
    low: 'L',
    medium: 'M',
    high: 'H',
    critical: '!',
  };
  return symbols[priority] || '-';
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

export async function renderBoard(backlog: Backlog, columns: string[]): Promise<void> {
  // Check if raw mode is supported before rendering
  if (!process.stdin.isTTY) {
    throw new Error(
      'Interactive board requires a TTY terminal.\n' +
        'This command cannot be run from non-interactive environments.'
    );
  }

  const { waitUntilExit } = render(<Board backlog={backlog} columns={columns} />);

  // Wait for the board to exit, then cleanup
  await waitUntilExit();

  // Close the backlog to stop LokiJS autosave timer
  await backlog.close();
}
