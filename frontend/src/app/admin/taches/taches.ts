import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
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
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);


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
    if (isPlatformBrowser(this.platformId)) {
      this.load();
    } else {
      this.isLoading = false;
      this.ctr.detectChanges();
    }
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les tâches.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  openDialog(): void {
    this.isDialogOpen = true;
    this.ctr.detectChanges();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
    this.ctr.detectChanges();
  }

  toggle(id: number): void {
    this.service.toggle(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de mettre à jour la tâche.';
        this.ctr.detectChanges();
      }
    });
  }

  create(): void {
    if (!this.newTask.titre || !this.newTask.dueDate || !this.newTask.assignedTo) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      this.ctr.detectChanges();
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
        this.ctr.detectChanges();
      }
    });
  }

  delete(id: number): void {
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer la tâche.';
        this.ctr.detectChanges();
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