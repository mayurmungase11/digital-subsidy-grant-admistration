package com.subsidy.subsidyDisbursement.schemeDistrict.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDistrictRequestDTO {

    @NotNull(message = "Scheme id is mandatory")
    private Long schemeId;

    @NotNull(message = "District id is mandatory")
    private Long districtId;
}