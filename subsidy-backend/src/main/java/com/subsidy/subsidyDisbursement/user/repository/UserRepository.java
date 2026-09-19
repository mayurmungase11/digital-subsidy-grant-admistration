package com.subsidy.subsidyDisbursement.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User>findByEmail(String email);
	
	boolean existsByEmail(String email);
}
