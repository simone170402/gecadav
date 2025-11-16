import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, group, query } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [

    trigger('slideHorizontal', [

      // 🔥 FORWARD (→) — paragraphe suivant
      transition('forward => *', [

        query(':enter', [
          style({ opacity: 0, transform: 'translateX(80px)' })
        ], { optional: true }),

        group([
          query(':leave', [
            animate('350ms ease-in',
              style({ opacity: 0, transform: 'translateX(-80px)' })
            )
          ], { optional: true }),

          query(':enter', [
            animate('350ms ease-out',
              style({ opacity: 1, transform: 'translateX(0)' })
            )
          ], { optional: true })
        ])
      ]),

      // 🔥 BACKWARD (←) — paragraphe précédent
      transition('backward => *', [

        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-80px)' })
        ], { optional: true }),

        group([
          query(':leave', [
            animate('350ms ease-in',
              style({ opacity: 0, transform: 'translateX(80px)' })
            )
          ], { optional: true }),

          query(':enter', [
            animate('350ms ease-out',
              style({ opacity: 1, transform: 'translateX(0)' })
            )
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class Home implements AfterViewInit {

  currentSection = 1;
  direction: 'forward' | 'backward' = 'forward';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.centerHeroText();
      this.initScrollReveal();
    }, 300);
  }

  @HostListener('window:resize')
  onResize() {
    this.centerHeroText();
  }

  nextSection() {
    if (this.currentSection < 3) {
      this.direction = 'forward';
      this.currentSection++;
    }
  }

  previousSection() {
    if (this.currentSection > 1) {
      this.direction = 'backward';
      this.currentSection--;
    }
  }

  private centerHeroText() {
    const hero = this.el.nativeElement.querySelector('.hero-container');
    const text = this.el.nativeElement.querySelector('.hero-text');
    const header = document.querySelector('header');

    if (!hero || !text || !header) return;

    const headerHeight = header.getBoundingClientRect().height;
    const heroHeight = hero.getBoundingClientRect().height;
    const textHeight = text.getBoundingClientRect().height;

    let topOffset = (heroHeight - textHeight) / 2;
    const minOffset = headerHeight + 40;

    if (topOffset < minOffset) topOffset = minOffset;

    text.style.marginTop = `${topOffset}px`;
  }

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
