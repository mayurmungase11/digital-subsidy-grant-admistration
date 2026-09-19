package com.subsidy.subsidyDisbursement.approval.dto;

import com.subsidy.subsidyDisbursement.approval.entity.ApprovalStatus;

import jakarta.validation.constraints.PositiveOrZero;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalUpdateRequestDTO {

    private Long applicationId;

    private Long approvedById;

    private ApprovalStatus status;

    @PositiveOrZero(
        message = "Approved amount must be greater than or equal to zero"
    )
    private Double approvedAmount;

    private String remarks;
}