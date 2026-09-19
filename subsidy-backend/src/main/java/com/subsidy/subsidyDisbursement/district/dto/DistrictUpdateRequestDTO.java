package com.subsidy.subsidyDisbursement.district.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistrictUpdateRequestDTO {

    private String name;

    private Long stateId;
}