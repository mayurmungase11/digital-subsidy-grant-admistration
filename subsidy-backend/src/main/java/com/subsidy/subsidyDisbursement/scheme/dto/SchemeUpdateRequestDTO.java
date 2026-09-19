package com.subsidy.subsidyDisbursement.scheme.dto;

import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeUpdateRequestDTO {

    private String code;

    private String name;

    @Positive(message = "Maximum amount must be greater than zero")
    private Double maximumAmount;

    private Boolean active;
}