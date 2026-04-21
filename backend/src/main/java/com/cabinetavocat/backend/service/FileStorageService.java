package com.cabinetavocat.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'initialiser le dossier d'upload", e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Fichier vide ou manquant");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";

        int extIndex = originalFilename.lastIndexOf('.');
        if (extIndex >= 0) {
            extension = originalFilename.substring(extIndex);
        }

        String storedFilename = UUID.randomUUID() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, this.rootLocation.resolve(storedFilename), StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Impossible de stocker le fichier " + originalFilename, e);
        }
    }

    public Path load(String filename) {
        return rootLocation.resolve(filename).normalize();
    }

    public void delete(String filename) {
        if (filename == null || filename.isBlank()) return;

        try {
            Files.deleteIfExists(load(filename));
        } catch (IOException e) {
            throw new RuntimeException("Impossible de supprimer le fichier " + filename, e);
        }
    }
}
