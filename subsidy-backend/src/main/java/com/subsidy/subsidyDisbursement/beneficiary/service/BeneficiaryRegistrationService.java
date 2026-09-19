package com.subsidy.subsidyDisbursement.beneficiary.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryRegistrationRequestDTO;
import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;
import com.subsidy.subsidyDisbursement.beneficiary.repository.BeneficiaryRepository;
import com.subsidy.subsidyDisbursement.exception.DuplicateResourceException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.user.entity.Role;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.RoleRepository;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

@Service
public class BeneficiaryRegistrationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final PasswordEncoder passwordEncoder;

    public BeneficiaryRegistrationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            BeneficiaryRepository beneficiaryRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerBeneficiary(
            BeneficiaryRegistrationRequestDTO request) {

        // Check duplicate email in User table
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException(
                    "User already exists with email: "
                            + request.getEmail());
        }

        // Check duplicate email in Beneficiary table
        if (beneficiaryRepository.existsByEmail(request.getEmail())) {

            throw new DuplicateResourceException(
                    "Beneficiary already exists with email: "
                            + request.getEmail());
        }

        // Find BENEFICIARY role
        Role beneficiaryRole = roleRepository.findByName("BENEFICIARY")
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BENEFICIARY role not found"));

        // Create User account
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Store encrypted password
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        user.setRole(beneficiaryRole);

        User savedUser = userRepository.save(user);

        // Create Beneficiary profile
        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setUser(savedUser);
        beneficiary.setName(request.getName());
        beneficiary.setEmail(request.getEmail());
        beneficiary.setPhone(request.getPhone());
        beneficiary.setAge(request.getAge());
        beneficiary.setAnnualIncome(request.getAnnualIncome());
        beneficiary.setAddress(request.getAddress());
        beneficiary.setIdentityNumber(request.getIdentityNumber());
        beneficiary.setBankAccountNumber(request.getBankAccountNumber());
        beneficiary.setIfscCode(request.getIfscCode());

        beneficiaryRepository.save(beneficiary);
    }
}