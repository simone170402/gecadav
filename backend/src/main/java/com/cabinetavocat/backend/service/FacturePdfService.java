package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.model.Facture;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;

@Service
public class FacturePdfService {

    public ByteArrayInputStream generatePdf(Facture facture) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font textFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            Paragraph title = new Paragraph("FACTURE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Paragraph ref = new Paragraph(
                    "Référence : " + safe(facture.getReference()),
                    sectionFont
            );
            ref.setSpacingAfter(15);
            document.add(ref);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingAfter(20);
            table.setWidths(new float[]{2f, 4f});

            addCell(table, "Client", true);
            addCell(table, getClientName(facture), false);

            addCell(table, "Montant", true);
            addCell(table, formatMoney(facture.getMontant()), false);

            addCell(table, "Statut", true);
            addCell(table, facture.getStatut() != null ? facture.getStatut().name() : "—", false);

            addCell(table, "Date d'émission", true);
            addCell(table, facture.getDateEmission() != null ? facture.getDateEmission().toString() : "—", false);

            addCell(table, "Date d'échéance", true);
            addCell(table, facture.getDateEcheance() != null ? facture.getDateEcheance().toString() : "—", false);

            addCell(table, "Mode de paiement", true);
            addCell(table, safe(facture.getModePaiement()), false);

            addCell(table, "Affaire liée", true);
            addCell(table, getAffaireReference(facture), false);

            document.add(table);

            Paragraph descriptionTitle = new Paragraph("Description", sectionFont);
            descriptionTitle.setSpacingAfter(8);
            document.add(descriptionTitle);

            Paragraph descriptionText = new Paragraph(
                    safe(facture.getDescription()).equals("—")
                            ? "Prestations juridiques et/ou honoraires liés au dossier traité."
                            : facture.getDescription(),
                    textFont
            );
            descriptionText.setAlignment(Element.ALIGN_JUSTIFIED);
            descriptionText.setSpacingAfter(30);
            document.add(descriptionText);

            Paragraph footer = new Paragraph(
                    "Merci pour votre confiance.\nCette facture a été générée par le système de gestion du cabinet.",
                    textFont
            );
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();

            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF de facture", e);
        }
    }

    private void addCell(PdfPTable table, String content, boolean header) {
        Font font = header
                ? new Font(Font.HELVETICA, 11, Font.BOLD)
                : new Font(Font.HELVETICA, 11, Font.NORMAL);

        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setPadding(8);
        table.addCell(cell);
    }

    private String getClientName(Facture facture) {
        if (facture.getClient() == null) return "—";
        return (safe(facture.getClient().getPrenom()) + " " + safe(facture.getClient().getNom())).trim();
    }

    private String getAffaireReference(Facture facture) {
        if (facture.getAffaire() == null) return "—";
        int year = facture.getAffaire().getDateOuverture() != null
                ? facture.getAffaire().getDateOuverture().getYear()
                : java.time.LocalDate.now().getYear();
        return String.format("AFF-%d-%03d", year, facture.getAffaire().getId());
    }

    private String formatMoney(BigDecimal amount) {
        BigDecimal safe = amount != null ? amount : BigDecimal.ZERO;
        DecimalFormat format = new DecimalFormat("#,##0.00");
        return format.format(safe) + " FCFA";
    }

    private String safe(String value) {
        return value != null && !value.isBlank() ? value : "—";
    }
}
