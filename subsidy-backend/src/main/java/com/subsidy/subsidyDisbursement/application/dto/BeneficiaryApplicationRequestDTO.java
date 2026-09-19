package com.subsidy.subsidyDisbursement.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryApplicationRequestDTO {

    @NotNull(message = "Scheme ID is mandatory")
    private Long schemeId;

    @NotNull(message = "Requested amount is mandatory")
    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;
}