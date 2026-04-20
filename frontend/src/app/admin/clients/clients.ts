import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientItem, ClientStats } from './clients.model';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit {
  private clientsService = inject(ClientsService);

  clients: ClientItem[] = [];
  filteredClients: ClientItem[] = [];
  stats: ClientStats | null = null;

  searchTerm = '';
  typeFilter = 'Tous';
  statusFilter = 'Tous';

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;
  selectedClient: ClientItem | null = null;

  newClient = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    type: 'Particulier' as 'Particulier' | 'Entreprise',
    adresse: '',
    notes: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();

        this.clientsService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques clients.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les clients.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredClients = this.clients.filter((client) => {
      const matchesSearch =
        client.nomComplet.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.reference.toLowerCase().includes(term);

      const matchesType =
        this.typeFilter === 'Tous' || client.type === this.typeFilter;

      const matchesStatus =
        this.statusFilter === 'Tous' || client.statut === this.statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  createClient(): void {
    if (
      !this.newClient.nom ||
      !this.newClient.prenom ||
      !this.newClient.email ||
      !this.newClient.telephone
    ) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.clientsService.create(this.newClient).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer le client.';
      }
    });
  }

  viewClient(client: ClientItem): void {
    this.selectedClient = client;
  }

  closeDetails(): void {
    this.selectedClient = null;
  }

  resetForm(): void {
    this.newClient = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      entreprise: '',
      type: 'Particulier',
      adresse: '',
      notes: '',
      statut: 'Actif'
    };
  }
}