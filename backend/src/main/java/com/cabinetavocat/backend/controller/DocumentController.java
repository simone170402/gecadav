package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.model.Document;
import com.cabinetavocat.backend.service.DocumentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Document> getAll() {
        return service.getAll();
    }

    @PostMapping("/upload")
    public Document upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("nom") String nom,
            @RequestParam("type") String type
    ) throws IOException {

        String uploadDir = "uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File destination = new File(uploadDir + filename);

        file.transferTo(destination);

        Document document = Document.builder()
                .nom(nom)
                .type(type)
                .fichier(filename)
                .dateUpload(LocalDate.now())
                .build();

        return service.save(document);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

}