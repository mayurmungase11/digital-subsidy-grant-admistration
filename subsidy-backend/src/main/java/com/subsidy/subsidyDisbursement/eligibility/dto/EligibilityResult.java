package com.subsidy.subsidyDisbursement.eligibility.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EligibilityResult {

    private boolean eligible;

    private int score;

    private int threshold;

    private String message;
}