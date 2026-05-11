// Core data types for the Marketing Agency Project Management System

export type CampaignType = 'SEO' | 'Social Media' | 'Paid Ads' | 'Content Marketing';
export type CampaignStatus = 'Planning' | 'In Progress' | 'Review' | 'Delivered';
export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Campaign {
  id: string;
  name: string;
  clientName: string;
  type: CampaignType;
  owner: string;       // team member id
  deadline: string;     // ISO date string
  status: CampaignStatus;
  description: string;
  deliverables: string[];
  startDate: string;
  budget?: string;
}

export interface Task {
  id: string;
  campaignId: string;
  title: string;
  assignee: string;    // team member id
  dueDate: string;     // ISO date string
  priority: TaskPriority;
  status: TaskStatus;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;      // emoji or initials
  maxCapacity: number;  // max tasks at a time
}

// For the AI brief generator
export interface BriefInput {
  clientName: string;
  campaignType: CampaignType;
  goals: string;
  budget: string;
  timeline: string;
}

export interface GeneratedBrief {
  campaignName: string;
  description: string;
  suggestedTasks: Omit<Task, 'id' | 'campaignId'>[];
  estimatedTimeline: string;
  keyDeliverables: string[];
}
