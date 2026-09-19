package com.subsidy.subsidyDisbursement.disbursement.dto;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.disbursement.entity.DisbursementStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementResponseDTO {

    private Long id;

    private Long applicationId;

    private Integer installmentNumber;

    private Double amount;

    private LocalDateTime disbursementDate;

    private DisbursementStatus status;

    private String transactionReference;

    private String remarks;
}