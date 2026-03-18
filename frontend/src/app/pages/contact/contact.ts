import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private http = inject(HttpClient);

  formData = {
    name: '',
    email: '',
    subject: '',
    customSubject: '',
    message: ''
  };

  isSending = false;
  successMsg = '';
  errorMsg = '';

  sendMessage() {
    this.isSending = true;
    this.successMsg = '';
    this.errorMsg = '';

    const finalSubject =
      this.formData.subject === 'other'
        ? this.formData.customSubject
        : this.formData.subject;

    this.http.post(`${environment.apiUrl}/api/contact`, {
      name: this.formData.name,
      email: this.formData.email,
      subject: finalSubject,
      message: this.formData.message
    }).subscribe({
      next: () => {
        this.successMsg =
          'Your message has been sent successfully. A confirmation email has been sent to you.';
        this.formData = {
          name: '',
          email: '',
          subject: '',
          customSubject: '',
          message: ''
        };
        this.isSending = false;
      },
      error: () => {
        this.errorMsg = 'Something went wrong. Please try again later.';
        this.isSending = false;
      }
    });
  }
}