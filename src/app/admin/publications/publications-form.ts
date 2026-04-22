import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PublicationRequest, PublicationStatus, PublicationType } from './publication.model';
import { PublicationService } from './publication.service';

@Component({
  selector: 'app-publications-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './publications-form.html',
  styleUrl: './publications-form.css'
})
export class PublicationsForm implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  publicationId: number | null = null;
  isSubmitting = false;

  publicationTypes: PublicationType[] = ['BLOG', 'REVUE'];
  publicationStatuses: PublicationStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

  categories = [
    'Droit Commercial',
    'Droit de la Famille',
    'Droit du Travail',
    'Droit Immobilier',
    'Droit Pénal'
  ];

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.publicationId = Number(id);
      this.loadPublication(this.publicationId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      author: ['', Validators.required],
      coverImageUrl: [''],
      type: ['BLOG', Validators.required],
      status: ['DRAFT', Validators.required],
      premium: [false],
      featured: [false],
      estimatedReadTime: [5],
      previewContent: ['']
    });
  }

  loadPublication(id: number): void {
    this.publicationService.getAdminPublicationById(id).subscribe({
      next: (publication) => {
        this.form.patchValue({
          title: publication.title,
          excerpt: publication.excerpt,
          content: publication.content,
          category: publication.category,
          author: publication.author,
          coverImageUrl: publication.coverImageUrl,
          type: publication.type,
          status: publication.status,
          premium: publication.premium,
          featured: publication.featured,
          estimatedReadTime: publication.estimatedReadTime,
          previewContent: publication.previewContent
        });
      },
      error: (err) => {
        console.error(err);
        alert('Impossible de charger la publication.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: PublicationRequest = this.form.value;

    if (this.isEditMode && this.publicationId) {
      this.publicationService.updatePublication(this.publicationId, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/publications']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          alert('Impossible de modifier la publication.');
        }
      });
    } else {
      this.publicationService.createPublication(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/publications']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          alert('Impossible de créer la publication.');
        }
      });
    }
  }

  get f() {
    return this.form.controls;
  }
}