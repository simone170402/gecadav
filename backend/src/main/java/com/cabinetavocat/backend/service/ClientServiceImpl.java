package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.ClientDto;
import com.cabinetavocat.backend.auth.dto.ClientStatsDto;
import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.repository.AffaireRepository;
import com.cabinetavocat.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final AffaireRepository affaireRepository;

    public ClientServiceImpl(ClientRepository clientRepository, AffaireRepository affaireRepository) {
        this.clientRepository = clientRepository;
        this.affaireRepository = affaireRepository;
    }

    @Override
    public List<ClientDto> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public ClientDto getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + id));

        return mapToDto(client);
    }

    @Override
    public ClientDto createClient(ClientDto clientDto) {
        Client client = Client.builder()
                .nom(clientDto.getNom())
                .prenom(clientDto.getPrenom())
                .email(clientDto.getEmail())
                .telephone(clientDto.getTelephone())
                .adresse(clientDto.getAdresse())
                .type(clientDto.getType())
                .entreprise(clientDto.getEntreprise())
                .statut(clientDto.getStatut() != null ? clientDto.getStatut() : "Actif")
                .notes(clientDto.getNotes())
                .build();

        Client saved = clientRepository.save(client);
        return mapToDto(saved);
    }

    @Override
    public ClientDto updateClient(Long id, ClientDto clientDto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + id));

        client.setNom(clientDto.getNom());
        client.setPrenom(clientDto.getPrenom());
        client.setEmail(clientDto.getEmail());
        client.setTelephone(clientDto.getTelephone());
        client.setAdresse(clientDto.getAdresse());
        client.setType(clientDto.getType());
        client.setEntreprise(clientDto.getEntreprise());
        client.setStatut(clientDto.getStatut());
        client.setNotes(clientDto.getNotes());

        Client updated = clientRepository.save(client);
        return mapToDto(updated);
    }

    @Override
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + id));

        clientRepository.delete(client);
    }

    @Override
    public ClientStatsDto getClientStats() {
        return ClientStatsDto.builder()
                .totalClients(clientRepository.count())
                .clientsActifs(clientRepository.countByStatutIgnoreCase("Actif"))
                .entreprises(clientRepository.countByTypeIgnoreCase("Entreprise"))
                .particuliers(clientRepository.countByTypeIgnoreCase("Particulier"))
                .build();
    }

    private ClientDto mapToDto(Client client) {
        String nomComplet = (client.getPrenom() + " " + client.getNom()).trim();
        int nombreAffaires = (int) affaireRepository.findAll()
                .stream()
                .filter(a -> a.getClient() != null && a.getClient().getId().equals(client.getId()))
                .count();

        String dernierContact = client.getDateCreation() != null
                ? client.getDateCreation().toString()
                : null;

        return ClientDto.builder()
                .id(client.getId())
                .reference(formatClientReference(client.getId()))
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .nomComplet(nomComplet)
                .email(client.getEmail())
                .telephone(client.getTelephone())
                .adresse(client.getAdresse())
                .type(client.getType())
                .entreprise(client.getEntreprise())
                .statut(client.getStatut())
                .notes(client.getNotes())
                .nombreAffaires(nombreAffaires)
                .dernierContact(dernierContact)
                .build();
    }

    private String formatClientReference(Long id) {
        long safeId = id != null ? id : 0L;
        return String.format("CLI-%03d", safeId);
    }

    
}
