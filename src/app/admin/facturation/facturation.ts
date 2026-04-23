import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactureItem, FactureStats } from './facturation.model';
import { FacturationService } from './facturation.service';
import { ClientsService } from '../clients/clients.service';
import { AffairesService } from '../affaires/affaires.service';
import { ClientItem } from '../clients/clients.model';
import { AffaireItem } from '../affaires/affaires.model';

@Component({
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturation.html',
  styleUrl: './facturation.css'
})
export class Facturation implements OnInit {
  private facturationService = inject(FacturationService);
  private clientsService = inject(ClientsService);
  private affairesService = inject(AffairesService);
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);

  factures: FactureItem[] = [];
  filteredFactures: FactureItem[] = [];
  stats: FactureStats | null = null;
  clients: ClientItem[] = [];
  affaires: AffaireItem[] = [];
  filteredAffaires: AffaireItem[] = [];
  filteredEditAffaires: AffaireItem[] = [];

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;
  isEditDialogOpen = false;
  selectedFacture: FactureItem | null = null;

  searchTerm = '';
  statusFilter: 'TOUS' | 'PAYEE' | 'EN_ATTENTE' | 'EN_RETARD' | 'ANNULEE' = 'TOUS';

  newFacture: {
    reference: string;
    clientId?: number;
    affaireId?: number;
    montant: number | null;
    statut: 'EN_ATTENTE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
    dateEmission: string;
    dateEcheance: string;
    description: string;
    modePaiement: string;
  } = {
    reference: '',
    clientId: undefined,
    affaireId: undefined,
    montant: null,
    statut: 'EN_ATTENTE',
    dateEmission: '',
    dateEcheance: '',
    description: '',
    modePaiement: ''
  };

  editFacture: {
    id?: number;
    reference: string;
    clientId?: number;
    affaireId?: number;
    montant: number | null;
    statut: 'EN_ATTENTE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
    dateEmission: string;
    dateEcheance: string;
    description: string;
    modePaiement: string;
  } = {
    id: undefined,
    reference: '',
    clientId: undefined,
    affaireId: undefined,
    montant: null,
    statut: 'EN_ATTENTE',
    dateEmission: '',
    dateEcheance: '',
    description: '',
    modePaiement: ''
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
      this.loadClients();
      this.loadAffaires();
    } else {
      this.isLoading = false;
      this.ctr.detectChanges();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.facturationService.getAll().subscribe({
      next: (factures) => {
        this.factures = factures;
        this.applyFilters();
        this.ctr.detectChanges();

        this.facturationService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
            this.ctr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques de facturation.';
            this.isLoading = false;
            this.ctr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les factures.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.ctr.detectChanges();
      }
    });
  }

  loadAffaires(): void {
    this.affairesService.getAll().subscribe({
      next: (data) => {
        this.affaires = data;
        this.filteredAffaires = data;
        this.filteredEditAffaires = data;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.ctr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredFactures = this.factures.filter((facture) => {
      const matchesSearch =
        facture.reference.toLowerCase().includes(term) ||
        facture.clientNomComplet.toLowerCase().includes(term) ||
        (facture.affaireReference ?? '').toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'TOUS' || facture.statut === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  onClientChange(): void {
    if (this.newFacture.clientId === undefined) {
      this.filteredAffaires = this.affaires;
      this.newFacture.affaireId = undefined;
      return;
    }

    this.filteredAffaires = this.affaires.filter(
      affaire => affaire.clientId === this.newFacture.clientId
    );

    if (
      this.newFacture.affaireId !== undefined &&
      !this.filteredAffaires.some(a => a.id === this.newFacture.affaireId)
    ) {
      this.newFacture.affaireId = undefined;
    }
  }

  onEditClientChange(): void {
    if (this.editFacture.clientId === undefined) {
      this.filteredEditAffaires = this.affaires;
      this.editFacture.affaireId = undefined;
      return;
    }

    this.filteredEditAffaires = this.affaires.filter(
      affaire => affaire.clientId === this.editFacture.clientId
    );

    if (
      this.editFacture.affaireId !== undefined &&
      !this.filteredEditAffaires.some(a => a.id === this.editFacture.affaireId)
    ) {
      this.editFacture.affaireId = undefined;
    }
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
    this.ctr.detectChanges();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
    this.ctr.detectChanges();
  }

  downloadPdf(item: FactureItem): void {
    window.open(this.facturationService.getPdfUrl(item.id), '_blank');
  }

  createFacture(): void {
    if (
      !this.newFacture.clientId ||
      this.newFacture.montant === null ||
      this.newFacture.montant <= 0 ||
      !this.newFacture.dateEmission
    ) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.facturationService.create({
      reference: this.newFacture.reference || undefined,
      clientId: this.newFacture.clientId,
      affaireId: this.newFacture.affaireId,
      montant: this.newFacture.montant,
      statut: this.newFacture.statut,
      dateEmission: this.newFacture.dateEmission,
      dateEcheance: this.newFacture.dateEcheance || null,
      description: this.newFacture.description,
      modePaiement: this.newFacture.modePaiement
    }).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer la facture.';
        this.ctr.detectChanges();
      }
    });
  }

  viewFacture(item: FactureItem): void {
    this.selectedFacture = item;
    this.ctr.detectChanges();

  }

  closeDetails(): void {
    this.selectedFacture = null;
    this.ctr.detectChanges();
  }

  openEditDialog(item: FactureItem): void {
    this.editFacture = {
      id: item.id,
      reference: item.reference,
      clientId: item.clientId,
      affaireId: item.affaireId ?? undefined,
      montant: item.montant,
      statut: item.statut,
      dateEmission: item.dateEmission,
      dateEcheance: item.dateEcheance ?? '',
      description: item.description ?? '',
      modePaiement: item.modePaiement ?? ''
    };

    this.onEditClientChange();
    this.isEditDialogOpen = true;
    this.ctr.detectChanges();
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
    this.editFacture = {
      id: undefined,
      reference: '',
      clientId: undefined,
      affaireId: undefined,
      montant: null,
      statut: 'EN_ATTENTE',
      dateEmission: '',
      dateEcheance: '',
      description: '',
      modePaiement: ''
    };
    this.filteredEditAffaires = this.affaires;
    this.ctr.detectChanges();
  }

  updateFacture(): void {
    if (
      !this.editFacture.id ||
      !this.editFacture.clientId ||
      this.editFacture.montant === null ||
      this.editFacture.montant <= 0 ||
      !this.editFacture.dateEmission
    ) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.facturationService.update(this.editFacture.id, {
      reference: this.editFacture.reference,
      clientId: this.editFacture.clientId,
      affaireId: this.editFacture.affaireId,
      montant: this.editFacture.montant,
      statut: this.editFacture.statut,
      dateEmission: this.editFacture.dateEmission,
      dateEcheance: this.editFacture.dateEcheance || null,
      description: this.editFacture.description,
      modePaiement: this.editFacture.modePaiement
    }).subscribe({
      next: () => {
        this.closeEditDialog();
        this.closeDetails();
        this.loadData();
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de modifier la facture.';
        this.ctr.detectChanges();
      }
    });
  }

  deleteFacture(id: number): void {
    this.facturationService.delete(id).subscribe({
      next: () => {
        if (this.selectedFacture?.id === id) {
          this.selectedFacture = null;
        }
        this.loadData();
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer la facture.';
        this.ctr.detectChanges();
      }
    });
  }

  getStatusLabel(status: FactureItem['statut']): string {
    switch (status) {
      case 'PAYEE':
        return 'Payée';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_RETARD':
        return 'En retard';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return status;
    }
  }

  getStatusClass(status: FactureItem['statut']): string {
    switch (status) {
      case 'PAYEE':
        return 'status-green';
      case 'EN_ATTENTE':
        return 'status-orange';
      case 'EN_RETARD':
        return 'status-red';
      case 'ANNULEE':
        return 'status-gray';
      default:
        return 'status-gray';
    }
  }

  resetForm(): void {
    this.newFacture = {
      reference: '',
      clientId: undefined,
      affaireId: undefined,
      montant: null,
      statut: 'EN_ATTENTE',
      dateEmission: '',
      dateEcheance: '',
      description: '',
      modePaiement: ''
    };
    this.filteredAffaires = this.affaires;
  }
}