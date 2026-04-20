import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AffaireItem, AffaireStats } from './affaires.model';
import { AffairesService } from './affaires.service';

@Component({
  selector: 'app-affaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affaires.html',
  styleUrl: './affaires.css'
})
export class Affaires implements OnInit {
  private affairesService = inject(AffairesService);

  affaires: AffaireItem[] = [];
  filteredAffaires: AffaireItem[] = [];
  stats: AffaireStats | null = null;

  searchTerm = '';
  selectedTab: 'all' | 'active' | 'closed' = 'all';
  typeFilter = 'Tous les types';

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;

  newCase: {
    titre: string;
    clientId?: number;
    type: string;
    priorite: AffaireItem['priorite'];
    assigneA: string;
    dateEcheance: string;
    description: string;
    statut: AffaireItem['statut'];
    progression: number;
  } = {
    titre: '',
    clientId: undefined,
    type: '',
    priorite: 'medium',
    assigneA: '',
    dateEcheance: '',
    description: '',
    statut: 'En attente',
    progression: 0
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.affairesService.getAll().subscribe({
      next: (affaires) => {
        this.affaires = affaires;
        this.applyFilters();

        this.affairesService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques des affaires.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les affaires.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredAffaires = this.affaires.filter((item) => {
      const matchesSearch =
        item.titre.toLowerCase().includes(term) ||
        item.client.toLowerCase().includes(term) ||
        item.reference.toLowerCase().includes(term);

      const matchesTab =
        this.selectedTab === 'all' ||
        (this.selectedTab === 'active' && item.statut !== 'Clôturée') ||
        (this.selectedTab === 'closed' && item.statut === 'Clôturée');

      const matchesType =
        this.typeFilter === 'Tous les types' || item.type === this.typeFilter;

      return matchesSearch && matchesTab && matchesType;
    });
  }

  setTab(tab: 'all' | 'active' | 'closed'): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  createCase(): void {
    if (!this.newCase.titre || !this.newCase.clientId || !this.newCase.type) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.affairesService.create(this.newCase).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer l’affaire.';
      }
    });
  }

  get activeCasesCount(): number {
    return this.affaires.filter(a => a.statut !== 'Clôturée').length;
  }

  get closedCasesCount(): number {
    return this.affaires.filter(a => a.statut === 'Clôturée').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En cours':
        return 'status-blue';
      case 'Audience prévue':
        return 'status-purple';
      case 'En attente':
        return 'status-orange';
      case 'Clôturée':
        return 'status-green';
      default:
        return 'status-gray';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-red';
      case 'medium':
        return 'priority-orange';
      case 'low':
        return 'priority-green';
      default:
        return 'priority-gray';
    }
  }

  

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Moyen';
      case 'low':
        return 'Faible';
      default:
        return priority;
    }
  }

  getBorderColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#94a3b8';
    }
  }

  resetForm(): void {
  this.newCase = {
    titre: '',
    clientId: undefined,
    type: '',
    priorite: 'medium',
    assigneA: '',
    dateEcheance: '',
    description: '',
    statut: 'En attente',
    progression: 0
  };
}

}