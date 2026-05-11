import { Task, CampaignStatus, TaskStatus, TaskPriority, CampaignType } from '@/types';

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Calculate days remaining until deadline
export function daysUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate campaign progress based on its tasks
export function calculateProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  return Math.round((doneTasks / tasks.length) * 100);
}

// Get color class for campaign status
export function getStatusColor(status: CampaignStatus | TaskStatus): string {
  const colors: Record<string, string> = {
    'Planning': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'To Do': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return colors[status] || 'bg-slate-500/20 text-slate-400';
}

// Get color for priority
export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    'Low': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    'Medium': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Urgent': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[priority];
}

// Get color for campaign type
export function getCampaignTypeColor(type: CampaignType): string {
  const colors: Record<CampaignType, string> = {
    'SEO': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Social Media': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Paid Ads': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Content Marketing': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };
  return colors[type];
}

// Get icon for campaign type
export function getCampaignTypeIcon(type: CampaignType): string {
  const icons: Record<CampaignType, string> = {
    'SEO': '🔍',
    'Social Media': '📱',
    'Paid Ads': '💰',
    'Content Marketing': '✍️',
  };
  return icons[type];
}

// Calculate workload percentage
export function getWorkloadPercentage(taskCount: number, maxCapacity: number): number {
  return Math.min(Math.round((taskCount / maxCapacity) * 100), 100);
}

// Get workload status
export function getWorkloadStatus(percentage: number): 'free' | 'normal' | 'busy' | 'overloaded' {
  if (percentage <= 25) return 'free';
  if (percentage <= 60) return 'normal';
  if (percentage <= 85) return 'busy';
  return 'overloaded';
}

// Get workload color
export function getWorkloadColor(status: string): string {
  const colors: Record<string, string> = {
    'free': 'bg-emerald-500',
    'normal': 'bg-blue-500',
    'busy': 'bg-amber-500',
    'overloaded': 'bg-red-500',
  };
  return colors[status] || 'bg-slate-500';
}
