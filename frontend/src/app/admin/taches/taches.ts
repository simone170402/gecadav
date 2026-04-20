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

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => {
      this.tasks = data;
      this.isLoading = false;
    });
  }

  toggle(id: number) {
    this.service.toggle(id).subscribe(() => this.load());
  }

  create() {
    this.service.create(this.newTask).subscribe(() => {
      this.newTask = { titre: '', dueDate: '', priority: 'medium', assignedTo: '' };
      this.load();
    });
  }

  delete(id: number) {
    this.service.delete(id).subscribe(() => this.load());
  }
}