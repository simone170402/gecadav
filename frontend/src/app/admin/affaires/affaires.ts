import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AffaireItem, AffaireStats } from './affaires.model';
import { AffairesService } from './affaires.service';
import { ClientsService } from '../clients/clients.service';
import { ClientItem } from '../clients/clients.model';

@Component({
  selector: 'app-affaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affaires.html',
  styleUrl: './affaires.css'
})
export class Affaires implements OnInit {
  private affairesService = inject(AffairesService);
  private clientsService = inject(ClientsService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  affaires: AffaireItem[] = [];
  filteredAffaires: AffaireItem[] = [];
  stats: AffaireStats | null = null;
  clients: ClientItem[] = [];

  searchTerm = '';
  selectedTab: 'all' | 'active' | 'closed' = 'all';
  typeFilter = 'Tous les types';

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;
  isEditDialogOpen = false;
  selectedAffaire: AffaireItem | null = null;

  newCase: {
    titre: string;
    clientId?: number;
    type: string;
    priorite: 'high' | 'medium' | 'low';
    assigneA: string;
    dateEcheance: string;
    description: string;
    statut: 'En attente' | 'En cours' | 'Audience prévue' | 'Clôturée';
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

  editCase: {
    id?: number;
    titre: string;
    clientId?: number;
    type: string;
    priorite: 'high' | 'medium' | 'low';
    assigneA: string;
    dateEcheance: string;
    description: string;
    statut: 'En attente' | 'En cours' | 'Audience prévue' | 'Clôturée';
    progression: number;
  } = {
    id: undefined,
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
    if (isPlatformBrowser(this.platformId)) {
      this.loadClients();
      this.loadData();
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.affairesService.getAll().subscribe({
      next: (affaires) => {
        this.affaires = affaires;
        this.applyFilters();

        this.affairesService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques des affaires.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les affaires.';
        this.isLoading = false;
        this.cdr.detectChanges();
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

    this.cdr.detectChanges();
  }

  setTab(tab: 'all' | 'active' | 'closed'): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
    this.cdr.detectChanges();
  }

  createCase(): void {
    if (!this.newCase.titre || !this.newCase.clientId || !this.newCase.type) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      }
    });
  }

  viewAffaire(item: AffaireItem): void {
    this.selectedAffaire = item;
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedAffaire = null;
    this.cdr.detectChanges();
  }

  openEditDialog(item: AffaireItem): void {
    this.editCase = {
      id: item.id,
      titre: item.titre,
      clientId: item.clientId,
      type: item.type,
      priorite: item.priorite,
      assigneA: item.assigneA || '',
      dateEcheance: item.dateEcheance || '',
      description: item.description || '',
      statut: item.statut,
      progression: item.progression
    };

    this.isEditDialogOpen = true;
    this.cdr.detectChanges();
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
    this.editCase = {
      id: undefined,
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
    this.cdr.detectChanges();
  }

  updateCase(): void {
    if (!this.editCase.id || !this.editCase.titre || !this.editCase.clientId || !this.editCase.type) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      this.cdr.detectChanges();
      return;
    }

    this.affairesService.update(this.editCase.id, this.editCase).subscribe({
      next: () => {
        this.closeEditDialog();
        this.closeDetails();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de modifier l’affaire.';
        this.cdr.detectChanges();
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