package com.subsidy.subsidyDisbursement.eligibilityCriteria.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCriteriaResponseDTO {

    private Long id;

    private Long schemeId;

    private String field;

    private String operator;

    private String expectedValue;

    private Boolean mandatory;

    private Integer score;
}