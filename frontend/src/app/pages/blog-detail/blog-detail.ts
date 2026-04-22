import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Publication } from '../../admin/publications/publication.model';
import { PublicationService } from '../../admin/publications/publication.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css'
})
export class BlogDetail implements OnInit {
  article: Publication | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadArticle(slug);
      }
    });
  }

  loadArticle(slug: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.publicationService.getBySlug(slug).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger cet article.';
        this.isLoading = false;
      }
    });
  }
}