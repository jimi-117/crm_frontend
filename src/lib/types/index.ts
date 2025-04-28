// Client type
export interface Client {
  id: number;
  user_id: number;
  name: string;
  company_name: string | null;
  business_category: 'food' | 'travel' | 'shop';
  contact_email: string | null;
  contact_phone: string | null;
  status: ClientStatus;
  signed_date: string | null;
  estimated_monthly_revenue: number | null;
  created_at: string;
  updated_at: string;
}

// Client status options
export type ClientStatus = 
  | 'contacted'
  | 'not_responded'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

// User type
export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  name: string;
  city: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Prospect type
export interface Prospect {
  id: number;
  user_id: number;
  name: string;
  company_name: string | null;
  business_category: 'food' | 'travel' | 'shop';
  contact_email: string | null;
  contact_phone: string | null;
  interest_level: ProspectInterest;
  status: ProspectStatus;
  next_follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Content Item type
export interface ContentItem {
  id: number;
  client_id: number;
  content_type: 'video' | 'photo' | 'story';
  title: string | null;
  description: string | null;
  instagram_post_url: string;
  created_at: string;
  updated_at: string;
}

// Prospect interest level
export type ProspectInterest = 'low' | 'medium' | 'high';

// Prospect status options
export type ProspectStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified';

// Statistics types
export interface DashboardStats {
  totalClients: number;
  totalProspects: number;
  totalVideosPublished: number;
  monthlyRevenue: number;
  closingRate: number;
  conversionRate: number;
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface ClientStatusData {
  status: string;
  count: number;
}

export interface ProspectStatusData {
  status: string;
  count: number;
}