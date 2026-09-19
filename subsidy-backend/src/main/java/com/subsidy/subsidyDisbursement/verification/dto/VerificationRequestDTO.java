package com.subsidy.subsidyDisbursement.verification.dto;

import com.subsidy.subsidyDisbursement.verification.entity.VerificationStatus;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationRequestDTO {

    @NotNull(message = "Application ID is mandatory")
    private Long applicationId;

    @NotNull(message = "Verified By user ID is mandatory")
    private Long verifiedById;

    @NotNull(message = "Verification status is mandatory")
    private VerificationStatus status;

    private String remarks;
}