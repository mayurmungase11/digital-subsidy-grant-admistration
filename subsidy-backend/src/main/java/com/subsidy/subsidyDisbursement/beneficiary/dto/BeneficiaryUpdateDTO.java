package com.subsidy.subsidyDisbursement.beneficiary.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryUpdateDTO {

    private String name;

    @Email(message = "Email should be valid")
    private String email;

    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Phone number should be a valid 10 digit Indian mobile number"
    )
    private String phone;

    @Min(value = 18, message = "Beneficiary must be at least 18 years old")
    private Integer age;

    @PositiveOrZero(message = "Annual income cannot be negative")
    private Double annualIncome;

    private String address;

    private String identityNumber;

    private String bankAccountNumber;

    @Pattern(
        regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
        message = "Invalid IFSC code"
    )
    private String ifscCode;
}