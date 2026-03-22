import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AboutSlide {
  step: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css',
})
export class Apropos {
  currentSlide = 0;

  slides: AboutSlide[] = [
    {
      step: '01',
      title: 'Foundation & Early Vision',
      text: `Founded in 1993 in Cameroon by Mr. Tsapy Joseph Lavoisier, Cabinet Tsapy emerged at
      a time when access to justice was a significant challenge for Cameroonians, owing
      to the limited number of trained lawyers in the region. Determined to address this gap,
      Mr. Tsapy established his firm as the fourth law firm ever created in the region,
      positioning it as a pioneer in promoting access to legal representation.`
    },
    {
      step: '02',
      title: 'Growth, Excellence & Impact',
      text: `Over the years, Cabinet Tsapy has become one of the leading law firms in the country,
      renowned for its excellence, integrity, and contribution to the legal profession.
      The firm has trained more than twelve senior lawyers who now serve across various
      jurisdictions in Cameroon and beyond, and it boasts an impressive record of over
      4,000 cases successfully handled.`
    },
    {
      step: '03',
      title: 'Prestige & Institutional Standing',
      text: `Thanks to its prestige and reputation, Cabinet Tsapy has had the honor of welcoming
      several distinguished personalities over the years, including the Ambassador of France
      (1996), the Ambassador of the United States of America (1997), and the sitting Vice
      Prime Minister, among other dignitaries, in various professional contexts. The firm
      is well accustomed to hosting high-level legal and diplomatic meetings, further
      attesting to its standing in the national legal landscape.`
    }
  ];

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}