package com.subsidy.subsidyDisbursement.eligibilityCriteria.entity;

import com.subsidy.subsidyDisbursement.scheme.entity.Scheme;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eligibility_criteria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(nullable = false)
    private String field;

    @Column(nullable = false)
    private String operator;

    @Column(nullable = false)
    private String expectedValue;

    @Column(nullable = false)
    private Boolean mandatory;
    
    @Column(nullable = false)
    private Integer score;
}