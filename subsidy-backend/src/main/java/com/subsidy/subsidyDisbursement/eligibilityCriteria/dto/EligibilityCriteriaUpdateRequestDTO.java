package com.subsidy.subsidyDisbursement.eligibilityCriteria.dto;

import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCriteriaUpdateRequestDTO {

    private Long schemeId;

    private String field;

    private String operator;

    private String expectedValue;

    private Boolean mandatory;

    @PositiveOrZero(message = "Score cannot be negative")
    private Integer score;
}