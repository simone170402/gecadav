package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.model.Document;
import com.cabinetavocat.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public List<Document> getAll() {
        return repository.findAll();
    }

    public Document save(Document document) {
        return repository.save(document);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}