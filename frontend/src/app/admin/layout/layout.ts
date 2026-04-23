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

  get userEmail(): string {
    return this.authService.getEmail() || '';
  }

  get displayName(): string {
    const email = this.userEmail;

    if (!email) {
      return 'Utilisateur';
    }

    const beforeAt = email.split('@')[0]?.trim();
    if (!beforeAt) {
      return 'Utilisateur';
    }

    const cleaned = beforeAt
      .replace(/[._-]+/g, ' ')
      .trim();

    return cleaned
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  get roleLabel(): string {
    switch (this.role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'AVOCAT':
        return 'Avocat';
      case 'SECRETAIRE':
        return 'Secrétaire';
      case 'COMPTABLE':
        return 'Comptable';
      default:
        return 'Utilisateur';
    }
  }

  get userInitials(): string {
    const name = this.displayName;

    if (!name || name === 'Utilisateur') {
      return 'U';
    }

    const parts = name.split(' ').filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
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

  canSeePublications(): boolean {
    return ['ADMIN', 'AVOCAT'].includes(this.role ?? '');
  }

  canSeeSubscription(): boolean {
    return ['ADMIN'].includes(this.role ?? '');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}