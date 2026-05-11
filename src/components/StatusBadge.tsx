import { getStatusColor } from '@/lib/utils';
import { CampaignStatus, TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: CampaignStatus | TaskStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getStatusColor(status)} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Done' || status === 'Delivered' ? 'bg-emerald-400' :
        status === 'In Progress' ? 'bg-amber-400' :
        status === 'Review' ? 'bg-purple-400' :
        status === 'Planning' ? 'bg-blue-400' :
        'bg-slate-400'
      }`} />
      {status}
    </span>
  );
}
