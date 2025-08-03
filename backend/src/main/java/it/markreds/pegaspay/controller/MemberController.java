package it.markreds.pegaspay.controller;

import it.markreds.pegaspay.dto.*;
import it.markreds.pegaspay.model.Wallet;
import it.markreds.pegaspay.service.AccountUserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/member")
public class MemberController {
    private final AccountUserService accountUserService;

    public MemberController(AccountUserService accountUserService) {
        this.accountUserService = accountUserService;
    }

    @GetMapping("/me")
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

    @GetMapping("/wallet")
    public WalletDto wallet(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getSubject());
        Wallet wallet = accountUserService.getWalletOf(userId);
        return new WalletDto(
                wallet.getBalance(),
                wallet.getCurrency(),
                wallet.getCreatedAt(),
                wallet.getAccountUser().getFirstName(),
                wallet.getAccountUser().getLastName());
    }

    @GetMapping("/journal")
    public List<JournalTransaction> journal(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getSubject());
        Wallet wallet = accountUserService.getWalletOf(userId);
        return accountUserService.getJournal(wallet);
    }

    @PostMapping("/redeem")
    public RedeemResult redeemCode(@AuthenticationPrincipal Jwt principal, @RequestBody String code) {
        UUID userId = UUID.fromString(principal.getSubject());
        return accountUserService.redeemCode(userId, code);
    }

    @PostMapping("/transfer")
    public TransferResult transfer(@AuthenticationPrincipal Jwt principal, @RequestBody TransferRequest request) {
        return accountUserService.transfer(
                UUID.fromString(principal.getSubject()),
                request.toUserEmail(),
                request.amount());
    }
}
