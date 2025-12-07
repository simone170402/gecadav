import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class Footer implements OnInit {
  year = new Date().getFullYear();
  latestNews: any[] = [];
  loading = true;

  // 👉 Ton backend Render
  private backendUrl = 'https://gecadav-1.onrender.com/news';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;

    this.http.get<any[]>(this.backendUrl).subscribe({
      next: (data) => {
        // On affiche les 6 premières
        this.latestNews = data.slice(0, 6);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des actualités : ', err);
        this.latestNews = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
