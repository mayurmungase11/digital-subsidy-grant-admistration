package com.subsidy.subsidyDisbursement.user.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.subsidy.subsidyDisbursement.user.entity.Role;
import com.subsidy.subsidyDisbursement.user.entity.User;
import com.subsidy.subsidyDisbursement.user.repository.RoleRepository;
import com.subsidy.subsidyDisbursement.user.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initializeSystem(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // =========================
            // 1. CREATE REQUIRED ROLES
            // =========================

            createRoleIfNotExists(
                    roleRepository,
                    "ADMIN"
            );

            createRoleIfNotExists(
                    roleRepository,
                    "FIELD_OFFICER"
            );

            createRoleIfNotExists(
                    roleRepository,
                    "DISTRICT_OFFICER"
            );

            createRoleIfNotExists(
                    roleRepository,
                    "FINANCE_OFFICER"
            );


            // =========================
            // 2. CREATE INITIAL ADMIN
            // =========================

            if (!userRepository.existsByEmail(adminEmail)) {

                Role adminRole = roleRepository
                        .findByName("ADMIN")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "ADMIN role could not be created"
                                )
                        );

                User admin = new User();

                admin.setName(adminName);
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode(adminPassword)
                );

                admin.setRole(adminRole);

                userRepository.save(admin);

                System.out.println(
                        "Initial ADMIN created successfully."
                );

            } else {

                System.out.println(
                        "Initial ADMIN already exists."
                );
            }
        };
    }


    // =========================
    // CREATE ROLE IF NOT EXISTS
    // =========================

    private void createRoleIfNotExists(
            RoleRepository roleRepository,
            String roleName) {

        if (roleRepository.findByName(roleName).isEmpty()) {

            Role role = new Role();

            role.setName(roleName);

            roleRepository.save(role);

            System.out.println(
                    "Role created: " + roleName
            );
        }
    }
}