import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);

  get role(): string | null {
    return this.authService.getRole();
  }

  canSeeDashboard(): boolean {
    return ['ADMIN', 'AVOCAT', 'COMPTABLE', 'SECRETAIRE'].includes(this.role ?? '');
  }

  canSeeClients(): boolean {
    return ['ADMIN', 'AVOCAT', 'SECRETAIRE'].includes(this.role ?? '');
  }

  canSeeAffaires(): boolean {
    return ['ADMIN', 'AVOCAT'].includes(this.role ?? '');
  }

  canSeeProcurations(): boolean {
    return ['ADMIN', 'AVOCAT'].includes(this.role ?? '');
  }

  canSeeRendezVous(): boolean {
    return ['ADMIN', 'AVOCAT', 'SECRETAIRE'].includes(this.role ?? '');
  }

  canSeeDocuments(): boolean {
    return ['ADMIN', 'AVOCAT', 'SECRETAIRE'].includes(this.role ?? '');
  }

  canSeeEquipe(): boolean {
    return ['ADMIN', 'AVOCAT'].includes(this.role ?? '');
  }

  canSeeFacturation(): boolean {
    return ['ADMIN', 'COMPTABLE', 'AVOCAT'].includes(this.role ?? '');
  }

  canSeeTaches(): boolean {
    return ['ADMIN', 'AVOCAT', 'SECRETAIRE'].includes(this.role ?? '');
  }

  canSeeStatistiques(): boolean {
    return ['ADMIN', 'AVOCAT', 'COMPTABLE'].includes(this.role ?? '');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}