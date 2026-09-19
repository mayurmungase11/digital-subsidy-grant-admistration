package com.subsidy.subsidyDisbursement.approval.dto;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.approval.entity.ApprovalStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalResponseDTO {

    private Long id;

    private Long applicationId;

    private Long approvedById;

    private ApprovalStatus status;

    private Double approvedAmount;

    private LocalDateTime decisionDate;

    private String remarks;
}