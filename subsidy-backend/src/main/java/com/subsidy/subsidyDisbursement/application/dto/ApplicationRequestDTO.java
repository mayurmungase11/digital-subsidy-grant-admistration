package com.subsidy.subsidyDisbursement.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequestDTO {

    @NotNull(message = "Beneficiary ID is mandatory")
    private Long beneficiaryId;

    @NotNull(message = "Scheme ID is mandatory")
    private Long schemeId;

    @NotNull(message = "Requested amount is mandatory")
    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;
}