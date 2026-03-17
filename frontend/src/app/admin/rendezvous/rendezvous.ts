import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RendezVousService } from './rendezvous.service';
import { RendezVous } from './rendezvous.model';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rendezvous.html',
  styleUrl: './rendezvous.css'
})
export class RendezVousComponent implements OnInit {

  private service = inject(RendezVousService)
  private fb = inject(FormBuilder)

  rendezvous: RendezVous[] = []
  selectedId: number | null = null
  isLoading = false

  rdvForm = this.fb.group({
    date: ['', Validators.required],
    heure: ['', Validators.required],
    lieu: ['', Validators.required],
    note: ['']
  })

  ngOnInit(): void {
    this.loadRdv()
  }

  loadRdv(): void {

    this.isLoading = true

    this.service.getAll().subscribe({
      next: (data: RendezVous[]) => {
        this.rendezvous = data
        this.isLoading = false
      },
      error: (err: unknown) => {
        console.error('Erreur chargement rendez-vous', err)
        this.isLoading = false
      }
    })

  }

  onSubmit(): void {

    if (this.rdvForm.invalid) {
      this.rdvForm.markAllAsTouched()
      return
    }

    const rdv: RendezVous = {
      date: this.rdvForm.value.date ?? '',
      heure: this.rdvForm.value.heure ?? '',
      lieu: this.rdvForm.value.lieu ?? '',
      note: this.rdvForm.value.note ?? ''
    }

    if (this.selectedId !== null) {

      this.service.update(this.selectedId, rdv).subscribe({
        next: () => {
          this.resetForm()
          this.loadRdv()
        },
        error: (err: unknown) => {
          console.error('Erreur modification RDV', err)
        }
      })

    } else {

      this.service.create(rdv).subscribe({
        next: () => {
          this.resetForm()
          this.loadRdv()
        },
        error: (err: unknown) => {
          console.error('Erreur création RDV', err)
        }
      })

    }

  }

  edit(rdv: RendezVous) {

    this.selectedId = rdv.id ?? null

    this.rdvForm.patchValue({
      date: rdv.date,
      heure: rdv.heure,
      lieu: rdv.lieu,
      note: rdv.note ?? ''
    })

  }

  delete(id: number) {

    if (!confirm("Supprimer ce rendez-vous ?")) return

    this.service.delete(id).subscribe({
      next: () => this.loadRdv(),
      error: (err: unknown) => console.error(err)
    })

  }

  resetForm() {
    this.selectedId = null
    this.rdvForm.reset()
  }

}