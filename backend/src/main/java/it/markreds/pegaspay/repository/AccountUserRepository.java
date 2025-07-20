package it.markreds.pegaspay.repository;

import it.markreds.pegaspay.model.AccountUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountUserRepository extends JpaRepository<AccountUser, Long> {
    Optional<AccountUser> findByActivationCode(String code);

    Optional<AccountUser> findByEmailIgnoreCase(String username);

    Optional<AccountUser> findByKeycloakId(UUID keycloakId);

    Optional<AccountUser> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);
}
