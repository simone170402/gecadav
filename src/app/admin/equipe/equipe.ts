import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EquipeService } from './equipe.service';
import { EquipeStats, MembreEquipeItem } from './equipe.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipe.html',
  styleUrl: './equipe.css'
})
export class Equipe implements OnInit {
  private equipeService = inject(EquipeService);
  private platformId = inject(PLATFORM_ID);

  membres: MembreEquipeItem[] = [];
  stats: EquipeStats | null = null;

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;
  isEditDialogOpen = false;
  selectedMember: MembreEquipeItem | null = null;

  newMember: {
    nomComplet: string;
    role: string;
    specialite: string;
    email: string;
    telephone: string;
    statut: 'Actif' | 'Inactif';
  } = {
    nomComplet: '',
    role: '',
    specialite: '',
    email: '',
    telephone: '',
    statut: 'Actif'
  };

  editMember: {
    id?: number;
    nomComplet: string;
    role: string;
    specialite: string;
    email: string;
    telephone: string;
    statut: 'Actif' | 'Inactif';
  } = {
    id: undefined,
    nomComplet: '',
    role: '',
    specialite: '',
    email: '',
    telephone: '',
    statut: 'Actif'
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.isLoading = false;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.equipeService.getAll().subscribe({
      next: (membres) => {
        this.membres = membres;

        this.equipeService.getStats().subscribe({
          next: (stats) => {
            this.stats = stats;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Impossible de charger les statistiques de l’équipe.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les membres de l’équipe.';
        this.isLoading = false;
      }
    });
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  createMember(): void {
    if (!this.newMember.nomComplet || !this.newMember.role || !this.newMember.email) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.equipeService.create(this.newMember).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer le membre.';
      }
    });
  }

  viewMember(member: MembreEquipeItem): void {
    this.selectedMember = member;
  }

  closeDetails(): void {
    this.selectedMember = null;
  }

  openEditDialog(member: MembreEquipeItem): void {
    this.editMember = {
      id: member.id,
      nomComplet: member.nomComplet,
      role: member.role,
      specialite: member.specialite,
      email: member.email,
      telephone: member.telephone,
      statut: member.statut
    };

    this.isEditDialogOpen = true;
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
    this.editMember = {
      id: undefined,
      nomComplet: '',
      role: '',
      specialite: '',
      email: '',
      telephone: '',
      statut: 'Actif'
    };
  }

  updateMember(): void {
    if (!this.editMember.id || !this.editMember.nomComplet || !this.editMember.role || !this.editMember.email) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.equipeService.update(this.editMember.id, this.editMember).subscribe({
      next: () => {
        this.closeEditDialog();
        this.closeDetails();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de modifier le membre.';
      }
    });
  }

  deleteMember(id: number): void {
    this.equipeService.delete(id).subscribe({
      next: () => {
        if (this.selectedMember?.id === id) {
          this.selectedMember = null;
        }
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer le membre.';
      }
    });
  }

  resetForm(): void {
    this.newMember = {
      nomComplet: '',
      role: '',
      specialite: '',
      email: '',
      telephone: '',
      statut: 'Actif'
    };
  }
}