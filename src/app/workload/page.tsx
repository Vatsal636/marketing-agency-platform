'use client';

import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedCampaigns, seedTasks, seedTeamMembers } from '@/data/seed';
import { Campaign, Task, TeamMember } from '@/types';
import WorkloadBar from '@/components/WorkloadBar';

export default function WorkloadPage() {
  const [tasks] = useLocalStorage<Task[]>('tasks', seedTasks);
  const [teamMembers] = useLocalStorage<TeamMember[]>('teamMembers', seedTeamMembers);

  const memberWorkload = useMemo(() => {
    return teamMembers.map(member => {
      const activeTasks = tasks.filter(t => t.assignee === member.id && t.status !== 'Done');
      const allTasks = tasks.filter(t => t.assignee === member.id);
      return { member, activeTaskCount: activeTasks.length, totalTaskCount: allTasks.length, allTasks };
    }).sort((a, b) => (b.activeTaskCount / b.member.maxCapacity) - (a.activeTaskCount / a.member.maxCapacity));
  }, [teamMembers, tasks]);

  const stats = useMemo(() => ({
    overloaded: memberWorkload.filter(m => m.activeTaskCount / m.member.maxCapacity > 0.85).length,
    available: memberWorkload.filter(m => m.activeTaskCount / m.member.maxCapacity <= 0.25).length,
    totalActive: tasks.filter(t => t.status !== 'Done').length,
    teamSize: teamMembers.length,
  }), [memberWorkload, tasks, teamMembers]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Team Workload</h1>
        <p className="text-sm text-text-secondary">Monitor team capacity and task distribution</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Team Size', value: stats.teamSize, icon: '👥', color: 'border-accent/30' },
          { label: 'Active Tasks', value: stats.totalActive, icon: '📋', color: 'border-amber-500/30' },
          { label: 'Available', value: stats.available, icon: '✅', color: 'border-emerald-500/30' },
          { label: 'Overloaded', value: stats.overloaded, icon: '🔴', color: 'border-red-500/30' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {memberWorkload.map(({ member, activeTaskCount }, idx) => (
          <div key={member.id} style={{ animationDelay: `${idx * 60}ms` }}>
            <WorkloadBar member={member} taskCount={activeTaskCount} />
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">📊 Detailed Task Distribution</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Member</th>
              <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">To Do</th>
              <th className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Active</th>
              <th className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Review</th>
              <th className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Done</th>
              <th className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {memberWorkload.map(({ member, allTasks, totalTaskCount }) => (
              <tr key={member.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="text-lg">{member.avatar}</span><span className="text-sm font-medium text-text-primary">{member.name}</span></div></td>
                <td className="px-4 py-3 text-xs text-text-secondary">{member.role}</td>
                <td className="px-4 py-3 text-center text-xs text-text-secondary">{allTasks.filter(t => t.status === 'To Do').length}</td>
                <td className="px-4 py-3 text-center text-xs text-amber-400">{allTasks.filter(t => t.status === 'In Progress').length}</td>
                <td className="px-4 py-3 text-center text-xs text-purple-400">{allTasks.filter(t => t.status === 'Review').length}</td>
                <td className="px-4 py-3 text-center text-xs text-emerald-400">{allTasks.filter(t => t.status === 'Done').length}</td>
                <td className="px-4 py-3 text-center text-xs font-semibold text-text-primary">{totalTaskCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
