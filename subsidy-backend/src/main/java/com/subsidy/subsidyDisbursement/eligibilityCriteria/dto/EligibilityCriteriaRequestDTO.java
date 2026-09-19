package com.subsidy.subsidyDisbursement.eligibilityCriteria.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCriteriaRequestDTO {

    @NotNull(message = "Scheme ID is mandatory")
    private Long schemeId;

    @NotNull(message = "Field is mandatory")
    private String field;

    @NotNull(message = "Operator is mandatory")
    private String operator;

    @NotNull(message = "Expected value is mandatory")
    private String expectedValue;

    @NotNull(message = "Mandatory field is required")
    private Boolean mandatory;

    @NotNull(message = "Score is mandatory")
    @PositiveOrZero(message = "Score cannot be negative")
    private Integer score;
}