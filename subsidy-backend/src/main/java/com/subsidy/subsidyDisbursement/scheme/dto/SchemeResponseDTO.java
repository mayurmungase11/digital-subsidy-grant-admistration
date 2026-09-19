package com.subsidy.subsidyDisbursement.scheme.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchemeResponseDTO {

    private Long id;
    private String code;
    private String name;
    private Double maximumAmount;
    private Boolean active;
}