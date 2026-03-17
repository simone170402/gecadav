package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.AffaireRequest;
import com.cabinetavocat.backend.model.Affaire;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AffaireService {

    private final AffaireRepository affaireRepository;
    private final ClientRepository clientRepository;

    public AffaireService(AffaireRepository affaireRepository, ClientRepository clientRepository) {
        this.affaireRepository = affaireRepository;
        this.clientRepository = clientRepository;
    }

    public List<Affaire> getAllAffaires() {
        return affaireRepository.findAll();
    }

    public Optional<Affaire> getAffaireById(Long id) {
        return affaireRepository.findById(id);
    }

    public Affaire createAffaire(AffaireRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        Affaire affaire = Affaire.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .statut(request.getStatut())
                .dateOuverture(request.getDateOuverture())
                .client(client)
                .build();

        return affaireRepository.save(affaire);
    }

    public Affaire updateAffaire(Long id, AffaireRequest request) {
        Affaire affaire = affaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affaire introuvable"));

        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        affaire.setTitre(request.getTitre());
        affaire.setDescription(request.getDescription());
        affaire.setStatut(request.getStatut());
        affaire.setDateOuverture(request.getDateOuverture());
        affaire.setClient(client);

        return affaireRepository.save(affaire);
    }

    public void deleteAffaire(Long id) {
        affaireRepository.deleteById(id);
    }
}