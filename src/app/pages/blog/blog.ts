import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicationListItem } from '../../admin/publications/publication.model';
import { PublicationService } from '../../admin/publications/publication.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  articles: PublicationListItem[] = [];
  filteredArticles: PublicationListItem[] = [];
  selectedCategory = 'Tous';
  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  categories: string[] = [
    'Tous',
    'Droit Commercial',
    'Droit de la Famille',
    'Droit du Travail',
    'Droit Immobilier',
    'Droit Pénal'
  ];

  constructor(private publicationService: PublicationService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.publicationService.getPublications('BLOG').subscribe({
      next: (data) => {
        this.articles = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les articles du blog.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();

    this.filteredArticles = this.articles.filter(article => {
      const matchesCategory =
        this.selectedCategory === 'Tous' || article.category === this.selectedCategory;

      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  trackById(index: number, item: PublicationListItem): number {
    return item.id;
  }
}