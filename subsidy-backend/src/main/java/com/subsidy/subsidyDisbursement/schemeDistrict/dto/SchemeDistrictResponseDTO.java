package com.subsidy.subsidyDisbursement.schemeDistrict.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDistrictResponseDTO {

    private Long id;

    private Long schemeId;

    private Long districtId;
}