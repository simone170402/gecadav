export interface DashboardStatItem {
  label: string;
  value: string;
  change: string;
  trend: string;
  icon: 'users' | 'briefcase' | 'calendar' | 'dollar';
  color: 'blue' | 'purple' | 'green' | 'gold';
}

export interface RecentCase {
  id: string;
  client: string;
  type: string;
  status: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UpcomingAppointment {
  time: string;
  client: string;
  type: string;
  duration: string;
}

export interface MonthlyActivity {
  month: string;
  affaires: number;
  clients: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface DashboardResponse {
  stats: DashboardStatItem[];
  recentCases: RecentCase[];
  upcomingAppointments: UpcomingAppointment[];
  monthlyActivity: MonthlyActivity[];
  revenueData: RevenueData[];
}