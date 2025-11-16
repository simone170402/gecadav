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
    this.adjustHeroHeight();
    this.initScrollReveal();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustHeroHeight();
  }

  private getHeaderHeight(): number {
    const header = document.querySelector('header') as HTMLElement;
    return header ? header.offsetHeight : 0;
  }

  private adjustHeroHeight() {
    const hero = this.el.nativeElement.querySelector('.hero-container');
    if (hero) {
      const screenHeight = window.innerHeight;
      const headerHeight = this.getHeaderHeight();

      hero.style.height = `${screenHeight - headerHeight}px`;
    }
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
