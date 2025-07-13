package it.markreds.pegaspay.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class MeController {
    @GetMapping
    @SuppressWarnings("unchecked")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt principal) {
        String username = principal.getClaimAsString("preferred_username");
        String email = principal.getClaimAsString("email");
        String fullName = principal.getClaimAsString("name");
        String givenName = principal.getClaimAsString("given_name");
        String familyName = principal.getClaimAsString("family_name");
        String subject = principal.getSubject();

        List<String> roles = principal.getClaim("realm_access") != null
                ? (List<String>) ((Map<String, Object>) principal.getClaim("realm_access")).get("roles")
                : List.of();

        return Map.of(
                "greeting", "Hello from backend!",
                "username", username,
                "email", email,
                "name", fullName,
                "givenName", givenName,
                "familyName", familyName,
                "subject", subject,
                "roles", roles
        );
    }
}
