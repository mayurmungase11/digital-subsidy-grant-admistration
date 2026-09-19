package com.subsidy.subsidyDisbursement.application.dto;

import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;

import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUpdateRequestDTO {

    private Long beneficiaryId;

    private Long schemeId;

    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;

    private ApplicationStatus status;
}