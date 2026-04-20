package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.DocumentDto;
import com.cabinetavocat.backend.auth.dto.DocumentStatsDto;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.model.Document;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import com.cabinetavocat.backend.repository.DocumentRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ClientRepository clientRepository;
    private final AffaireRepository affaireRepository;
    private final FileStorageService fileStorageService;

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            ClientRepository clientRepository,
            AffaireRepository affaireRepository,
            FileStorageService fileStorageService
    ) {
        this.documentRepository = documentRepository;
        this.clientRepository = clientRepository;
        this.affaireRepository = affaireRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public List<DocumentDto> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public DocumentDto getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable avec l'id : " + id));

        return mapToDto(document);
    }

    @Override
    public DocumentDto uploadDocument(
            MultipartFile file,
            String categorie,
            String uploadedBy,
            Long clientId,
            Long affaireId
    ) {
        Client client = null;
        if (clientId != null) {
            client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + clientId));
        }

        Affaire affaire = null;
        if (affaireId != null) {
            affaire = affaireRepository.findById(affaireId)
                    .orElseThrow(() -> new RuntimeException("Affaire introuvable avec l'id : " + affaireId));
        }

        String storedFilename = fileStorageService.store(file);

        Document document = Document.builder()
                .nom(file.getOriginalFilename())
                .type(resolveFileType(file.getOriginalFilename()))
                .categorie(categorie)
                .fichier(storedFilename)
                .taille(file.getSize())
                .uploadedBy(uploadedBy)
                .client(client)
                .affaire(affaire)
                .build();

        Document saved = documentRepository.save(document);
        return mapToDto(saved);
    }

    @Override
    public Resource downloadDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable avec l'id : " + id));

        try {
            Path filePath = fileStorageService.load(document.getFichier());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Fichier introuvable ou illisible");
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erreur lors du chargement du fichier", e);
        }
    }

    @Override
    public String getDownloadFileName(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable avec l'id : " + id));

        return document.getNom();
    }

    @Override
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable avec l'id : " + id));

        fileStorageService.delete(document.getFichier());
        documentRepository.delete(document);
    }

    @Override
    public DocumentStatsDto getDocumentStats() {
        long totalSize = documentRepository.findAll()
                .stream()
                .map(Document::getTaille)
                .filter(size -> size != null)
                .reduce(0L, Long::sum);

        return DocumentStatsDto.builder()
                .totalDocuments(documentRepository.count())
                .contrats(documentRepository.countByCategorieIgnoreCase("Contrats"))
                .jugements(documentRepository.countByCategorieIgnoreCase("Jugements"))
                .espaceUtilise(formatSize(totalSize))
                .build();
    }

    private DocumentDto mapToDto(Document document) {
        String clientName = null;
        if (document.getClient() != null) {
            clientName = (document.getClient().getPrenom() + " " + document.getClient().getNom()).trim();
        }

        String affaireReference = null;
        if (document.getAffaire() != null) {
            int year = document.getAffaire().getDateOuverture() != null
                    ? document.getAffaire().getDateOuverture().getYear()
                    : java.time.LocalDate.now().getYear();
            affaireReference = String.format("AFF-%d-%03d", year, document.getAffaire().getId());
        }

        return DocumentDto.builder()
                .id(document.getId())
                .nom(document.getNom())
                .type(document.getType())
                .categorie(document.getCategorie())
                .fichier(document.getFichier())
                .taille(document.getTaille())
                .tailleFormatee(formatSize(document.getTaille() != null ? document.getTaille() : 0))
                .uploadedBy(document.getUploadedBy())
                .dateUpload(document.getDateUpload() != null ? document.getDateUpload().toString() : null)
                .clientId(document.getClient() != null ? document.getClient().getId() : null)
                .client(clientName)
                .affaireId(document.getAffaire() != null ? document.getAffaire().getId() : null)
                .affaireReference(affaireReference)
                .build();
    }

    private String resolveFileType(String filename) {
        if (filename == null || !filename.contains(".")) return "FILE";

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (ext) {
            case "pdf" -> "PDF";
            case "png", "jpg", "jpeg", "webp" -> "IMG";
            case "xls", "xlsx", "csv" -> "XLS";
            case "doc", "docx" -> "DOC";
            default -> ext.toUpperCase();
        };
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024L * 1024L * 1024L) return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        return String.format("%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
    }
}