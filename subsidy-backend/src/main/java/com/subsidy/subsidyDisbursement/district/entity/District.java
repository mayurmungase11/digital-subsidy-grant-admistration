package com.subsidy.subsidyDisbursement.district.entity;

import com.subsidy.subsidyDisbursement.state.entity.State;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "districts",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "state_id"})
    }
)
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "District name is mandatory")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "state_id", nullable = false)
    @NotNull(message = "State is mandatory")
    private State state;
}