import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID,} from '@angular/core';
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
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);

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
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.isLoading = false;
      this.ctr.detectChanges();
    }
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
            this.ctr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques clients.';
            this.isLoading = false;
            this.ctr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les clients.';
        this.isLoading = false;
        this.ctr.detectChanges();
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
    this.ctr.detectChanges();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
    this.ctr.detectChanges();
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
        this.ctr.detectChanges();
      }
    });
  }

  viewClient(client: ClientItem): void {
    this.selectedClient = client;
    this.ctr.detectChanges();
  }

  closeDetails(): void {
    this.selectedClient = null;
    this.ctr.detectChanges();
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