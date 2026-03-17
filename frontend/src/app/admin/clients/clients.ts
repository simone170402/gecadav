import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService } from './clients.service';
import { Client } from './client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit {
  private clientsService = inject(ClientsService);
  private fb = inject(FormBuilder);

  clients: Client[] = [];
  selectedClientId: number | null = null;
  isLoading = false;

  clientForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    adresse: ['']
  });

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientsService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Erreur chargement clients', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const clientData: Client = {
      nom: this.clientForm.value.nom ?? '',
      prenom: this.clientForm.value.prenom ?? '',
      email: this.clientForm.value.email ?? '',
      telephone: this.clientForm.value.telephone ?? '',
      adresse: this.clientForm.value.adresse ?? ''
    };

    if (this.selectedClientId !== null) {
      this.clientsService.updateClient(this.selectedClientId, clientData).subscribe({
        next: () => {
          this.resetForm();
          this.loadClients();
        },
        error: (err: unknown) => {
          console.error('Erreur modification client', err);
        }
      });
    } else {
      this.clientsService.createClient(clientData).subscribe({
        next: () => {
          this.resetForm();
          this.loadClients();
        },
        error: (err: unknown) => {
          console.error('Erreur création client', err);
        }
      });
    }
  }

  editClient(client: Client): void {
    this.selectedClientId = client.id ?? null;
    this.clientForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone ?? '',
      adresse: client.adresse ?? ''
    });
  }

  deleteClient(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce client ?')) {
      return;
    }

    this.clientsService.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
      },
      error: (err: unknown) => {
        console.error('Erreur suppression client', err);
      }
    });
  }

  resetForm(): void {
    this.selectedClientId = null;
    this.clientForm.reset();
  }
}