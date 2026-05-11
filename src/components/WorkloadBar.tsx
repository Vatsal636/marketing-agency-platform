import { TeamMember } from '@/types';
import { getWorkloadPercentage, getWorkloadStatus, getWorkloadColor } from '@/lib/utils';

interface WorkloadBarProps {
  member: TeamMember;
  taskCount: number;
}

export default function WorkloadBar({ member, taskCount }: WorkloadBarProps) {
  const percentage = getWorkloadPercentage(taskCount, member.maxCapacity);
  const status = getWorkloadStatus(percentage);

  const statusLabels: Record<string, { label: string; color: string }> = {
    free: { label: 'Available', color: 'text-emerald-400' },
    normal: { label: 'On Track', color: 'text-blue-400' },
    busy: { label: 'Busy', color: 'text-amber-400' },
    overloaded: { label: 'Overloaded', color: 'text-red-400' },
  };

  const { label, color } = statusLabels[status];

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-xl border border-border">
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate">{member.name}</h3>
          <p className="text-[11px] text-text-muted">{member.role}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold ${color}`}>{label}</span>
          <p className="text-[10px] text-text-muted mt-0.5">
            {taskCount}/{member.maxCapacity} tasks
          </p>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getWorkloadColor(status)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
