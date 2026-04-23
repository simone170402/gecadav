import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {
  DashboardResponse,
  DashboardStatItem,
  MonthlyActivity,
  RecentCase,
  RevenueData,
  UpcomingAppointment
} from './dashboard.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  isLoading = true;
  errorMessage = '';

  stats: DashboardStatItem[] = [];
  recentCases: RecentCase[] = [];
  upcomingAppointments: UpcomingAppointment[] = [];
  monthlyActivity: MonthlyActivity[] = [];
  revenueData: RevenueData[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardData().subscribe({
      next: (response: DashboardResponse) => {
        this.stats = response.stats;
        this.recentCases = response.recentCases;
        this.upcomingAppointments = response.upcomingAppointments;
        this.monthlyActivity = response.monthlyActivity;
        this.revenueData = response.revenueData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur dashboard:', error);
        this.errorMessage = 'Impossible de charger les statistiques du dashboard.';
        this.isLoading = false;
      }
    });
  }

  getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
    if (priority === 'high') return 'Urgent';
    if (priority === 'medium') return 'Moyen';
    return 'Faible';
  }

  getPriorityClass(priority: 'high' | 'medium' | 'low'): string {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  }

  getStatColorClass(color: 'blue' | 'purple' | 'green' | 'gold'): string {
    if (color === 'blue') return 'stat-blue';
    if (color === 'purple') return 'stat-purple';
    if (color === 'green') return 'stat-green';
    return 'stat-gold';
  }

  getMaxActivityValue(): number {
    if (!this.monthlyActivity.length) return 0;
    return Math.max(...this.monthlyActivity.flatMap(item => [item.affaires, item.clients]));
  }

  getBarHeight(value: number): number {
    const max = this.getMaxActivityValue();
    if (!max) return 0;
    return (value / max) * 170;
  }

  getMaxRevenueValue(): number {
    if (!this.revenueData.length) return 0;
    return Math.max(...this.revenueData.map(item => item.revenue));
  }

  getRevenueHeight(value: number): number {
    const max = this.getMaxRevenueValue();
    if (!max) return 0;
    return (value / max) * 180;
  }
}