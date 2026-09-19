package com.subsidy.subsidyDisbursement.state.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StateRequestDTO {

    @NotBlank(message = "State name is mandatory")
    private String name;
}
