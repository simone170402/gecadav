import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PublicationListItem } from './publication.model';
import { PublicationService } from './publication.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publications.html',
  styleUrl: './publications.css'
})
export class Publications implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);
  
  publications: PublicationListItem[] = [];
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private publicationService: PublicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAll();
    } else {
      this.isLoading = false;
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.publicationService.getAdminPublications().subscribe({
      next: (data) => {
        this.publications = data;
        this.isLoading = false;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les publications.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  createPublication(): void {
    this.router.navigate(['/admin/publications/new']);
    this.ctr.detectChanges();
  }

  editPublication(id: number): void {
    this.router.navigate(['/admin/publications/edit', id]);
    this.ctr.detectChanges();
  }

  deletePublication(id: number): void {
    const confirmed = confirm('Voulez-vous vraiment supprimer cette publication ?');
    if (!confirmed) return;

    this.publicationService.deletePublication(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        console.error(err);
        alert('Suppression impossible.');
        this.ctr.detectChanges();
      }
    });
  }

  get blogPublications(): PublicationListItem[] {
    return this.publications.filter(item => item.type === 'BLOG');
  }

  get revuePublications(): PublicationListItem[] {
    return this.publications.filter(item => item.type === 'REVUE');
  }

  trackById(index: number, item: PublicationListItem): number {
    return item.id;
  }
}