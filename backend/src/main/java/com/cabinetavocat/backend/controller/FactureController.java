package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.FactureDto;
import com.cabinetavocat.backend.auth.dto.FactureStatsDto;
import com.cabinetavocat.backend.model.Facture;
import com.cabinetavocat.backend.service.FacturePdfService;
import com.cabinetavocat.backend.service.FactureService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;
    private final FacturePdfService facturePdfService;

    public FactureController(FactureService factureService, FacturePdfService facturePdfService) {
        this.factureService = factureService;
        this.facturePdfService = facturePdfService;
    }

    @GetMapping
    public List<FactureDto> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public FactureDto getFactureById(@PathVariable Long id) {
        return factureService.getFactureById(id);
    }

    @PostMapping
    public FactureDto createFacture(@RequestBody FactureDto factureDto) {
        return factureService.createFacture(factureDto);
    }

    @PutMapping("/{id}")
    public FactureDto updateFacture(@PathVariable Long id, @RequestBody FactureDto factureDto) {
        return factureService.updateFacture(id, factureDto);
    }

    @DeleteMapping("/{id}")
    public void deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
    }

    @GetMapping("/stats")
    public FactureStatsDto getFactureStats() {
        return factureService.getFactureStats();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> generatePdf(@PathVariable Long id) {
        Facture facture = factureService.getEntityById(id);
        ByteArrayInputStream pdfStream = facturePdfService.generatePdf(facture);

        String filename = String.format("facture-%s.pdf", facture.getReference());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }
}