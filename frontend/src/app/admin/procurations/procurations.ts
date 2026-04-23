import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProcurationItem, ProcurationStats } from './procurations.model';
import { ProcurationsService } from './procurations.service';
import { ClientsService } from '../clients/clients.service';
import { ClientItem } from '../clients/clients.model';

@Component({
  selector: 'app-procurations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procurations.html',
  styleUrl: './procurations.css'
})
export class Procurations implements OnInit {
  private procurationsService = inject(ProcurationsService);
  private clientsService = inject(ClientsService);
  private platformId = inject(PLATFORM_ID);

  procurations: ProcurationItem[] = [];
  filteredProcurations: ProcurationItem[] = [];
  stats: ProcurationStats | null = null;
  clients: ClientItem[] = [];

  searchTerm = '';
  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;

  newProcuration: {
    clientId?: number;
    type: string;
    scope: string;
    duration: number;
    signedBy: string;
  } = {
    clientId: undefined,
    type: '',
    scope: '',
    duration: 12,
    signedBy: ''
  };

  selectedProcuration: ProcurationItem | null = null;
  isEditDialogOpen = false;

  editProcuration: {
    id?: number;
    clientId?: number;
    type: string;
    scope: string;
    status: 'Active' | 'En attente' | 'Expirée';
    createdDate: string;
    expiryDate: string;
    signedBy: string;
  } = {
    id: undefined,
    clientId: undefined,
    type: '',
    scope: '',
    status: 'Active',
    createdDate: '',
    expiryDate: '',
    signedBy: ''
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
      this.loadClients();
    } else {
      this.isLoading = false;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.procurationsService.getAll().subscribe({
      next: (data) => {
        this.procurations = data;
        this.applyFilters();

        this.procurationsService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques des procurations.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les procurations.';
        this.isLoading = false;
      }
    });
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProcurations = this.procurations.filter(
      (proc) =>
        proc.client.toLowerCase().includes(term) ||
        proc.reference.toLowerCase().includes(term)
    );
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  createProcuration(): void {
    if (!this.newProcuration.clientId || !this.newProcuration.type || !this.newProcuration.scope) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    const createdDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + this.newProcuration.duration);

    this.procurationsService.create({
      clientId: this.newProcuration.clientId,
      type: this.newProcuration.type,
      scope: this.newProcuration.scope,
      status: 'Active',
      createdDate: createdDate.toISOString().slice(0, 10),
      expiryDate: expiryDate.toISOString().slice(0, 10),
      signedBy: this.newProcuration.signedBy
    }).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer la procuration.';
      }
    });
  }

  viewProcuration(item: ProcurationItem): void {
  this.selectedProcuration = item;
}

closeDetails(): void {
  this.selectedProcuration = null;
}

downloadPdf(item: ProcurationItem): void {
  window.open(this.procurationsService.getPdfUrl(item.id), '_blank');
}

openEditDialog(item: ProcurationItem): void {
  const client = this.clients.find(c => c.nomComplet === item.client);

  this.editProcuration = {
    id: item.id,
    clientId: client?.id,
    type: item.type,
    scope: item.scope,
    status: item.status,
    createdDate: item.createdDate,
    expiryDate: item.expiryDate,
    signedBy: item.signedBy || ''
  };

  this.isEditDialogOpen = true;
}

closeEditDialog(): void {
  this.isEditDialogOpen = false;
  this.editProcuration = {
    id: undefined,
    clientId: undefined,
    type: '',
    scope: '',
    status: 'Active',
    createdDate: '',
    expiryDate: '',
    signedBy: ''
  };
}

updateProcuration(): void {
  if (!this.editProcuration.id || !this.editProcuration.clientId || !this.editProcuration.type || !this.editProcuration.scope) {
    this.errorMessage = 'Veuillez remplir les champs obligatoires.';
    return;
  }

  this.procurationsService.update(this.editProcuration.id, {
    clientId: this.editProcuration.clientId,
    type: this.editProcuration.type,
    scope: this.editProcuration.scope,
    status: this.editProcuration.status,
    createdDate: this.editProcuration.createdDate,
    expiryDate: this.editProcuration.expiryDate,
    signedBy: this.editProcuration.signedBy
  }).subscribe({
    next: () => {
      this.closeEditDialog();
      this.closeDetails();
      this.loadData();
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Impossible de modifier la procuration.';
    }
  });
}

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-green';
      case 'En attente':
        return 'status-orange';
      case 'Expirée':
        return 'status-red';
      default:
        return 'status-gray';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Active':
        return '✅';
      case 'En attente':
        return '⏳';
      case 'Expirée':
        return '❌';
      default:
        return '•';
    }
  }

  resetForm(): void {
    this.newProcuration = {
      clientId: undefined,
      type: '',
      scope: '',
      duration: 12,
      signedBy: ''
    };
  }
}