package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.DocumentDto;
import com.cabinetavocat.backend.auth.dto.DocumentStatsDto;
import com.cabinetavocat.backend.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public List<DocumentDto> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public DocumentDto getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentDto uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy,
            @RequestParam(value = "clientId", required = false) Long clientId,
            @RequestParam(value = "affaireId", required = false) Long affaireId
    ) {
        return documentService.uploadDocument(file, categorie, uploadedBy, clientId, affaireId);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Resource resource = documentService.downloadDocument(id);
        String filename = documentService.getDownloadFileName(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }

    @GetMapping("/stats")
    public DocumentStatsDto getDocumentStats() {
        return documentService.getDocumentStats();
    }
}