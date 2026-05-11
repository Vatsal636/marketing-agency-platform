'use client';

import { useState } from 'react';
import { CampaignType } from '@/types';
import { generateBrief, } from '@/lib/briefGenerator';
import type { GeneratedBrief, BriefInput } from '@/types';

export default function BriefPage() {
  const [clientName, setClientName] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('SEO');
  const [goals, setGoals] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<GeneratedBrief | null>(null);

  const handleGenerate = async () => {
    if (!clientName || !goals) return;
    setIsGenerating(true);
    setBrief(null);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const input: BriefInput = { clientName, campaignType, goals, budget, timeline };
    const result = generateBrief(input);
    setBrief(result);
    setIsGenerating(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">AI Brief Generator</h1>
          <span className="text-[10px] font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/30 animate-pulse-glow">
            ✨ AI-Powered
          </span>
        </div>
        <p className="text-sm text-text-secondary">Generate campaign briefs and task suggestions from client requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">📝 Client Requirements</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Client Name *</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g., Acme Corp" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Campaign Type *</label>
              <select value={campaignType} onChange={e => setCampaignType(e.target.value as CampaignType)} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                <option value="SEO">SEO</option>
                <option value="Social Media">Social Media</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Content Marketing">Content Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Goals & Requirements *</label>
              <textarea value={goals} onChange={e => setGoals(e.target.value)} placeholder="Describe the client's goals, target audience, key messaging, and any specific requirements..." rows={5} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Budget</label>
                <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g., $25,000" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Timeline</label>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="e.g., 8 weeks" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={isGenerating || !clientName || !goals} className="w-full px-4 py-3 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing requirements...
                </>
              ) : (
                <>✨ Generate Campaign Brief</>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          {isGenerating && (
            <div className="glass-card p-8 text-center">
              <div className="inline-block w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
              <h3 className="text-sm font-semibold text-text-primary mb-1">AI is analyzing your requirements...</h3>
              <p className="text-xs text-text-muted">Generating campaign strategy and task breakdown</p>
              <div className="mt-4 space-y-2">
                {['Analyzing goals', 'Mapping deliverables', 'Creating task plan'].map((step, i) => (
                  <div key={step} className="shimmer rounded-lg p-3 text-xs text-text-muted animate-fade-in" style={{ animationDelay: `${i * 400}ms` }}>
                    {step}...
                  </div>
                ))}
              </div>
            </div>
          )}

          {brief && !isGenerating && (
            <div className="space-y-4 animate-fade-in">
              {/* Campaign name */}
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Generated Campaign</h3>
                <h2 className="text-lg font-bold text-text-primary mb-2">{brief.campaignName}</h2>
                <p className="text-sm text-text-secondary">{brief.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                  <span>⏱️ {brief.estimatedTimeline}</span>
                  <span>📋 {brief.suggestedTasks.length} tasks</span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Key Deliverables</h3>
                <div className="space-y-2">
                  {brief.keyDeliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Suggested Tasks</h3>
                <div className="space-y-2">
                  {brief.suggestedTasks.map((task, i) => (
                    <div key={i} className="flex items-center justify-between bg-surface-2 rounded-lg px-3 py-2.5 border border-border/50">
                      <span className="text-sm text-text-primary">{task.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        task.priority === 'Urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        task.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        task.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!brief && !isGenerating && (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Ready to generate</h3>
              <p className="text-sm text-text-muted">Fill in the client requirements and click generate to create a campaign brief with AI-suggested tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
