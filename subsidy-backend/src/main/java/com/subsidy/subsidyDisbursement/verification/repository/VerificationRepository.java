package com.subsidy.subsidyDisbursement.verification.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.verification.entity.Verification;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

}
