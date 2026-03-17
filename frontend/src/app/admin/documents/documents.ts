import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DocumentsService } from './documents.service'
import { Document } from './document.model'

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents implements OnInit {

  private service = inject(DocumentsService)

  documents: Document[] = []

  nom = ""
  type = ""

  selectedFile!: File

  ngOnInit(): void {
    this.loadDocuments()
  }

  loadDocuments() {

    this.service.getAll().subscribe({

      next: (data) => this.documents = data,

      error: (err) => console.error(err)

    })

  }

  onFileSelected(event: any) {

    this.selectedFile = event.target.files[0]

  }

  upload() {

    const formData = new FormData()

    formData.append("file", this.selectedFile)
    formData.append("nom", this.nom)
    formData.append("type", this.type)

    this.service.upload(formData).subscribe({

      next: () => {
        this.loadDocuments()
        this.nom = ""
        this.type = ""
      }

    })

  }

  delete(id: number) {

    if (!confirm("Supprimer document ?")) return

    this.service.delete(id).subscribe(() => this.loadDocuments())

  }

}