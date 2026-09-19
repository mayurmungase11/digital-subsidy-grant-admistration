package com.subsidy.subsidyDisbursement.user.dto;

import jakarta.validation.constraints.Email;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDTO {

    private String name;

    @Email(message = "Email should be valid")
    private String email;

    private String password;

    private Long roleId;
}