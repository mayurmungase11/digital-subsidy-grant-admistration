package com.subsidy.subsidyDisbursement.disbursement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.subsidy.subsidyDisbursement.disbursement.entity.Disbursement;

public interface DisbursementRepository extends JpaRepository<Disbursement, Long> {

	@Query("""
		       SELECT COALESCE(SUM(d.amount), 0)
		       FROM Disbursement d
		       WHERE d.application.id = :applicationId
		       """)
		Double getTotalDisbursedAmount(Long applicationId);
}
