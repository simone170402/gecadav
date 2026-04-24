package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ContactRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class ContactMailService {

    private final JavaMailSender mailSender;

    private static final String CABINET_EMAIL = "contact@cabinet-tsapy.com";
    private static final String CABINET_LOGO_URL = "https://cabinet-tsapy.com/images/Law_Logo.png";

    public ContactMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactMessage(ContactRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(CABINET_EMAIL);
            helper.setTo(CABINET_EMAIL);
            helper.setReplyTo(request.getEmail());
            helper.setSubject("Nouveau message - " + safe(request.getSubject()));
            helper.setText(buildInternalMail(request), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du message au cabinet", e);
        }
    }

    public void sendConfirmation(ContactRequest request) {
        try {
            boolean english = isEnglish(
                    safe(request.getSubject()) + " " + safe(request.getMessage())
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(CABINET_EMAIL);
            helper.setTo(request.getEmail());
            helper.setSubject(
                    english
                            ? "Message received - Cabinet TSAPY"
                            : "Confirmation de réception - Cabinet TSAPY"
            );

            helper.setText(
                    english ? buildEnglishConfirmation(request) : buildFrenchConfirmation(request),
                    true
            );

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de la confirmation", e);
        }
    }

    private boolean isEnglish(String text) {
        String lower = safe(text).toLowerCase();

        int score = 0;

        String[] englishWords = {
                "hello", "hi", "dear", "please", "thank", "thanks",
                "regards", "appointment", "consultation", "lawyer",
                "legal", "message", "request", "partnership"
        };

        String[] frenchWords = {
                "bonjour", "bonsoir", "merci", "rendez-vous", "avocat",
                "juridique", "consultation", "message", "demande",
                "partenariat", "recrutement"
        };

        for (String word : englishWords) {
            if (lower.contains(word)) score++;
        }

        for (String word : frenchWords) {
            if (lower.contains(word)) score--;
        }

        return score > 0;
    }

    private String buildInternalMail(ContactRequest request) {
        return """
            <div style="font-family:Arial,sans-serif;background:#f8f6f1;padding:30px;">
              <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e6dfcf;">
                %s

                <div style="padding:30px;color:#2a2a2a;">
                  <h2 style="margin:0 0 18px;color:#1f1f1f;">Nouveau message depuis le site</h2>

                  <p><strong>Nom :</strong> %s</p>
                  <p><strong>Email :</strong> %s</p>
                  <p><strong>Sujet :</strong> %s</p>

                  <div style="background:#f8f6f1;border-left:4px solid #bfa14a;padding:16px;margin-top:22px;">
                    <strong>Message :</strong><br><br>
                    %s
                  </div>
                </div>

                %s
              </div>
            </div>
            """.formatted(
                headerHtml("Nouveau message reçu"),
                escape(request.getName()),
                escape(request.getEmail()),
                escape(request.getSubject()),
                nl2br(escape(request.getMessage())),
                footerHtml()
        );
    }

    private String buildFrenchConfirmation(ContactRequest request) {
        return """
            <div style="font-family:Arial,sans-serif;background:#f8f6f1;padding:30px;">
              <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e6dfcf;">
                %s

                <div style="padding:30px;color:#2a2a2a;line-height:1.6;">
                  <p>Bonjour <strong>%s</strong>,</p>

                  <p>
                    Nous vous confirmons la bonne réception de votre message concernant :
                    <strong>%s</strong>.
                  </p>

                  <p>
                    Notre équipe l’examinera avec attention et vous répondra dans les meilleurs délais.
                  </p>

                  <div style="background:#f8f6f1;border-left:4px solid #bfa14a;padding:16px;margin:24px 0;">
                    <strong>Votre message :</strong><br><br>
                    %s
                  </div>

                  <p style="margin-top:28px;">
                    Cordialement,<br>
                    <strong>Cabinet TSAPY</strong><br>
                    Cabinet d’avocats
                  </p>
                </div>

                %s
              </div>
            </div>
            """.formatted(
                headerHtml("Votre message a bien été reçu"),
                escape(request.getName()),
                escape(request.getSubject()),
                nl2br(escape(request.getMessage())),
                footerHtml()
        );
    }

    private String buildEnglishConfirmation(ContactRequest request) {
        return """
            <div style="font-family:Arial,sans-serif;background:#f8f6f1;padding:30px;">
              <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e6dfcf;">
                %s

                <div style="padding:30px;color:#2a2a2a;line-height:1.6;">
                  <p>Hello <strong>%s</strong>,</p>

                  <p>
                    We confirm that we have received your message regarding:
                    <strong>%s</strong>.
                  </p>

                  <p>
                    Our team will review it carefully and get back to you as soon as possible.
                  </p>

                  <div style="background:#f8f6f1;border-left:4px solid #bfa14a;padding:16px;margin:24px 0;">
                    <strong>Your message:</strong><br><br>
                    %s
                  </div>

                  <p style="margin-top:28px;">
                    Best regards,<br>
                    <strong>Cabinet TSAPY</strong><br>
                    Law Firm
                  </p>
                </div>

                %s
              </div>
            </div>
            """.formatted(
                headerHtml("Your message has been received"),
                escape(request.getName()),
                escape(request.getSubject()),
                nl2br(escape(request.getMessage())),
                footerHtml()
        );
    }

    private String headerHtml(String subtitle) {
        return """
            <div style="background:#1f1f1f;padding:28px;text-align:center;">
              <img src="%s" alt="Cabinet TSAPY" style="width:72px;height:auto;margin-bottom:12px;" />
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">Cabinet TSAPY</h1>
              <p style="color:#bfa14a;margin:8px 0 0;font-size:15px;">%s</p>
            </div>
            """.formatted(CABINET_LOGO_URL, escape(subtitle));
    }

    private String footerHtml() {
        return """
            <div style="background:#f0eadf;padding:20px;text-align:center;color:#6b7280;font-size:12px;line-height:1.5;">
              <strong style="color:#1f1f1f;">Cabinet TSAPY</strong><br>
              Carrefour Auberge, au-dessus de la Pharmacie Bénin, Bafoussam, Cameroun<br>
              contact@cabinet-tsapy.com · +237 6 99 78 35 64
            </div>
            """;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String nl2br(String value) {
        return safe(value).replace("\n", "<br>");
    }

    private String escape(String value) {
        return safe(value)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}