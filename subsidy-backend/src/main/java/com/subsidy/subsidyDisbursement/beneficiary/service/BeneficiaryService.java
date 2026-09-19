package com.subsidy.subsidyDisbursement.beneficiary.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryRequestDTO;
import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryResponseDTO;
import com.subsidy.subsidyDisbursement.beneficiary.dto.BeneficiaryUpdateDTO;
import com.subsidy.subsidyDisbursement.beneficiary.entity.Beneficiary;
import com.subsidy.subsidyDisbursement.beneficiary.repository.BeneficiaryRepository;
import com.subsidy.subsidyDisbursement.exception.DuplicateResourceException;
import com.subsidy.subsidyDisbursement.exception.ResourceNotFoundException;
import com.subsidy.subsidyDisbursement.user.entity.Role;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.RoleRepository;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository brepo;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public BeneficiaryService(
            BeneficiaryRepository repo,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.brepo = repo;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE
    @Transactional
    public BeneficiaryResponseDTO createBeneficiary(BeneficiaryRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "User already exists with email: " + request.getEmail());
        }

        if (brepo.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Beneficiary already exists with email: " + request.getEmail());
        }

        Role beneficiaryRole = roleRepository.findByName("BENEFICIARY")
                .orElseThrow(() -> new ResourceNotFoundException("BENEFICIARY role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(beneficiaryRole);
        User savedUser = userRepository.save(user);

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

        Beneficiary savedBeneficiary = brepo.save(beneficiary);

        return mapToResponse(savedBeneficiary);
    }

    // BENEFICIARY SELF-PROFILE
    public BeneficiaryResponseDTO getMyProfile(String email) {

        Beneficiary beneficiary = brepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Beneficiary profile not found for email: " + email));

        return mapToResponse(beneficiary);
    }

    @Transactional
    public BeneficiaryResponseDTO updateMyProfile(BeneficiaryUpdateDTO request, String currentEmail) {

        Beneficiary beneficiary = brepo.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Beneficiary profile not found for email: " + currentEmail));

        User user = beneficiary.getUser();
        if (user == null) {
            user = userRepository.findByEmail(currentEmail)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User account not found for email: " + currentEmail));
            beneficiary.setUser(user);
        }

        if (request.getName() != null) {
            beneficiary.setName(request.getName());
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().equals(beneficiary.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException(
                        "User already exists with email: " + request.getEmail());
            }
            if (brepo.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException(
                        "Beneficiary already exists with email: " + request.getEmail());
            }
            beneficiary.setEmail(request.getEmail());
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) beneficiary.setPhone(request.getPhone());
        if (request.getAge() != null) beneficiary.setAge(request.getAge());
        if (request.getAnnualIncome() != null) beneficiary.setAnnualIncome(request.getAnnualIncome());
        if (request.getAddress() != null) beneficiary.setAddress(request.getAddress());
        if (request.getIdentityNumber() != null) beneficiary.setIdentityNumber(request.getIdentityNumber());
        if (request.getBankAccountNumber() != null) beneficiary.setBankAccountNumber(request.getBankAccountNumber());
        if (request.getIfscCode() != null) beneficiary.setIfscCode(request.getIfscCode());

        userRepository.save(user);
        return mapToResponse(brepo.save(beneficiary));
    }

    // GET BY ID
    public BeneficiaryResponseDTO getBenefiaciaryById(Long id) {

        Beneficiary beneficiary = brepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));

        return mapToResponse(beneficiary);
    }

    // GET ALL
    public List<BeneficiaryResponseDTO> getAllBeneficiary() {
        return brepo.findAll().stream().map(this::mapToResponse).toList();
    }

    // UPDATE
    public BeneficiaryResponseDTO updateBeneficiary(BeneficiaryUpdateDTO request, Long id) {

        Beneficiary beneficiary = brepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));

        if (request.getName() != null) {
            beneficiary.setName(request.getName());
            if (beneficiary.getUser() != null) {
                beneficiary.getUser().setName(request.getName());
            }
        }

        if (request.getEmail() != null && !request.getEmail().equals(beneficiary.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException(
                        "User already exists with email: " + request.getEmail());
            }
            if (brepo.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException(
                        "Beneficiary already exists with email: " + request.getEmail());
            }
            beneficiary.setEmail(request.getEmail());
            if (beneficiary.getUser() != null) {
                beneficiary.getUser().setEmail(request.getEmail());
            }
        }
        if (request.getPhone() != null) beneficiary.setPhone(request.getPhone());
        if (request.getAge() != null) beneficiary.setAge(request.getAge());
        if (request.getAnnualIncome() != null) beneficiary.setAnnualIncome(request.getAnnualIncome());
        if (request.getAddress() != null) beneficiary.setAddress(request.getAddress());
        if (request.getIdentityNumber() != null) beneficiary.setIdentityNumber(request.getIdentityNumber());
        if (request.getBankAccountNumber() != null) beneficiary.setBankAccountNumber(request.getBankAccountNumber());
        if (request.getIfscCode() != null) beneficiary.setIfscCode(request.getIfscCode());

        Beneficiary updatedBeneficiary = brepo.save(beneficiary);
        return mapToResponse(updatedBeneficiary);
    }

    // DELETE
    public void deleteBeneficiaryById(Long id) {
        Beneficiary beneficiary = brepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
        brepo.delete(beneficiary);
    }

    // ENTITY → RESPONSE DTO
    private BeneficiaryResponseDTO mapToResponse(Beneficiary beneficiary) {
        BeneficiaryResponseDTO response = new BeneficiaryResponseDTO();
        response.setId(beneficiary.getId());
        response.setName(beneficiary.getName());
        response.setEmail(beneficiary.getEmail());
        response.setPhone(beneficiary.getPhone());
        response.setAge(beneficiary.getAge());
        response.setAnnualIncome(beneficiary.getAnnualIncome());
        response.setAddress(beneficiary.getAddress());
        response.setIdentityNumber(beneficiary.getIdentityNumber());
        response.setBankAccountNumber(beneficiary.getBankAccountNumber());
        response.setIfscCode(beneficiary.getIfscCode());
        return response;
    }
}
