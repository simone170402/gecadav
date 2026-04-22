import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SubscriptionPlan } from './subscription.model';
import { SubscriptionService } from './subscription.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptionService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les abonnements.';
        this.isLoading = false;
      }
    });
  }
}