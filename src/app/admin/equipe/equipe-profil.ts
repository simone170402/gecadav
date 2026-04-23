import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EquipeService } from './equipe.service';
import { MembreProfil } from './equipe.model';

@Component({
  selector: 'app-equipe-profil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipe-profil.html',
  styleUrl: './equipe-profil.css'
})
export class EquipeProfil implements OnInit {
  private route = inject(ActivatedRoute);
  private equipeService = inject(EquipeService);
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);


  profil: MembreProfil | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      this.ctr.detectChanges();
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Membre introuvable.';
      this.isLoading = false;
      this.ctr.detectChanges();
      return;
    }

    this.equipeService.getProfil(id).subscribe({
      next: (data) => {
        this.profil = data;
        this.isLoading = false;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger le profil.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  getPriorityLabel(priority?: string | null): string {
    switch (priority) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Moyen';
      case 'low':
        return 'Faible';
      default:
        return priority || '—';
    }
  }
}