package com.subsidy.subsidyDisbursement.district.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistrictResponseDTO {

    private Long id;
    private String name;
    private Long stateId;
    private String stateName;
}