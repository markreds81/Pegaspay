package it.markreds.pegaspay.service;

import it.markreds.pegaspay.dto.UserRegistration;
import it.markreds.pegaspay.model.AccountUser;
import it.markreds.pegaspay.model.RechargeCode;
import it.markreds.pegaspay.model.Wallet;
import it.markreds.pegaspay.repository.AccountUserRepository;
import it.markreds.pegaspay.repository.RechargeCodeRepository;
import it.markreds.pegaspay.repository.WalletRepository;
import it.markreds.pegaspay.util.CodeGenerator;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AdminService {
    private static final String SYSTEM_EMAIL = "system@pegaspay.local";
    private static final String SYSTEM_USERNAME = "ppadmin";
    private static final String SYSTEM_PASSWORD = "changeit";
    private static final String SYSTEM_FIRST_NAME = "System";
    private static final String SYSTEM_LAST_NAME = "Administrator";
    private static final int CODE_LENGTH = 16;

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminService.class);

    private final AccountUserRepository userRepository;
    private final RechargeCodeRepository codeRepository;
    private final WalletRepository walletRepository;
    private final KeycloakUserService keycloakUserService;

    public AdminService(AccountUserRepository userRepository, RechargeCodeRepository codeRepository, WalletRepository walletRepository, KeycloakUserService keycloakUserService) {
        this.userRepository = userRepository;
        this.codeRepository = codeRepository;
        this.walletRepository = walletRepository;
        this.keycloakUserService = keycloakUserService;
    }

    @PostConstruct
    public void initSystemWallet() {
        AccountUser admin = userRepository.findByEmailIgnoreCase(SYSTEM_EMAIL).orElseGet(() -> {
            String keycloakId = keycloakUserService.createUser(new UserRegistration(SYSTEM_USERNAME, SYSTEM_PASSWORD, SYSTEM_EMAIL, SYSTEM_FIRST_NAME, SYSTEM_LAST_NAME));
            AccountUser user = new AccountUser();
            user.setUsername(SYSTEM_USERNAME);
            user.setEmail(SYSTEM_EMAIL);
            user.setFirstName(SYSTEM_FIRST_NAME);
            user.setLastName(SYSTEM_LAST_NAME);
            user.setActive(true);
            user.setActivationCode(null);
            user.setKeycloakId(UUID.fromString(keycloakId));
            return userRepository.save(user);
        });

        log.debug("Admin user found: {}", admin.getKeycloakId());

        Wallet wallet = walletRepository.findByAccountUser(admin).orElseGet(() -> {
            Wallet w = new Wallet();
            w.setAccountUser(admin);
            w.setCurrency("EUR");
            return walletRepository.save(w);
        });

        log.debug("Master wallet found: {}", wallet.getReferenceId());
    }

    public Wallet getSystemWallet() {
        AccountUser sysUser = userRepository.findByUsernameIgnoreCase(SYSTEM_USERNAME)
                .orElseThrow(() -> new IllegalArgumentException("System user not found"));
        return walletRepository.findByAccountUser(sysUser)
                .orElseThrow(() -> new IllegalArgumentException("System wallet not found"));
    }

    @Transactional
    public RechargeCode generateCode(BigDecimal amount) {
        String code;
        do {
            code = CodeGenerator.generateReadableCode(CODE_LENGTH);
        } while (codeRepository.existsByCode(code));
        RechargeCode rc = new RechargeCode();
        rc.setCode(code);
        rc.setAmount(amount);
        rc.setRedeemed(false);
        rc.setRedeemedAt(null);
        codeRepository.save(rc);
        return rc;
    }
}
