import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class Footer {
  year = new Date().getFullYear();
  latestNews: any[] = [];
  loading: boolean = true;

  private apiKey = '15eec5d351dc4311ba3c46a489eecf9d';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    const cameroonUrl =
      `https://newsapi.org/v2/everything?q=law OR legal&language=en&pageSize=5&sortBy=publishedAt&apiKey=${this.apiKey}`;

    const worldUrl =
      `https://newsapi.org/v2/everything?q=law OR justice OR legal&language=en&pageSize=5&sortBy=publishedAt&apiKey=${this.apiKey}`;

    Promise.all([
      this.http.get<any>(cameroonUrl).toPromise(),
      this.http.get<any>(worldUrl).toPromise()
    ])
      .then(([cmr, world]) => {
        this.latestNews = [
          ...cmr.articles.map((a: any) => ({ ...a, origin: 'Cameroon' })),
          ...world.articles.map((a: any) => ({ ...a, origin: 'World' }))
        ].slice(0, 6); // On affiche seulement 6 news
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
