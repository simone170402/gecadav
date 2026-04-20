package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.ProcurationDto;
import com.cabinetavocat.backend.auth.dto.ProcurationStatsDto;
import com.cabinetavocat.backend.service.ProcurationPdfService;
import com.cabinetavocat.backend.service.ProcurationService;
import org.springframework.web.bind.annotation.*;
import com.cabinetavocat.backend.model.Procuration;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;

import java.util.List;

@RestController
@RequestMapping("/api/procurations")
public class ProcurationController {

    private final ProcurationService procurationService;
    private final ProcurationPdfService procurationPdfService;

    public ProcurationController(
            ProcurationService procurationService,
            ProcurationPdfService procurationPdfService
    ) {
        this.procurationService = procurationService;
        this.procurationPdfService = procurationPdfService;
    }

    @GetMapping
    public List<ProcurationDto> getAllProcurations() {
        return procurationService.getAllProcurations();
    }

    @GetMapping("/{id}")
    public ProcurationDto getProcurationById(@PathVariable Long id) {
        return procurationService.getProcurationById(id);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> generatePdf(@PathVariable Long id) {
        Procuration procuration = procurationService.getEntityById(id);
        ByteArrayInputStream pdfStream = procurationPdfService.generatePdf(procuration);

        String filename = String.format(
                "procuration-%d.pdf",
                procuration.getId()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }

    @PostMapping
    public ProcurationDto createProcuration(@RequestBody ProcurationDto dto) {
        return procurationService.createProcuration(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProcuration(@PathVariable Long id) {
        procurationService.deleteProcuration(id);
    }

    @GetMapping("/stats")
    public ProcurationStatsDto getStats() {
        return procurationService.getStats();
    }

    @PutMapping("/{id}")
    public ProcurationDto updateProcuration(@PathVariable Long id, @RequestBody ProcurationDto dto) {
        return procurationService.updateProcuration(id, dto);
    }
}