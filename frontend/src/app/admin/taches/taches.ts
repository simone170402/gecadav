import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TachesService, TacheItem } from './taches.service';

@Component({
  selector: 'app-taches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taches.html',
  styleUrl: './taches.css'
})
export class Taches implements OnInit {
  private service = inject(TachesService);

  tasks: TacheItem[] = [];
  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;

  newTask: {
    titre: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo: string;
  } = {
    titre: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: ''
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les tâches.';
        this.isLoading = false;
      }
    });
  }

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  toggle(id: number): void {
    this.service.toggle(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de mettre à jour la tâche.';
      }
    });
  }

  create(): void {
    if (!this.newTask.titre || !this.newTask.dueDate || !this.newTask.assignedTo) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.service.create(this.newTask).subscribe({
      next: () => {
        this.closeDialog();
        this.load();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer la tâche.';
      }
    });
  }

  delete(id: number): void {
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer la tâche.';
      }
    });
  }

  resetForm(): void {
    this.newTask = {
      titre: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: ''
    };
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get completedTasks(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  get urgentTasks(): number {
    return this.tasks.filter(t => t.priority === 'high' && !t.completed).length;
  }

  getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
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
}