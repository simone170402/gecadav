import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // 1. Ajuster dynamiquement la hauteur du HERO
    this.adjustHeroHeight();

    // 2. Activer les animations scroll reveal
    this.initScrollReveal();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustHeroHeight();
  }

  /** Ajuste dynamiquement la hauteur du Hero */
  private adjustHeroHeight() {
    const hero = this.el.nativeElement.querySelector('.hero-container');
    if (hero) {
      const screenHeight = window.innerHeight;
      hero.style.height = `${screenHeight}px`;
    }
  }

  /** Initialise les animations scroll reveal */
  private initScrollReveal() {
    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    elements.forEach((el: HTMLElement) => observer.observe(el));
  }
}
