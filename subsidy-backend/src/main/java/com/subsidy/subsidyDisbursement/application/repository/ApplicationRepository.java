package com.subsidy.subsidyDisbursement.application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.application.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByBeneficiaryId(Long beneficiaryId);

}