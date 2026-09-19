package com.subsidy.subsidyDisbursement.disbursement.dto;

import com.subsidy.subsidyDisbursement.disbursement.entity.DisbursementStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementRequestDTO {

    @NotNull(message = "Application ID is mandatory")
    private Long applicationId;

    @NotNull(message = "Installment number is mandatory")
    @Positive(message = "Installment number must be greater than zero")
    private Integer installmentNumber;

    @NotNull(message = "Disbursement amount is mandatory")
    @Positive(message = "Disbursement amount must be greater than zero")
    private Double amount;

    @NotNull(message = "Disbursement status is mandatory")
    private DisbursementStatus status;

    @NotBlank(message = "Transaction reference is mandatory")
    private String transactionReference;

    private String remarks;
}