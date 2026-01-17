import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

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

  // 1️⃣ Mail vers le cabinet
  emailjs.send(
    'service_twdl6dx',
    'template_jvkxffg',
    {
      name: this.formData.name,
      email: this.formData.email,
      subject: finalSubject,
      message: this.formData.message,
    },
    'qQsVABTyMKFKp8ini'
  )
  .then(() => {

    // 2️⃣ Mail AUTOMATIQUE vers le client
    return emailjs.send(
      'service_twdl6dx',
      'template_yjwfe1e',
      {
        name: this.formData.name,
        email: this.formData.email,
        subject: finalSubject,
      },
      'qQsVABTyMKFKp8ini'
    );

  })
  .then(() => {
    this.successMsg =
      'Your message has been sent successfully. A confirmation email has been sent to you.';
    this.formData = {
      name: '',
      email: '',
      subject: '',
      customSubject: '',
      message: ''
    };
  })
  .catch(() => {
    this.errorMsg =
      'Something went wrong. Please try again later.';
  })
  .finally(() => {
    this.isSending = false;
  });
}

}
