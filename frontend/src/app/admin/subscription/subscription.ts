import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
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

  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);


  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPlans();
    } else {
      this.isLoading = false;
      this.ctr.detectChanges();
    }
  }

  loadPlans(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptionService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.isLoading = false;
        this.ctr.detectChanges();

      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les abonnements.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }
}