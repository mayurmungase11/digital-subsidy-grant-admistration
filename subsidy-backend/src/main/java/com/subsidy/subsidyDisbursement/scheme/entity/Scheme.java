package com.subsidy.subsidyDisbursement.scheme.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Scheme code is mandatory")
    private String code;

    @Column(nullable = false)
    @NotBlank(message = "Scheme name is mandatory")
    private String name;

    @Column(nullable = false)
    @NotNull(message = "Maximum amount is mandatory")
    @Positive(message = "Maximum amount must be greater than zero")
    private Double maximumAmount;

    @Column(nullable = false)
    @NotNull(message = "Active status is mandatory")
    private Boolean active;
}