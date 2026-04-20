import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  private readonly isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isAdminRoute(): boolean {
    return this.currentUrl.startsWith('/admin');
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    if (this.isBrowser) {
      this.updateBodyPadding();
      this.isScrolled = window.scrollY > 40;
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.isMenuOpen = false;

        if (this.isBrowser) {
          this.updateBodyPadding();
        }
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
    if (!this.isBrowser) return;
    this.isScrolled = window.scrollY > 40;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.updateBodyPadding();
  }


  private updateBodyPadding(): void {
    if (!this.isBrowser) return;

    const header = this.document.querySelector('.site-header') as HTMLElement | null;

    if (this.isAdminRoute()) {
      this.document.body.style.paddingTop = '0px';
      return;
    }

    if (!header) {
      this.document.body.style.paddingTop = '0px';
      return;
    }

    if (this.isHomePage()) {
      this.document.body.style.paddingTop = '0px';
    } else {
      this.document.body.style.paddingTop = `${header.offsetHeight}px`;
    }
}
}