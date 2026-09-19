package com.subsidy.subsidyDisbursement.approval.entity;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.user.entity.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Table(name = "approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "application_id",
        nullable = false,
        unique = true
    )
    @NotNull(message = "Application is mandatory")
    private Application application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "approved_by",
        nullable = false
    )
    @NotNull(message = "Approver is mandatory")
    private User approvedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Approval status is mandatory")
    private ApprovalStatus status;

    @Column(nullable = false)
    @NotNull(message = "Approved amount is mandatory")
    @PositiveOrZero(message = "Approved amount must be greater than zero")
    private Double approvedAmount;

    @Column(nullable = false)
    private LocalDateTime decisionDate;

    private String remarks;
}