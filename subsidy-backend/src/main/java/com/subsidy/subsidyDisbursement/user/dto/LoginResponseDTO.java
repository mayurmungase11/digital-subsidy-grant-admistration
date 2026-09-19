package com.subsidy.subsidyDisbursement.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private Long userId;

    private String token;

    private String tokenType;

    private String email;

    private String role;
}