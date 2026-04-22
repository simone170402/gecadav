import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Publication } from '../../admin/publications/publication.model';
import { PublicationService } from '../../admin/publications/publication.service';

@Component({
  selector: 'app-revue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './revue-detail.html',
  styleUrl: './revue-detail.css'
})
export class RevueDetail implements OnInit {
  publication: Publication | null = null;
  isLoading = false;
  errorMessage = '';
  userEmail = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  ? localStorage.getItem('userEmail') || ''
  : '';

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPublication(slug);
      }
    });
  }

  loadPublication(slug: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.publicationService.getBySlug(slug, this.userEmail || undefined).subscribe({
      next: (data) => {
        this.publication = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger cette publication.';
        this.isLoading = false;
      }
    });
  }
}