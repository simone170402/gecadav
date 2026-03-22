import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations: [
    trigger('heroAnim', [
      transition('* => *', [
        query(
          '.hero-animate',
          [
            style({ opacity: 0, transform: 'translateY(24px)' }),
            stagger(120, [
              animate(
                '700ms cubic-bezier(0.22, 1, 0.36, 1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class Home implements AfterViewInit, OnDestroy {
  currentSlide = 0;

  slides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1800&q=80',
      badge: 'Tsapy & Partners • Cameroon',
      title: 'Trusted Legal Support For Businesses & Individuals',
      description:
        'We provide strategic legal counsel in litigation, corporate law, commercial transactions, and regulatory matters with professionalism, discretion, and results-oriented representation.'
    },
    {
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1800&q=80',
      badge: 'Corporate & Litigation Practice',
      title: 'Effective Legal Representation For Complex Matters',
      description:
        'Our firm supports companies, institutions, and private clients in disputes, contracts, compliance, arbitration, and legal structuring with strong local insight and high professional standards.'
    },
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80',
      badge: 'Professional Counsel',
      title: 'Legal Excellence Built On Experience And Integrity',
      description:
        'With decades of experience, our lawyers combine legal depth, business understanding, and disciplined advocacy to protect our clients in critical decisions and high-stakes matters.'
    }
  ];

  partners = [
    'NOVALEX',
    'AFRILEX',
    'BUSINESS AFRICA',
    'GLOBAL TRADE',
    'LEGAL PARTNERS'
  ];

  counters = [
    { label: 'Years of Experience', target: 30, suffix: '+', value: 0 },
    { label: 'Cases Handled', target: 4000, suffix: '+', value: 0 },
    { label: 'Client Commitment', target: 100, suffix: '%', value: 0 }
  ];

  private revealObserver?: IntersectionObserver;
  private counterObserver?: IntersectionObserver;
  private autoSlideInterval?: ReturnType<typeof setInterval>;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initScrollReveal();
    this.initCounterAnimation();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.counterObserver?.disconnect();

    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.restartAutoSlide();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.restartAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 6000);
  }

  private restartAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.startAutoSlide();
  }

  private initScrollReveal(): void {
    const elements = this.el.nativeElement.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-scale'
    );

    this.revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    elements.forEach((element: HTMLElement) => {
      this.revealObserver?.observe(element);
    });
  }

  private initCounterAnimation(): void {
    const statsSection = this.el.nativeElement.querySelector('.stats-section');
    if (!statsSection) return;

    this.counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    this.counterObserver.observe(statsSection);
  }

  private animateCounters(): void {
    this.counters.forEach((counter) => {
      const duration = 1800;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        counter.value = Math.floor(counter.target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.value = counter.target;
        }
      };

      requestAnimationFrame(update);
    });
  }

  trackByLabel(index: number, item: { label: string }): string {
    return item.label;
  }

  trackByPartner(index: number, item: string): string {
    return item;
  }
}