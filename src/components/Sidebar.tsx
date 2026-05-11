'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Campaigns', icon: '📊', description: 'Active campaigns' },
  { href: '/workload', label: 'Workload', icon: '👥', description: 'Team capacity' },
  { href: '/clients', label: 'Client View', icon: '🏢', description: 'Client dashboard' },
  { href: '/brief', label: 'AI Brief', icon: '✨', description: 'Generate briefs' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center text-lg">
            🚀
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary tracking-tight">CampaignHub</h1>
            <p className="text-xs text-text-muted">Marketing Agency PM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const isCampaignDetail = item.href === '/' && pathname.startsWith('/campaigns/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive || isCampaignDetail
                  ? 'bg-accent/15 text-accent-hover border border-accent/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div>{item.label}</div>
                <div className={`text-[10px] ${isActive || isCampaignDetail ? 'text-accent/60' : 'text-text-muted'}`}>
                  {item.description}
                </div>
              </div>
              {(isActive || isCampaignDetail) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs">
              👤
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Admin User</p>
              <p className="text-[10px] text-text-muted">Agency Manager</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
