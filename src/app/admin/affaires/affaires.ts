import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AffairesService } from './affaires.service';
import { Affaire } from './affaire.model';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/client.model';

@Component({
  selector: 'app-affaires',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './affaires.html',
  styleUrl: './affaires.css'
})
export class Affaires implements OnInit {
  private affairesService = inject(AffairesService);
  private clientsService = inject(ClientsService);
  private fb = inject(FormBuilder);

  affaires: Affaire[] = [];
  clients: Client[] = [];
  selectedAffaireId: number | null = null;
  isLoading = false;

  affaireForm = this.fb.group({
    titre: ['', Validators.required],
    description: [''],
    statut: ['', Validators.required],
    dateOuverture: ['', Validators.required],
    clientId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.loadAffaires();
    this.loadClients();
  }

  loadAffaires(): void {
    this.isLoading = true;
    this.affairesService.getAffaires().subscribe({
      next: (data: Affaire[]) => {
        this.affaires = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement affaires', err);
        this.isLoading = false;
      }
    });
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement clients', err);
      }
    });
  }

  onSubmit(): void {
    if (this.affaireForm.invalid) {
      this.affaireForm.markAllAsTouched();
      return;
    }

    const affaireData: Affaire = {
      titre: this.affaireForm.value.titre ?? '',
      description: this.affaireForm.value.description ?? '',
      statut: this.affaireForm.value.statut ?? '',
      dateOuverture: this.affaireForm.value.dateOuverture ?? '',
      clientId: this.affaireForm.value.clientId ?? 0
    };

    if (this.selectedAffaireId !== null) {
      this.affairesService.updateAffaire(this.selectedAffaireId, affaireData).subscribe({
        next: () => {
          this.resetForm();
          this.loadAffaires();
        },
        error: (err: unknown) => {
          console.error('Erreur modification affaire', err);
        }
      });
    } else {
      this.affairesService.createAffaire(affaireData).subscribe({
        next: () => {
          this.resetForm();
          this.loadAffaires();
        },
        error: (err: unknown) => {
          console.error('Erreur création affaire', err);
        }
      });
    }
  }

  editAffaire(affaire: Affaire): void {
    this.selectedAffaireId = affaire.id ?? null;
    this.affaireForm.patchValue({
      titre: affaire.titre,
      description: affaire.description ?? '',
      statut: affaire.statut,
      dateOuverture: affaire.dateOuverture,
      clientId: affaire.clientId
    });
  }

  deleteAffaire(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette affaire ?')) {
      return;
    }

    this.affairesService.deleteAffaire(id).subscribe({
      next: () => {
        this.loadAffaires();
      },
      error: (err: unknown) => {
        console.error('Erreur suppression affaire', err);
      }
    });
  }

  resetForm(): void {
    this.selectedAffaireId = null;
    this.affaireForm.reset();
  }
}