import { CommonModule } from '@angular/common';
import { Component, HostListener, AfterViewInit, NgZone } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements AfterViewInit {
  isMenuOpen = false;
  isScrolled = false;
  currentUrl = '';
  initialHeaderHeight = 0;

  constructor(private router: Router, private ngZone: NgZone) {
    // 🎯 Surveille les changements de page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;

        // ⏱️ Laisse le DOM se stabiliser avant de calculer
        setTimeout(() => {
          if (!this.isHomePage()) {
            this.setInitialHeaderHeight();
          } else {
            document.body.style.paddingTop = '0px';
          }
        }, 100);
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isHomePage(): boolean {
    return this.currentUrl === '/' || this.router.url === '/';
  }

  // 🔹 Applique l'effet de scroll sur le header (sans changer la hauteur du contenu)
  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 10;
    // 👉 on ne touche pas à la hauteur du body ici
  }

  // 🔹 Ajuste seulement si la fenêtre est redimensionnée
  @HostListener('window:resize', [])
  onResize() {
    if (!this.isHomePage()) {
      this.setInitialHeaderHeight();
    }
  }

  // 🔹 Définit une fois la hauteur initiale du header
  private setInitialHeaderHeight() {
    this.ngZone.runOutsideAngular(() => {
      const header = document.querySelector('header');
      if (header) {
        this.initialHeaderHeight = header.clientHeight;
        document.body.style.paddingTop = `${this.initialHeaderHeight}px`;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.isHomePage()) {
        this.setInitialHeaderHeight();
      }
    }, 100);
  }
}
