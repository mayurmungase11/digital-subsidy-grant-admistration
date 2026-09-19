package com.subsidy.subsidyDisbursement.beneficiary.entity;

import com.subsidy.subsidyDisbursement.user.entity.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Phone number is mandatory")
    @Pattern(
    	    regexp = "^[6-9][0-9]{9}$",
    	    message = "Phone number should be a valid 10 digit Indian mobile number"
    	)
    private String phone;

    @Column(nullable = false)
    @NotNull 
    @Positive(message = "Age must be a positive number")
    private Integer age;

    @Column(nullable = false)
    @NotNull(message = "Annual income is mandatory")
    @PositiveOrZero
    private Double annualIncome;

    @Column(nullable = false)
    @NotBlank(message = "Address is mandatory")
    private String address;

    @Column(nullable = false)
    @NotBlank(message = "GOV. Identity number is mandatory(ADHAR/PAN/Voter ID/Passport)")
    private String identityNumber;

    @Column(nullable = false)
    @NotBlank(message = "Bank account number is mandatory")
    private String bankAccountNumber;

    @Column(nullable = false)
    @NotBlank(message = "IFSC code is mandatory")
    private String ifscCode;
}