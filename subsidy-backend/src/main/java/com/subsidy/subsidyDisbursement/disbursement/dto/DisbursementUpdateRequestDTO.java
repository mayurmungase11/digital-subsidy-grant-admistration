package com.subsidy.subsidyDisbursement.disbursement.dto;

import com.subsidy.subsidyDisbursement.disbursement.entity.DisbursementStatus;

import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementUpdateRequestDTO {

    private Long applicationId;

    @Positive(message = "Installment number must be greater than zero")
    private Integer installmentNumber;

    @Positive(message = "Disbursement amount must be greater than zero")
    private Double amount;

    private DisbursementStatus status;

    private String transactionReference;

    private String remarks;
}