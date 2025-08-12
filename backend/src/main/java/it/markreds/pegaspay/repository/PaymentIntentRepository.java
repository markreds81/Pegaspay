package it.markreds.pegaspay.repository;

import it.markreds.pegaspay.model.PaymentIntent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, Long> {
    Optional<PaymentIntent> findByReferenceId(UUID referenceId);

    Page<PaymentIntent> findByMerchantWallet_AccountUser_KeycloakIdOrderByCreatedAtDesc(UUID merchantSub, Pageable pageable);
}
