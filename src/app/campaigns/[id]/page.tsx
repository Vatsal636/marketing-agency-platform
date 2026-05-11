'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedCampaigns, seedTasks, seedTeamMembers } from '@/data/seed';
import { Campaign, Task, TeamMember } from '@/types';
import { formatDate, daysUntilDeadline, calculateProgress, getCampaignTypeColor, getCampaignTypeIcon } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ProgressBar from '@/components/ProgressBar';
import TaskTable from '@/components/TaskTable';
import TaskModal from '@/components/TaskModal';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>('campaigns', seedCampaigns);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', seedTasks);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', seedTeamMembers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<string>('All');

  const campaign = campaigns.find(c => c.id === campaignId);
  const campaignTasks = useMemo(() => {
    let filtered = tasks.filter(t => t.campaignId === campaignId);
    if (taskFilter !== 'All') {
      filtered = filtered.filter(t => t.status === taskFilter);
    }
    return filtered;
  }, [tasks, campaignId, taskFilter]);

  const allCampaignTasks = tasks.filter(t => t.campaignId === campaignId);
  const progress = calculateProgress(allCampaignTasks);

  if (!campaign) {
    return (
      <div className="animate-fade-in text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Campaign not found</h2>
        <Link href="/" className="text-accent hover:text-accent-hover text-sm">← Back to dashboard</Link>
      </div>
    );
  }

  const ownerName = teamMembers.find(m => m.id === campaign.owner)?.name || 'Unknown';
  const daysLeft = daysUntilDeadline(campaign.deadline);

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) {
        return prev.map(t => t.id === task.id ? task : t);
      }
      return [...prev, task];
    });
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Task status counts for the filter bar
  const statusCounts = useMemo(() => ({
    all: allCampaignTasks.length,
    todo: allCampaignTasks.filter(t => t.status === 'To Do').length,
    inProgress: allCampaignTasks.filter(t => t.status === 'In Progress').length,
    review: allCampaignTasks.filter(t => t.status === 'Review').length,
    done: allCampaignTasks.filter(t => t.status === 'Done').length,
  }), [allCampaignTasks]);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Campaigns</Link>
        <span>/</span>
        <span className="text-text-secondary">{campaign.name}</span>
      </div>

      {/* Campaign header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getCampaignTypeColor(campaign.type)}`}>
                {getCampaignTypeIcon(campaign.type)} {campaign.type}
              </span>
              <StatusBadge status={campaign.status} />
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-1">{campaign.name}</h1>
            <p className="text-sm text-text-secondary">{campaign.clientName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted mb-1">Budget</p>
            <p className="text-lg font-bold text-text-primary">{campaign.budget || 'TBD'}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-5">{campaign.description}</p>

        {/* Campaign meta */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Owner</p>
            <p className="text-sm font-medium text-text-primary">{ownerName}</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Start Date</p>
            <p className="text-sm font-medium text-text-primary">{formatDate(campaign.startDate)}</p>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Deadline</p>
            <p className={`text-sm font-medium ${daysLeft < 0 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-text-primary'}`}>
              {formatDate(campaign.deadline)}
            </p>
          </div>
          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Time Left</p>
            <p className={`text-sm font-medium ${daysLeft < 0 ? 'text-red-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-text-secondary">Campaign Progress</p>
            <p className="text-xs text-text-muted">{statusCounts.done}/{statusCounts.all} tasks done</p>
          </div>
          <ProgressBar value={progress} size="md" />
        </div>
      </div>

      {/* Deliverables */}
      {campaign.deliverables.length > 0 && (
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">📦 Deliverables</h3>
          <div className="flex flex-wrap gap-2">
            {campaign.deliverables.map((d, i) => (
              <span key={i} className="inline-flex items-center text-xs bg-surface-2 text-text-secondary px-3 py-1.5 rounded-full border border-border">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tasks section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">Tasks</h2>
            {/* Task filter pills */}
            <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-border">
              {[
                { key: 'All', label: 'All', count: statusCounts.all },
                { key: 'To Do', label: 'To Do', count: statusCounts.todo },
                { key: 'In Progress', label: 'Active', count: statusCounts.inProgress },
                { key: 'Review', label: 'Review', count: statusCounts.review },
                { key: 'Done', label: 'Done', count: statusCounts.done },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setTaskFilter(f.key)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                    taskFilter === f.key
                      ? 'bg-accent/20 text-accent-hover'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Task
          </button>
        </div>

        <TaskTable
          tasks={campaignTasks}
          teamMembers={teamMembers}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        existingTask={editingTask}
        campaignId={campaignId}
        teamMembers={teamMembers}
      />
    </div>
  );
}
