package com.subsidy.subsidyDisbursement.eligibilityCriteria.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.eligibilityCriteria.entity.EligibilityCriteria;

public interface EligibilityCriteriaRepository extends JpaRepository<EligibilityCriteria, Long> {	
	
	 List<EligibilityCriteria> findBySchemeId(Long schemeId);
}
