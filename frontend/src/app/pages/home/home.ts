import { Component, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {
  @HostListener('window:scroll', [])
  onScroll() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('show');
      }
    });
  }

  ngAfterViewInit() {
    this.onScroll();
  }
}
