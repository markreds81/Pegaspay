package it.markreds.pegaspay.controller;

import it.markreds.pegaspay.dto.UserRegistration;
import it.markreds.pegaspay.service.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public")
public class PublicController {
    private final RegistrationService registrationService;

    public PublicController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserRegistration userData, HttpServletRequest httpRequest) {
        String activationCode = registrationService.registerUser(userData);
        String baseUrl = httpRequest.getRequestURL().toString().replace(httpRequest.getRequestURI(), "");
        String activationLink = baseUrl + "/public/activate?code=" + activationCode;
        return Map.of(
                "activationCode", activationCode,
                "activationLink", activationLink,
                "message", "Registration successful. Check your email for the activation code."
        );
    }

    @GetMapping("/activate")
    public Map<String, Object> activate(@RequestParam String code) {
        String keycloakId = registrationService.activateUser(code);
        return Map.of(
                "keycloakSubject", keycloakId,
                "message", "Activation successful. You can now login with your Keycloak account."
        );
    }
}
