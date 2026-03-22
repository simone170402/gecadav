import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  currentUrl = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.updateBodyPadding();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.isMenuOpen = false;
        this.updateBodyPadding();
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isHomePage(): boolean {
    return this.currentUrl === '/' || this.currentUrl === '';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateBodyPadding();
  }

  private updateBodyPadding(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    if (!header) return;

    if (this.isHomePage()) {
      document.body.style.paddingTop = '0px';
    } else {
      document.body.style.paddingTop = `${header.offsetHeight}px`;
    }
  }
}