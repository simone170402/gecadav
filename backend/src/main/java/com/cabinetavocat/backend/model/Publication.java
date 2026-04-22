package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "publications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(nullable = false, length = 1500)
    private String excerpt;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String author;

    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicationStatus status;

    @Column(nullable = false)
    private Boolean premium = false;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(nullable = false)
    private Integer views = 0;

    private Integer estimatedReadTime;

    @Column(columnDefinition = "TEXT")
    private String previewContent;

    private LocalDateTime publishedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = PublicationStatus.DRAFT;
        }
        if (this.views == null) {
            this.views = 0;
        }
        if (this.premium == null) {
            this.premium = false;
        }
        if (this.featured == null) {
            this.featured = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}