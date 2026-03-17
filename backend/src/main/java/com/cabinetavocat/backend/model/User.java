package com.cabinetavocat.backend.model;

import jakarta.persistence.*;
import lombok.*;


@Entity

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;
}
