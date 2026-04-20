package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.DocumentDto;
import com.cabinetavocat.backend.auth.dto.DocumentStatsDto;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    List<DocumentDto> getAllDocuments();
    DocumentDto getDocumentById(Long id);
    DocumentDto uploadDocument(
            MultipartFile file,
            String categorie,
            String uploadedBy,
            Long clientId,
            Long affaireId
    );
    Resource downloadDocument(Long id);
    String getDownloadFileName(Long id);
    void deleteDocument(Long id);
    DocumentStatsDto getDocumentStats();
}