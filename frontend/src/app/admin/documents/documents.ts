import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentItem, DocumentStats } from './documents.model';
import { DocumentsService } from './documents.service';
import { ClientsService } from '../clients/clients.service';
import { AffairesService } from '../affaires/affaires.service';
import { ClientItem } from '../clients/clients.model';
import { AffaireItem } from '../affaires/affaires.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents implements OnInit {
  private documentsService = inject(DocumentsService);
  private clientsService = inject(ClientsService);
  private affairesService = inject(AffairesService);

  documents: DocumentItem[] = [];
  filteredDocuments: DocumentItem[] = [];
  stats: DocumentStats | null = null;
  clients: ClientItem[] = [];
  affaires: AffaireItem[] = [];
  filteredAffaires: AffaireItem[] = [];

  searchTerm = '';
  categoryFilter = 'Toutes les catégories';

  isLoading = true;
  errorMessage = '';
  isUploadDialogOpen = false;

  uploadForm = {
    categorie: 'Contrats',
    uploadedBy: '',
    clientId: undefined as number | undefined,
    affaireId: undefined as number | undefined
  };

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadData();
    this.loadClients();
    this.loadAffaires();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.documentsService.getAll().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.applyFilters();

        this.documentsService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques des documents.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les documents.';
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

  loadAffaires(): void {
  this.affairesService.getAll().subscribe({
    next: (data) => {
      this.affaires = data;
      this.filteredAffaires = data;
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredDocuments = this.documents.filter((doc) => {
      const matchesSearch =
        doc.nom.toLowerCase().includes(term) ||
        (doc.client ?? '').toLowerCase().includes(term) ||
        (doc.affaireReference ?? '').toLowerCase().includes(term);

      const matchesCategory =
        this.categoryFilter === 'Toutes les catégories' ||
        doc.categorie === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }

  onClientChange(): void {
    if (this.uploadForm.clientId === undefined) {
      this.filteredAffaires = this.affaires;
      this.uploadForm.affaireId = undefined;
      return;
    }

    this.filteredAffaires = this.affaires.filter(
      affaire => affaire.clientId === this.uploadForm.clientId
    );

    if (
      this.uploadForm.affaireId !== undefined &&
      !this.filteredAffaires.some(a => a.id === this.uploadForm.affaireId)
    ) {
      this.uploadForm.affaireId = undefined;
    }
  }

  getFileIcon(type: string): string {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'IMG':
        return '🖼️';
      case 'XLS':
        return '📊';
      default:
        return '📁';
    }
  }

  openUploadDialog(): void {
    this.isUploadDialogOpen = true;
  }

  closeUploadDialog(): void {
    this.isUploadDialogOpen = false;
    this.selectedFile = null;
    this.uploadForm = {
      categorie: 'Contrats',
      uploadedBy: '',
      clientId: undefined,
      affaireId: undefined
    };
    this.filteredAffaires = this.affaires;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('categorie', this.uploadForm.categorie);

    if (this.uploadForm.uploadedBy.trim()) {
      formData.append('uploadedBy', this.uploadForm.uploadedBy.trim());
    }

    if (this.uploadForm.clientId !== undefined) {
      formData.append('clientId', String(this.uploadForm.clientId));
    }

    if (this.uploadForm.affaireId !== undefined) {
      formData.append('affaireId', String(this.uploadForm.affaireId));
    }

    this.documentsService.upload(formData).subscribe({
      next: () => {
        this.closeUploadDialog();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de téléverser le document.';
      }
    });
  }

  downloadDocument(doc: DocumentItem): void {
    window.open(this.documentsService.getDownloadUrl(doc.id), '_blank');
  }

  deleteDocument(id: number): void {
    this.documentsService.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer le document.';
      }
    });
  }
}