package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.model.Client;
import com.cabinetavocat.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    public Client updateClient(Long id, Client updatedClient) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setNom(updatedClient.getNom());
                    client.setPrenom(updatedClient.getPrenom());
                    client.setEmail(updatedClient.getEmail());
                    client.setTelephone(updatedClient.getTelephone());
                    client.setAdresse(updatedClient.getAdresse());
                    return clientRepository.save(client);
                })
                .orElseThrow(() -> new RuntimeException("Client introuvable avec l'id : " + id));
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}