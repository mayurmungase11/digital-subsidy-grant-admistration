package com.subsidy.subsidyDisbursement.approval.dto;

import com.subsidy.subsidyDisbursement.approval.entity.ApprovalStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequestDTO {

    @NotNull(message = "Application ID is mandatory")
    private Long applicationId;

    @NotNull(message = "Approver ID is mandatory")
    private Long approvedById;

    @NotNull(message = "Approval status is mandatory")
    private ApprovalStatus status;

    @NotNull(message = "Approved amount is mandatory")
    @PositiveOrZero(message = "Approved amount must be greater than or equal to zero")
    private Double approvedAmount;

    private String remarks;
}