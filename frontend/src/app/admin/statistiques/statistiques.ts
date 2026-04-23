import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { StatistiquesService } from './statistiques.service';
import { StatistiquesDashboard } from './statistiques.model';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css'
})
export class Statistiques implements OnInit {
  private statistiquesService = inject(StatistiquesService);
  private platformId = inject(PLATFORM_ID);

  data: StatistiquesDashboard | null = null;
  isLoading = true;
  errorMessage = '';

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenus',
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.15)',
        tension: 0.35,
        fill: false
      }
    ]
  };

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b']
      }
    ]
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Clients',
        backgroundColor: '#8b5cf6',
        borderRadius: 8
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.isLoading = false;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.statistiquesService.getDashboard().subscribe({
      next: (response) => {
        this.data = response;
        this.buildCharts(response);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les statistiques.';
        this.isLoading = false;
      }
    });
  }

  private buildCharts(response: StatistiquesDashboard): void {
    this.lineChartData = {
      labels: response.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          data: response.monthlyRevenue.map(item => item.revenue),
          label: 'Revenus',
          borderColor: '#1e3a8a',
          backgroundColor: 'rgba(30, 58, 138, 0.15)',
          tension: 0.35,
          fill: false
        }
      ]
    };

    this.pieChartData = {
      labels: response.casesByType.map(item => item.name),
      datasets: [
        {
          data: response.casesByType.map(item => item.value),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b']
        }
      ]
    };

    this.barChartData = {
      labels: response.clientGrowth.map(item => item.month),
      datasets: [
        {
          data: response.clientGrowth.map(item => item.clients),
          label: 'Clients',
          backgroundColor: '#8b5cf6',
          borderRadius: 8
        }
      ]
    };
  }
}