'use client';

import { useState, useEffect } from 'react';
import { Campaign, TeamMember, CampaignStatus, CampaignType } from '@/types';
import { generateId } from '@/lib/utils';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
  teamMembers: TeamMember[];
}

export default function CampaignModal({ isOpen, onClose, onSave, teamMembers }: CampaignModalProps) {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState<CampaignType>('Content Marketing');
  const [owner, setOwner] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<CampaignStatus>('Planning');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName('');
      setClientName('');
      setType('Content Marketing');
      setOwner('');
      setDeadline('');
      setStatus('Planning');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const campaign: Campaign = {
      id: generateId(),
      name,
      clientName,
      type,
      owner,
      deadline,
      status,
      description,
      deliverables: [],
      startDate: new Date().toISOString().split('T')[0], // today
      budget: 'TBD',
    };
    onSave(campaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 modal-overlay z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-xl w-full max-w-lg animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-lg font-semibold text-text-primary">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Campaign Name & Client Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Campaign Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Summer Launch"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="e.g., Acme Corp"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
          </div>

          {/* Type & Owner */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Campaign Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CampaignType)}
                required
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              >
                <option value="SEO">SEO</option>
                <option value="Social Media">Social Media</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Content Marketing">Content Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Owner *</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              >
                <option value="">Select owner</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                required
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add campaign details..."
              rows={3}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-2 hover:bg-surface-hover rounded-lg border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
