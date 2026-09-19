package com.subsidy.subsidyDisbursement.state.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.subsidy.subsidyDisbursement.state.entity.State;

public interface StateRepository extends JpaRepository<State, Long> {

}
