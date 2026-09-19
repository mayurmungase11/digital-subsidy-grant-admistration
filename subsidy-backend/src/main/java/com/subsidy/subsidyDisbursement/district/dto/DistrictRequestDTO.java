package com.subsidy.subsidyDisbursement.district.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistrictRequestDTO {

    @NotBlank(message = "District name is mandatory")
    private String name;

    @NotNull(message = "State ID is mandatory")
    private Long stateId;
}