'use client';

import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedCampaigns, seedTasks, seedTeamMembers } from '@/data/seed';
import { Campaign, Task, TeamMember, CampaignStatus, CampaignType } from '@/types';
import CampaignCard from '@/components/CampaignCard';

export default function CampaignsDashboard() {
  const [campaigns] = useLocalStorage<Campaign[]>('campaigns', seedCampaigns);
  const [tasks] = useLocalStorage<Task[]>('tasks', seedTasks);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', seedTeamMembers);

  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (typeFilter !== 'All' && c.type !== typeFilter) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !c.clientName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, statusFilter, typeFilter, searchQuery]);

  const getTeamMemberName = (id: string) => teamMembers.find(m => m.id === id)?.name || 'Unknown';
  const getCampaignTasks = (campaignId: string) => tasks.filter(t => t.campaignId === campaignId);

  // Stats
  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'In Progress').length,
    review: campaigns.filter(c => c.status === 'Review').length,
    delivered: campaigns.filter(c => c.status === 'Delivered').length,
  }), [campaigns]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Campaign Dashboard</h1>
        <p className="text-sm text-text-secondary">Track and manage all active marketing campaigns</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Campaigns', value: stats.total, icon: '📊', color: 'border-accent/30' },
          { label: 'In Progress', value: stats.active, icon: '🔥', color: 'border-amber-500/30' },
          { label: 'In Review', value: stats.review, icon: '👁️', color: 'border-purple-500/30' },
          { label: 'Delivered', value: stats.delivered, icon: '✅', color: 'border-emerald-500/30' },
        ].map((stat) => (
          <div key={stat.label} className={`glass-card p-4 border-l-2 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search campaigns or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'All')}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as CampaignType | 'All')}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="SEO">SEO</option>
          <option value="Social Media">Social Media</option>
          <option value="Paid Ads">Paid Ads</option>
          <option value="Content Marketing">Content Marketing</option>
        </select>
      </div>

      {/* Campaign grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No campaigns found</h3>
          <p className="text-sm text-text-muted">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign, idx) => (
            <div key={campaign.id} style={{ animationDelay: `${idx * 80}ms` }}>
              <CampaignCard
                campaign={campaign}
                tasks={getCampaignTasks(campaign.id)}
                teamMemberName={getTeamMemberName(campaign.owner)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
