import type { 
  Client, 
  ClientStatus, 
  Prospect, 
  ProspectInterest, 
  ProspectStatus,
  DashboardStats,
  RevenueData,
  ClientStatusData,
  ProspectStatusData,
  User,
  ContentItem
} from '$lib/types';

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'epicu_rennes@example.com',
    role: 'admin',
    name: 'Admin User',
    city: 'Rennes',
    is_active: true,
    created_at: '2023-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z'
  },
  {
    id: 2,
    email: 'epicu_lyon@example.com',
    role: 'user',
    name: 'Regular User',
    city: 'Lyon',
    is_active: true,
    created_at: '2023-11-02T10:00:00Z',
    updated_at: '2025-01-02T10:00:00Z'
  },
  {
    id: 3,
    email: 'epicu_paris@example.com',
    role: 'user',
    name: 'Regular User',
    city: 'Paris',
    is_active: true,
    created_at: '2023-11-03T10:00:00Z',
    updated_at: '2025-01-05T10:00:00Z'
  }
];

// Mock Clients Data
export const mockClients: Client[] = [
  {
    id: 1,
    user_id: 1,
    name: 'John Doe',
    company_name: 'Bistro Parisien',
    business_category: 'food',
    contact_email: 'john.doe@bistro.com',
    contact_phone: '+33 6 12 34 56 78',
    status: 'closed_won',
    signed_date: '2023-11-15',
    estimated_monthly_revenue: 3500,
    created_at: '2023-11-15T10:30:00Z',
    updated_at: '2023-12-01T14:45:00Z'
  },
  {
    id: 2,
    user_id: 1,
    name: 'Marie Dupont',
    company_name: 'Voyages Express',
    business_category: 'travel',
    contact_email: 'marie.dupont@voyages.fr',
    contact_phone: '+33 7 98 76 54 32',
    status: 'meeting_scheduled',
    signed_date: null,
    estimated_monthly_revenue: null,
    created_at: '2023-11-20T09:15:00Z',
    updated_at: '2023-11-28T11:20:00Z'
  },
  {
    id: 3,
    user_id: 2,
    name: 'Pierre Martin',
    company_name: 'Boutique Chic',
    business_category: 'shop',
    contact_email: 'pierre@boutiquechic.com',
    contact_phone: '+33 6 45 67 89 01',
    status: 'proposal_sent',
    signed_date: null,
    estimated_monthly_revenue: null,
    created_at: '2023-11-10T13:45:00Z',
    updated_at: '2023-11-25T16:30:00Z'
  }
];

// Mock Prospects Data
export const mockProspects: Prospect[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Emma Laurent',
    company_name: 'Café du Coin',
    business_category: 'food',
    contact_email: 'emma@cafeducoin.fr',
    contact_phone: '+33 6 23 45 67 89',
    interest_level: 'high',
    status: 'new',
    next_follow_up_date: '2023-12-10',
    notes: 'Interested in our video production services',
    created_at: '2023-12-01T14:30:00Z',
    updated_at: '2023-12-01T14:30:00Z'
  },
  {
    id: 2,
    user_id: 2,
    name: 'Louis Petit',
    company_name: 'Aventures Tours',
    business_category: 'travel',
    contact_email: 'louis@aventures.fr',
    contact_phone: '+33 7 34 56 78 90',
    interest_level: 'medium',
    status: 'contacted',
    next_follow_up_date: '2023-12-05',
    notes: 'Found via LinkedIn campaign',
    created_at: '2023-11-28T11:15:00Z',
    updated_at: '2023-11-30T15:20:00Z'
  }
];

// Mock Content Items
export const mockContentItems: ContentItem[] = [
  {
    id: 1,
    client_id: 1,
    content_type: 'video',
    title: 'Restaurant Ambiance',
    description: 'Showcasing the cozy atmosphere of Bistro Parisien',
    instagram_post_url: 'https://instagram.com/p/example1',
    created_at: '2023-11-20T10:00:00Z',
    updated_at: '2023-11-20T10:00:00Z'
  },
  {
    id: 2,
    client_id: 1,
    content_type: 'photo',
    title: 'Special Menu',
    description: 'Highlighting the new seasonal menu',
    instagram_post_url: 'https://instagram.com/p/example2',
    created_at: '2023-11-25T14:30:00Z',
    updated_at: '2023-11-25T14:30:00Z'
  }
];

// Mock Statistics Data
export const mockDashboardStats: DashboardStats = {
  totalClients: mockClients.length,
  totalProspects: mockProspects.length,
  totalVideosPublished: mockContentItems.filter(item => item.content_type === 'video').length,
  monthlyRevenue: mockClients.reduce((sum, client) => sum + (client.estimated_monthly_revenue || 0), 0),
  closingRate: 68,
  conversionRate: 42
};

export const mockRevenueData: RevenueData[] = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 22000 },
  { month: 'Apr', amount: 25000 },
  { month: 'May', amount: 27000 },
  { month: 'Jun', amount: 30000 },
  { month: 'Jul', amount: 32000 },
  { month: 'Aug', amount: 29000 },
  { month: 'Sep', amount: 31000 },
  { month: 'Oct', amount: 33000 },
  { month: 'Nov', amount: 35000 },
  { month: 'Dec', amount: 38000 }
];

export const mockClientStatusData: ClientStatusData[] = [
  { status: 'Contacté', count: 1 },
  { status: 'Sans réponse', count: 1 },
  { status: 'Rendez-vous planifié', count: 1 },
  { status: 'Proposition envoyée', count: 1 },
  { status: 'En négociation', count: 1 },
  { status: 'Clôturé (positive)', count: 1 },
  { status: 'Clôturé (négative)', count: 1 }
];

export const mockProspectStatusData: ProspectStatusData[] = [
  { status: 'Nouveau', count: 2 },
  { status: 'Contacté', count: 1 },
  { status: 'Qualifié', count: 1 },
  { status: 'Converti', count: 1 },
  { status: 'Disqualifié', count: 1 }
];

// Helper function to get client status display name
export const getClientStatusName = (status: ClientStatus): string => {
  const statusMap: Record<ClientStatus, string> = {
    contacted: 'Contacté',
    not_responded: 'Sans réponse',
    meeting_scheduled: 'Rendez-vous planifié',
    proposal_sent: 'Proposition envoyée',
    negotiation: 'En négociation',
    closed_won: 'Clôturé (positive)',
    closed_lost: 'Clôturé (négative)'
  };
  
  return statusMap[status] || status;
};

// Helper function to get prospect status display name
export const getProspectStatusName = (status: ProspectStatus): string => {
  const statusMap: Record<ProspectStatus, string> = {
    new: 'Nouveau',
    contacted: 'Contacté',
    qualified: 'Qualifié',
    converted: 'Converti',
    disqualified: 'Disqualifié'
  };
  return statusMap[status] || status;
};

// Helper function to get interest level display name
export const getInterestLevelName = (interest: ProspectInterest): string => {
  const interestMap: Record<ProspectInterest, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };
  
  return interestMap[interest] || interest;
};

// Helper function to get color class for client status
export const getClientStatusColorClass = (status: ClientStatus): string => {
  const colorMap: Record<ClientStatus, string> = {
    contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    not_responded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    meeting_scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    proposal_sent: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    closed_won: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    closed_lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

// Helper function to get color class for prospect status
export const getProspectStatusColorClass = (status: ProspectStatus): string => {
  const colorMap: Record<ProspectStatus, string> = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    qualified: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    converted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    disqualified: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

// Helper function to get color class for prospect interest
export const getProspectInterestColorClass = (interest: ProspectInterest): string => {
  const colorMap: Record<ProspectInterest, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };
  
  return colorMap[interest] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};