package com.subsidy.subsidyDisbursement.beneficiary.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private Double annualIncome;
    private String address;
    private String identityNumber;
    private String bankAccountNumber;
    private String ifscCode;
}