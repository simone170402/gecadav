package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.model.Procuration;
import org.openpdf.text.*;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ProcurationPdfService {

    public ByteArrayInputStream generatePdf(Procuration procuration) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font textFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            Paragraph title = new Paragraph("PROCURATION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Paragraph ref = new Paragraph(
                    "Référence : " + formatReference(procuration),
                    sectionFont
            );
            ref.setSpacingAfter(15);
            document.add(ref);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingAfter(20);
            table.setWidths(new float[]{2f, 4f});

            addCell(table, "Client", true);
            addCell(table, getClientName(procuration), false);

            addCell(table, "Type", true);
            addCell(table, safe(procuration.getType()), false);

            addCell(table, "Statut", true);
            addCell(table, safe(procuration.getStatus()), false);

            addCell(table, "Date de création", true);
            addCell(table, procuration.getCreatedDate() != null ? procuration.getCreatedDate().toString() : "—", false);

            addCell(table, "Date d'expiration", true);
            addCell(table, procuration.getExpiryDate() != null ? procuration.getExpiryDate().toString() : "—", false);

            addCell(table, "Signée par", true);
            addCell(table, safe(procuration.getSignedBy()), false);

            document.add(table);

            Paragraph scopeTitle = new Paragraph("Étendue de la procuration", sectionFont);
            scopeTitle.setSpacingAfter(8);
            document.add(scopeTitle);

            Paragraph scopeText = new Paragraph(safe(procuration.getScope()), textFont);
            scopeText.setSpacingAfter(25);
            scopeText.setAlignment(Element.ALIGN_JUSTIFIED);
            document.add(scopeText);

            Paragraph legalText = new Paragraph(
                    "La présente procuration atteste que le mandant confère au mandataire les pouvoirs décrits ci-dessus pour agir en son nom dans les limites prévues par la loi et selon les termes convenus.",
                    textFont
            );
            legalText.setAlignment(Element.ALIGN_JUSTIFIED);
            legalText.setSpacingAfter(35);
            document.add(legalText);

            Paragraph signature = new Paragraph(
                    "Fait pour servir et valoir ce que de droit.",
                    textFont
            );
            signature.setSpacingAfter(50);
            document.add(signature);

            PdfPTable signTable = new PdfPTable(2);
            signTable.setWidthPercentage(100);
            signTable.setWidths(new float[]{1f, 1f});

            PdfPCell left = new PdfPCell(new Phrase("Le Client", textFont));
            left.setBorder(Rectangle.NO_BORDER);
            left.setHorizontalAlignment(Element.ALIGN_CENTER);
            left.setPaddingTop(20);

            PdfPCell right = new PdfPCell(new Phrase("Le Cabinet / Signataire", textFont));
            right.setBorder(Rectangle.NO_BORDER);
            right.setHorizontalAlignment(Element.ALIGN_CENTER);
            right.setPaddingTop(20);

            signTable.addCell(left);
            signTable.addCell(right);

            document.add(signTable);

            document.close();

            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF de procuration", e);
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

    private String getClientName(Procuration procuration) {
        if (procuration.getClient() == null) return "—";
        return (safe(procuration.getClient().getPrenom()) + " " + safe(procuration.getClient().getNom())).trim();
    }

    private String safe(String value) {
        return value != null && !value.isBlank() ? value : "—";
    }

    private String formatReference(Procuration procuration) {
        int year = procuration.getCreatedDate() != null ? procuration.getCreatedDate().getYear() : java.time.LocalDate.now().getYear();
        long id = procuration.getId() != null ? procuration.getId() : 0L;
        return String.format("PROC-%d-%03d", year, id);
    }
}