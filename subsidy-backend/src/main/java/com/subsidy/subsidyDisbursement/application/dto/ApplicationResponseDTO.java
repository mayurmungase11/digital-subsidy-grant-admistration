package com.subsidy.subsidyDisbursement.application.dto;

import com.subsidy.subsidyDisbursement.application.entity.ApplicationStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {

    private Long id;

    private Long beneficiaryId;

    private Long schemeId;

    private Double requestedAmount;

    private ApplicationStatus status;
}