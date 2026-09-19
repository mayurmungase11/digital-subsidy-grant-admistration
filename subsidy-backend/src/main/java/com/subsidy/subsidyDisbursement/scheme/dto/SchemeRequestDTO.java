package com.subsidy.subsidyDisbursement.scheme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeRequestDTO {

    @NotBlank(message = "Scheme code is mandatory")
    private String code;

    @NotBlank(message = "Scheme name is mandatory")
    private String name;

    @NotNull(message = "Maximum amount is mandatory")
    @Positive(message = "Maximum amount must be greater than zero")
    private Double maximumAmount;

    @NotNull(message = "Active status is mandatory")
    private Boolean active;
}