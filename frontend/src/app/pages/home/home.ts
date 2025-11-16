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
    // On laisse le temps au header de s'afficher (fonts, logo, etc.)
    setTimeout(() => {
      this.centerHeroText();
      this.initScrollReveal();
    }, 300);
  }

  @HostListener('window:resize')
  onResize() {
    this.centerHeroText();
  }

  /** ⭐ Centre le texte verticalement dans le Hero sans chevaucher le header */
  private centerHeroText() {
    const hero = this.el.nativeElement.querySelector('.hero-container') as HTMLElement;
    const text = this.el.nativeElement.querySelector('.hero-text') as HTMLElement;
    const header = document.querySelector('header') as HTMLElement;

    if (!hero || !text || !header) return;

    const headerHeight = header.getBoundingClientRect().height;
    const heroHeight = hero.getBoundingClientRect().height;
    const textHeight = text.getBoundingClientRect().height;

    // Calcul centrage vertical
    let topOffset = (heroHeight - textHeight) / 2;

    // Sécurité : toujours sous le header
    const minOffset = headerHeight + 40; 

    if (topOffset < minOffset) {
      topOffset = minOffset;
    }

    text.style.marginTop = `${topOffset}px`;
  }

  /** ⭐ Animation au scroll */
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
