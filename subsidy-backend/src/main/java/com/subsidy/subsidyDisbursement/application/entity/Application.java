package com.subsidy.subsidyDisbursement.application.entity;

import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;
import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "beneficiary_id", nullable = false)
    @NotNull(message = "Beneficiary is mandatory")
    private Beneficiary beneficiary;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheme_id", nullable = false)
    @NotNull(message = "Scheme is mandatory")
    private Scheme scheme;

    @Column(nullable = false)
    @NotNull(message = "Requested amount is mandatory")
    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;
}