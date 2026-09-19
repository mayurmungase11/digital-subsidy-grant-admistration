package com.subsidy.subsidyDisbursement.beneficiary.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryRequestDTO {

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Phone number should be a valid 10 digit Indian mobile number"
    )
    private String phone;

    @NotNull(message = "Age is mandatory")
    @Min(value = 18, message = "Beneficiary must be at least 18 years old")
    private Integer age;

    @NotNull(message = "Annual income is mandatory")
    @PositiveOrZero(message = "Annual income cannot be negative")
    private Double annualIncome;

    @NotBlank(message = "Address is mandatory")
    private String address;

    @NotBlank(message = "GOV. Identity number is mandatory")
    private String identityNumber;

    @NotBlank(message = "Bank account number is mandatory")
    private String bankAccountNumber;

    @NotBlank(message = "IFSC code is mandatory")
    @Pattern(
        regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
        message = "Invalid IFSC code"
    )
    private String ifscCode;
}