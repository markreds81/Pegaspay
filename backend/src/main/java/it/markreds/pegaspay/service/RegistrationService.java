package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.UserRegistration;
import it.markreds.pegaspay.model.AccountUser;
import it.markreds.pegaspay.repository.AccountUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class RegistrationService {
    private final AccountUserRepository userRepository;
    private final KeycloakUserService keycloakUserService;

    public RegistrationService(AccountUserRepository userRepository, KeycloakUserService keycloakUserService) {
        this.userRepository = userRepository;
        this.keycloakUserService = keycloakUserService;
    }

    public String registerUser(UserRegistration registration) {
        if (userRepository.existsByUsernameIgnoreCase(registration.username())) {
            throw new IllegalArgumentException("Username già registrato");
        }

        if (userRepository.existsByEmailIgnoreCase(registration.email())) {
            throw new IllegalArgumentException("Email già registrata");
        }

        // genera il codice di attivazione
        String activationCode = UUID.randomUUID().toString();

        // crea il nuovo utente
        AccountUser user = new AccountUser();
        user.setUsername(registration.username());
        user.setFirstName(registration.firstName());
        user.setLastName(registration.lastName());
        user.setEmail(registration.email());
        user.setActive(false);
        user.setActivationCode(activationCode);
        userRepository.save(user);

        return activationCode;
    }

    public String activateUser(String code) {
        AccountUser user = userRepository.findByActivationCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (user.isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Utente già attivo");
        }

        String userId = keycloakUserService.createUser(new UserRegistration(user.getUsername(), "welcome", user.getEmail(), user.getFirstName(), user.getLastName()));
        if (userId == null || userId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Si è verificato un errore con il servizio di autenticazione");
        }

        user.setKeycloakId(UUID.fromString(userId));
        user.setActive(true);
        userRepository.save(user);

        return userId;
    }
}
