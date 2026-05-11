'use client';

import { Task, TeamMember } from '@/types';
import { formatDate, getPriorityColor } from '@/lib/utils';

interface TaskTableProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function TaskTable({ tasks, teamMembers, onEditTask, onDeleteTask, onStatusChange }: TaskTableProps) {
  const getMemberName = (id: string) => teamMembers.find(m => m.id === id)?.name || 'Unassigned';

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">No tasks yet</h3>
        <p className="text-xs text-text-muted">Create a task to get started with this campaign</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Task</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Assignee</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Due Date</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Priority</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr
                key={task.id}
                className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">{task.title}</div>
                  {task.description && (
                    <div className="text-[11px] text-text-muted mt-0.5 truncate max-w-[300px]">{task.description}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-text-secondary">{getMemberName(task.assignee)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-text-secondary tabular-nums">{formatDate(task.dueDate)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                    className="text-xs bg-transparent border border-border rounded-md px-2 py-1 text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="w-7 h-7 rounded-md bg-surface-2 hover:bg-accent/20 flex items-center justify-center text-text-muted hover:text-accent transition-colors text-xs"
                      title="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="w-7 h-7 rounded-md bg-surface-2 hover:bg-red-500/20 flex items-center justify-center text-text-muted hover:text-red-400 transition-colors text-xs"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
