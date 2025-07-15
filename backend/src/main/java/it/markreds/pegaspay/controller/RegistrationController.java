package it.markreds.pegaspay.controller;

import it.markreds.pegaspay.dto.UserRegistration;
import it.markreds.pegaspay.service.RegistrationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public")
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserRegistration request) {
        String activationCode = registrationService.registerUser(request);
        return Map.of(
                "activationCode", activationCode,
                "message", "Registration successful. Check your email for the activation code"
        );
    }

    @GetMapping("/activate")
    public Map<String, Object> activate(@RequestParam String code) {
        String keycloakId = registrationService.activateUser(code);
        return Map.of(
                "keycloakSubject", keycloakId,
                "mesagge", "Activation successful. You can now login with your Keycloak account"
        );
    }
}
