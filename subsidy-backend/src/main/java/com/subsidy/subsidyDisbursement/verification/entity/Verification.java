package com.subsidy.subsidyDisbursement.verification.entity;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.application.entity.Application;
import com.subsidy.subsidyDisbursement.user.entity.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import lombok.*;

@Entity
@Table(name = "verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Verification {

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
        name = "verified_by",
        nullable = false
    )
    @NotNull(message = "Verifier is mandatory")
    private User verifiedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Verification status is mandatory")
    private VerificationStatus status;

    @Column(nullable = false)
    private LocalDateTime verifiedAt;

    private String remarks;
}