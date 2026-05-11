'use client';

import { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedCampaigns, seedTasks, seedTeamMembers } from '@/data/seed';
import { Campaign, Task, TeamMember } from '@/types';
import { formatDate, calculateProgress, getCampaignTypeIcon } from '@/lib/utils';
import ProgressBar from '@/components/ProgressBar';

export default function ClientDashboard() {
  const [campaigns] = useLocalStorage<Campaign[]>('campaigns', seedCampaigns);
  const [tasks] = useLocalStorage<Task[]>('tasks', seedTasks);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', seedTeamMembers);
  const [selectedClient, setSelectedClient] = useState<string>('all');

  const clients = useMemo(() => {
    const unique = [...new Set(campaigns.map(c => c.clientName))];
    return unique.sort();
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    if (selectedClient === 'all') return campaigns;
    return campaigns.filter(c => c.clientName === selectedClient);
  }, [campaigns, selectedClient]);

  const getCampaignTasks = (id: string) => tasks.filter(t => t.campaignId === id);
  const getOwnerName = (id: string) => teamMembers.find(m => m.id === id)?.name || 'Unknown';

  // Client-friendly status labels
  const statusLabels: Record<string, string> = {
    'Planning': '📋 Getting things ready',
    'In Progress': '🚀 Work in progress',
    'Review': '👁️ Under review',
    'Delivered': '✅ Complete & delivered',
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Client Dashboard</h1>
          <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">READ-ONLY</span>
        </div>
        <p className="text-sm text-text-secondary">Campaign progress & deliverables for client review</p>
      </div>

      {/* Client selector */}
      <div className="mb-8">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Campaign cards */}
      <div className="space-y-6">
        {filteredCampaigns.map(campaign => {
          const cTasks = getCampaignTasks(campaign.id);
          const progress = calculateProgress(cTasks);
          const doneTasks = cTasks.filter(t => t.status === 'Done').length;

          return (
            <div key={campaign.id} className="glass-card p-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCampaignTypeIcon(campaign.type)}</span>
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{campaign.type}</span>
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">{campaign.name}</h2>
                  <p className="text-sm text-text-secondary">{campaign.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary mb-1">{statusLabels[campaign.status]}</p>
                  <p className="text-xs text-text-muted">Account Manager: {getOwnerName(campaign.owner)}</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-5">{campaign.description}</p>

              {/* Progress */}
              <div className="bg-surface-2 rounded-lg p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-text-primary">Overall Progress</h3>
                  <span className="text-xs text-text-muted">{doneTasks} of {cTasks.length} milestones complete</span>
                </div>
                <ProgressBar value={progress} size="lg" />
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">📅 Started</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(campaign.startDate)}</p>
                </div>
                <div className="bg-surface-2 rounded-lg p-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide mb-1">🎯 Expected Delivery</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(campaign.deadline)}</p>
                </div>
              </div>

              {/* Deliverables */}
              {campaign.deliverables.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">📦 Deliverables</h3>
                  <div className="space-y-2">
                    {campaign.deliverables.map((d, i) => {
                      const isComplete = i < doneTasks;
                      return (
                        <div key={i} className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg ${isComplete ? 'bg-emerald-500/10' : 'bg-surface-2'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isComplete ? 'bg-emerald-500 text-white' : 'bg-surface border border-border text-text-muted'}`}>
                            {isComplete ? '✓' : (i + 1)}
                          </span>
                          <span className={isComplete ? 'text-emerald-400 line-through opacity-70' : 'text-text-secondary'}>{d}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
