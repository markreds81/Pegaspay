package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.UserRegistration;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeycloakUserService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(KeycloakUserService.class);

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public KeycloakUserService(Keycloak keycloak) {
        this.keycloak = keycloak;
    }

    private static UserRepresentation getUserRepresentation(UserRegistration request) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setEmailVerified(true);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.password());
        credential.setTemporary(false);

        user.setCredentials(List.of(credential));

        return user;
    }

    public String createUser(UserRegistration request) {
        UserRepresentation user = getUserRepresentation(request);

        UsersResource users = getUsersResource();
        try (Response response = users.create(user)) {
            if (response.getStatus() == 201) {
                String location = response.getHeaderString("Location");
                String userId = location.substring(location.lastIndexOf("/") + 1);
                log.debug("Creato utente con ID: {}", userId);
                return userId;
            }
            log.error("Errore nella creazione dell'utente: {}", response.getStatus());
        } catch (Exception e) {
            log.error("Errore nella creazione dell'utente", e);
        }

        return null;
    }

    public UserRepresentation getUserById(String userId) {
        return getUsersResource().get(userId).toRepresentation();
    }

    public void deleteUserById(String userId) {
        try (Response response = getUsersResource().delete(userId)) {
            if (response.getStatus() != 204) {
                log.error("Errore nella cancellazione dell'utente. Status: {}", response.getStatus());
                throw new RuntimeException("Impossibile eliminare l'utente");
            }
            log.debug("Utente {} eliminato con successo", userId);
        }
    }

    private UsersResource getUsersResource() {
        RealmResource realmResource = keycloak.realm(realm);
        return realmResource.users();
    }
}