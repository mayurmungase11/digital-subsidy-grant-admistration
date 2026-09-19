package com.subsidy.subsidyDisbursement.verification.dto;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.verification.entity.VerificationStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponseDTO {

    private Long id;

    private Long applicationId;

    private Long verifiedById;

    private VerificationStatus status;

    private LocalDateTime verifiedAt;

    private String remarks;
}