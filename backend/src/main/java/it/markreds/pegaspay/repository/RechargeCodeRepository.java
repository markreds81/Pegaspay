package it.markreds.pegaspay.repository;

import it.markreds.pegaspay.model.RechargeCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RechargeCodeRepository extends JpaRepository<RechargeCode, Long> {
    Optional<RechargeCode> findByCode(String code);

    boolean existsByCode(String code);
}
