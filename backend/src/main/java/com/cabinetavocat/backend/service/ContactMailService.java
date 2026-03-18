package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ContactRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactMailService {

    private final JavaMailSender mailSender;

    public ContactMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactMessage(ContactRequest request) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("contact@cabinet-tsapy.com");
        mail.setReplyTo(request.getEmail());
        mail.setSubject("Nouveau message - " + request.getSubject());
        mail.setText(
            "Nom: " + request.getName() + "\n" +
            "Email: " + request.getEmail() + "\n" +
            "Sujet: " + request.getSubject() + "\n\n" +
            "Message:\n" + request.getMessage()
        );

        mailSender.send(mail);
    }

    public void sendConfirmation(ContactRequest request) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(request.getEmail());
        mail.setSubject("Confirmation de réception - Cabinet Tsapy");
        mail.setText(
            "Bonjour " + request.getName() + ",\n\n" +
            "Nous avons bien reçu votre message concernant : " + request.getSubject() + ".\n" +
            "Nous vous répondrons dans les plus brefs délais.\n\n" +
            "Cabinet Tsapy"
        );

        mailSender.send(mail);
    }
}
