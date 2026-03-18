package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.ContactRequest;
import com.cabinetavocat.backend.service.ContactMailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMailService contactMailService;

    public ContactController(ContactMailService contactMailService) {
        this.contactMailService = contactMailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> send(@RequestBody ContactRequest request) {
        contactMailService.sendContactMessage(request);
        contactMailService.sendConfirmation(request);

        return ResponseEntity.ok(Map.of("message", "Message envoyé avec succès"));
    }
}