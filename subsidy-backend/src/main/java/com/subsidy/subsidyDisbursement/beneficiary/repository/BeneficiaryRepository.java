package com.subsidy.subsidyDisbursement.beneficiary.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    boolean existsByEmail(String email);

    Optional<Beneficiary> findByEmail(String email);

}