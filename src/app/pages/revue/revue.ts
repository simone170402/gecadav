import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicationListItem } from '../../admin/publications/publication.model';
import { PublicationService } from '../../admin/publications/publication.service';
import { SubscriptionPlan } from '../../admin/subscription/subscription.model';
import { SubscriptionService } from '../../admin/subscription/subscription.service';

@Component({
  selector: 'app-revue',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './revue.html',
  styleUrl: './revue.css'
})
export class Revue implements OnInit {
  publications: PublicationListItem[] = [];
  plans: SubscriptionPlan[] = [];
  isLoading = false;
  errorMessage = '';
  isSubscribed = false;
  userEmail = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? localStorage.getItem('userEmail') || ''
  : '';

  constructor(
    private publicationService: PublicationService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.loadPublications();
    this.loadPlans();

    if (this.userEmail) {
      this.checkSubscription();
    }
  }

  loadPublications(): void {
    this.isLoading = true;
    this.publicationService.getPublications('REVUE').subscribe({
      next: (data) => {
        this.publications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les publications.';
        this.isLoading = false;
      }
    });
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  checkSubscription(): void {
    this.subscriptionService.hasSubscription(this.userEmail).subscribe({
      next: (value) => {
        this.isSubscribed = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  subscribe(planId: number): void {
    if (!this.userEmail) {
      alert('Veuillez vous connecter pour souscrire à un abonnement.');
      return;
    }

    this.subscriptionService.subscribe({
      planId,
      userEmail: this.userEmail
    }).subscribe({
      next: () => {
        this.isSubscribed = true;
        alert('Abonnement activé avec succès.');
      },
      error: (err) => {
        console.error(err);
        alert('Impossible d’activer l’abonnement.');
      }
    });
  }

  trackById(index: number, item: PublicationListItem): number {
    return item.id;
  }
}