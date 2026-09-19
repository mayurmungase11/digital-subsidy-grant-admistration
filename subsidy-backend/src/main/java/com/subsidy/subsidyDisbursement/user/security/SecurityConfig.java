package com.subsidy.subsidyDisbursement.user.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;


import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    
 // In your SecurityConfig class

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
        
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC
                // =========================
                .requestMatchers("/api/auth/**").permitAll()


                // =========================
                // ADMIN ONLY
                // =========================
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/roles/**").hasRole("ADMIN")
                .requestMatchers("/api/eligibility-criteria/**").hasRole("ADMIN")


                // =========================
                // SCHEMES
                // =========================
                .requestMatchers(HttpMethod.GET, "/api/schemes/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER",
                        "FINANCE_OFFICER",
                        "BENEFICIARY"
                    )

                .requestMatchers("/api/schemes/**")
                    .hasRole("ADMIN")


                // =========================
                // DISTRICTS
                // =========================
                .requestMatchers(HttpMethod.GET, "/api/districts/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER",
                        "FINANCE_OFFICER"
                    )

                .requestMatchers("/api/districts/**")
                    .hasRole("ADMIN")


                // =========================
                // STATES
                // =========================
                .requestMatchers(HttpMethod.GET, "/api/states/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER",
                        "FINANCE_OFFICER"
                    )

                .requestMatchers("/api/states/**")
                    .hasRole("ADMIN")


                // =========================
                // SCHEME-DISTRICT
                // =========================
                .requestMatchers(HttpMethod.GET, "/api/schemeDistricts/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER",
                        "FINANCE_OFFICER"
                    )

                .requestMatchers("/api/schemeDistricts/**")
                    .hasRole("ADMIN")


                // =========================
                // BENEFICIARIES
                // =========================
                // Authenticated beneficiary can access only their own profile.
                .requestMatchers("/api/beneficiaries/my/**")
                    .hasRole("BENEFICIARY")

                // Staff/admin retain the existing beneficiary management APIs.
                .requestMatchers("/api/beneficiaries/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER"
                    )


                 // =========================
                 // APPLICATIONS
                 // =========================

                 // Beneficiary can create and view own applications
                 .requestMatchers("/api/applications/my/**")
                     .hasRole("BENEFICIARY")

                 // Existing staff/admin application access
                 .requestMatchers("/api/applications/**")
                     .hasAnyRole(
                         "ADMIN",
                         "FIELD_OFFICER",
                         "DISTRICT_OFFICER",
                         "FINANCE_OFFICER"
                     )


                // =========================
                // VERIFICATIONS
                // =========================
                .requestMatchers("/api/verifications/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER"
                    )


                // =========================
                // ELIGIBILITY
                // =========================
                .requestMatchers("/api/eligibility/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FIELD_OFFICER",
                        "DISTRICT_OFFICER"
                    )


                // =========================
                // APPROVALS
                // =========================
                // Finance officers need read-only approval access because
                // disbursement creation must verify the approved amount.
                .requestMatchers(HttpMethod.GET, "/api/approvals/**")
                    .hasAnyRole(
                        "ADMIN",
                        "DISTRICT_OFFICER",
                        "FINANCE_OFFICER"
                    )
                .requestMatchers("/api/approvals/**")
                    .hasAnyRole(
                        "ADMIN",
                        "DISTRICT_OFFICER"
                    )


                // =========================
                // DISBURSEMENTS
                // =========================
                .requestMatchers("/api/disbursements/**")
                    .hasAnyRole(
                        "ADMIN",
                        "FINANCE_OFFICER"
                    )


                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest().authenticated()
            )

            // =========================
            // 401 UNAUTHORIZED
            // =========================
            .exceptionHandling(exception -> exception

            	    // 401 - User is NOT authenticated
            	    .authenticationEntryPoint(
            	        (request, response, authException) -> {

            	            response.sendError(
            	                HttpServletResponse.SC_UNAUTHORIZED,
            	                "Unauthorized"
            	            );
            	        }
            	    )

            	    // 403 - User IS authenticated but has insufficient role
            	    .accessDeniedHandler(
            	        (request, response, accessDeniedException) -> {

            	            response.sendError(
            	                HttpServletResponse.SC_FORBIDDEN,
            	                "Forbidden"
            	            );
            	        }
            	    )
            	)

            // =========================
            // JWT FILTER
            // =========================
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}