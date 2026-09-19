package com.subsidy.subsidyDisbursement.disbursement.entity;

import java.time.LocalDateTime;

import com.subsidy.subsidyDisbursement.application.entity.Application;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Entity
@Table(name = "disbursements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Disbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    @NotNull(message = "Application is mandatory")
    private Application application;

    @Column(nullable = false)
    @NotNull(message = "Installment number is mandatory")
    @Positive(message = "Installment number must be greater than zero")
    private Integer installmentNumber;

    @Column(nullable = false)
    @NotNull(message = "Disbursement amount is mandatory")
    @Positive(message = "Disbursement amount must be greater than zero")
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime disbursementDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Disbursement status is mandatory")
    private DisbursementStatus status;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Transaction reference is mandatory")
    private String transactionReference;

    private String remarks;
}