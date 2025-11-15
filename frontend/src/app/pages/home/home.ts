import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    const elements = this.host.nativeElement.querySelectorAll('.scroll-reveal');

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
