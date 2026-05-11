import Link from 'next/link';
import { Campaign, Task } from '@/types';
import { formatDate, daysUntilDeadline, calculateProgress, getCampaignTypeColor, getCampaignTypeIcon } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

interface CampaignCardProps {
  campaign: Campaign;
  tasks: Task[];
  teamMemberName: string;
}

export default function CampaignCard({ campaign, tasks, teamMemberName }: CampaignCardProps) {
  const progress = calculateProgress(tasks);
  const daysLeft = daysUntilDeadline(campaign.deadline);
  const isOverdue = daysLeft < 0;
  const isUrgent = daysLeft >= 0 && daysLeft <= 7;

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="glass-card p-5 cursor-pointer group animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCampaignTypeColor(campaign.type)}`}>
              {getCampaignTypeIcon(campaign.type)} {campaign.type}
            </span>
          </div>
          <StatusBadge status={campaign.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-accent-hover transition-colors">
          {campaign.name}
        </h3>
        <p className="text-xs text-text-secondary mb-4">{campaign.clientName}</p>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar value={progress} size="sm" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">👤</span>
            <span>{teamMemberName}</span>
          </div>
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : isUrgent ? 'text-amber-400' : ''}`}>
            <span className="text-sm">📅</span>
            <span>
              {isOverdue
                ? `${Math.abs(daysLeft)}d overdue`
                : `${daysLeft}d left`
              }
            </span>
          </div>
        </div>

        {/* Task count */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>{tasks.length} tasks</span>
          <span>{tasks.filter(t => t.status === 'Done').length} completed</span>
        </div>
      </div>
    </Link>
  );
}
