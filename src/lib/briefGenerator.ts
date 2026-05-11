import { BriefInput, GeneratedBrief, TaskPriority, TaskStatus } from '@/types';

/**
 * Deterministic "AI" campaign brief generator.
 * Uses keyword matching and templates to generate realistic-looking task suggestions.
 * No real AI API calls - purely local logic.
 */

const taskTemplates: Record<string, { title: string; priority: TaskPriority; status: TaskStatus }[]> = {
  'SEO': [
    { title: 'Conduct comprehensive SEO audit', priority: 'High', status: 'To Do' },
    { title: 'Perform keyword research and gap analysis', priority: 'High', status: 'To Do' },
    { title: 'Develop on-page optimization strategy', priority: 'Medium', status: 'To Do' },
    { title: 'Create content pillar framework', priority: 'Medium', status: 'To Do' },
    { title: 'Build backlink acquisition plan', priority: 'Medium', status: 'To Do' },
    { title: 'Set up rank tracking and reporting', priority: 'Low', status: 'To Do' },
    { title: 'Optimize meta titles and descriptions', priority: 'High', status: 'To Do' },
    { title: 'Fix technical SEO issues (crawlability, indexing)', priority: 'Urgent', status: 'To Do' },
    { title: 'Create XML sitemap and schema markup', priority: 'Medium', status: 'To Do' },
    { title: 'Monthly SEO performance report', priority: 'Low', status: 'To Do' },
  ],
  'Social Media': [
    { title: 'Develop social media strategy document', priority: 'High', status: 'To Do' },
    { title: 'Create content calendar (30 days)', priority: 'High', status: 'To Do' },
    { title: 'Design post templates and brand kit', priority: 'Medium', status: 'To Do' },
    { title: 'Shoot and edit short-form video content', priority: 'High', status: 'To Do' },
    { title: 'Identify and reach out to influencers', priority: 'Medium', status: 'To Do' },
    { title: 'Set up social listening and monitoring', priority: 'Low', status: 'To Do' },
    { title: 'Create community engagement playbook', priority: 'Medium', status: 'To Do' },
    { title: 'Plan and execute giveaway campaign', priority: 'Medium', status: 'To Do' },
    { title: 'Build UGC campaign framework', priority: 'Low', status: 'To Do' },
    { title: 'Weekly social analytics reporting', priority: 'Low', status: 'To Do' },
  ],
  'Paid Ads': [
    { title: 'Define target audience and buyer personas', priority: 'High', status: 'To Do' },
    { title: 'Set up Google Ads campaign structure', priority: 'Urgent', status: 'To Do' },
    { title: 'Create ad copy variations (10+)', priority: 'High', status: 'To Do' },
    { title: 'Design display and banner ad creatives', priority: 'High', status: 'To Do' },
    { title: 'Build high-converting landing pages', priority: 'Urgent', status: 'To Do' },
    { title: 'Set up conversion tracking and pixels', priority: 'High', status: 'To Do' },
    { title: 'Configure retargeting campaigns', priority: 'Medium', status: 'To Do' },
    { title: 'Plan A/B testing framework', priority: 'Medium', status: 'To Do' },
    { title: 'Set up automated bid strategies', priority: 'Low', status: 'To Do' },
    { title: 'Weekly PPC performance dashboard', priority: 'Low', status: 'To Do' },
  ],
  'Content Marketing': [
    { title: 'Develop content strategy and editorial plan', priority: 'High', status: 'To Do' },
    { title: 'Conduct audience research and persona mapping', priority: 'High', status: 'To Do' },
    { title: 'Create content pillar topics and clusters', priority: 'Medium', status: 'To Do' },
    { title: 'Write long-form blog posts (5)', priority: 'High', status: 'To Do' },
    { title: 'Design infographics and visual content', priority: 'Medium', status: 'To Do' },
    { title: 'Develop email marketing sequences', priority: 'High', status: 'To Do' },
    { title: 'Create lead magnet / whitepaper', priority: 'Medium', status: 'To Do' },
    { title: 'Build content distribution plan', priority: 'Low', status: 'To Do' },
    { title: 'Set up content performance tracking', priority: 'Low', status: 'To Do' },
    { title: 'Monthly content performance analysis', priority: 'Low', status: 'To Do' },
  ],
};

// Simple keyword-based personalization
function personalizeTitle(title: string, input: BriefInput): string {
  if (input.goals.toLowerCase().includes('launch')) {
    title = title.replace('strategy', 'launch strategy');
  }
  if (input.goals.toLowerCase().includes('brand')) {
    title = title.replace('content', 'brand content');
  }
  return title;
}

// Estimate timeline based on task count and input
function estimateTimeline(taskCount: number, timelineInput: string): string {
  if (timelineInput.toLowerCase().includes('asap') || timelineInput.toLowerCase().includes('urgent')) {
    return '4-6 weeks (accelerated)';
  }
  if (taskCount <= 5) return '4-6 weeks';
  if (taskCount <= 8) return '6-8 weeks';
  return '8-12 weeks';
}

// Generate deliverables based on campaign type and goals
function generateDeliverables(type: string, goals: string): string[] {
  const baseDeliverables: Record<string, string[]> = {
    'SEO': ['SEO Audit Report', 'Keyword Strategy Document', 'Technical Fixes Log', 'Monthly Rank Report'],
    'Social Media': ['Social Media Strategy', 'Content Calendar', 'Brand Guidelines', 'Monthly Analytics Report'],
    'Paid Ads': ['Campaign Strategy Deck', 'Ad Creative Suite', 'Landing Pages', 'ROI/ROAS Report'],
    'Content Marketing': ['Content Strategy Document', 'Blog Post Series', 'Email Sequences', 'Performance Dashboard'],
  };

  const deliverables = [...(baseDeliverables[type] || baseDeliverables['Content Marketing'])];

  if (goals.toLowerCase().includes('video')) deliverables.push('Video Content Package');
  if (goals.toLowerCase().includes('email')) deliverables.push('Email Nurture Sequence');
  if (goals.toLowerCase().includes('social')) deliverables.push('Social Media Kit');

  return deliverables;
}

export function generateBrief(input: BriefInput): GeneratedBrief {
  const templates = taskTemplates[input.campaignType] || taskTemplates['Content Marketing'];

  // Select 5-8 tasks based on goals complexity
  const goalsWordCount = input.goals.split(' ').length;
  const taskCount = Math.min(Math.max(5, Math.floor(goalsWordCount / 5) + 4), 8);

  const selectedTasks = templates.slice(0, taskCount).map(task => ({
    ...task,
    title: personalizeTitle(task.title, input),
    assignee: '',  // unassigned — to be set by user
    dueDate: '',   // to be set based on timeline
  }));

  const campaignName = `${input.clientName} ${input.campaignType} Campaign`;
  const description = `A comprehensive ${input.campaignType.toLowerCase()} campaign for ${input.clientName} focused on ${input.goals.substring(0, 100)}. Budget: ${input.budget}. Timeline: ${input.timeline}.`;

  return {
    campaignName,
    description,
    suggestedTasks: selectedTasks,
    estimatedTimeline: estimateTimeline(taskCount, input.timeline),
    keyDeliverables: generateDeliverables(input.campaignType, input.goals),
  };
}
