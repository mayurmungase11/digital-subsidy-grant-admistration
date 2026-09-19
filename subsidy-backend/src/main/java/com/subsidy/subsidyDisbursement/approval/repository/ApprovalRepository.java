package com.subsidy.subsidyDisbursement.approval.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.approval.entity.Approval;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

	Optional<Approval> findByApplicationId(Long applicationId);
}
