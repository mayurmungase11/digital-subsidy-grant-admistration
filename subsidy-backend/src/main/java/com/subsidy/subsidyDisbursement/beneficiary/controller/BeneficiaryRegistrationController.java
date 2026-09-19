package com.subsidy.subsidyDisbursement.beneficiary.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryRegistrationRequestDTO;
import com.subsidy.subsidyDisbursement.beneficiary.service.BeneficiaryRegistrationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth/register")
public class BeneficiaryRegistrationController {

    private final BeneficiaryRegistrationService registrationService;

    public BeneficiaryRegistrationController(
            BeneficiaryRegistrationService registrationService) {

        this.registrationService = registrationService;
    }

    @PostMapping("/beneficiary")
    public ResponseEntity<String> registerBeneficiary(
            @Valid @RequestBody BeneficiaryRegistrationRequestDTO request) {

        registrationService.registerBeneficiary(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Beneficiary registered successfully");
    }
}