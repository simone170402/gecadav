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

  private backendUrl = 'https://gecadav-1.onrender.com/news';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNews();
  }

  truncate(text: string, max: number = 50) {
    return text.length > max ? text.substring(0, max) + "…" : text;
  }

  removeDuplicates(list: any[]): any[] {
    const seen = new Set();
    return list.filter(item => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }

  loadNews() {
    this.loading = true;

    this.http.get<any[]>(this.backendUrl).subscribe({
      next: (data) => {
        // Suppression doublons + prendre les 8 premiers
        const filtered = this.removeDuplicates(data);
        this.latestNews = filtered.slice(0, 5);
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
