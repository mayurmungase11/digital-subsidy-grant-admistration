package com.subsidy.subsidyDisbursement.user.security;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secretKey;

	// Token validity: 1 hour
	private final long jwtExpiration = 60 * 60 * 1000;

	// Generate JWT
	public String generateToken(UserDetails userDetails) {

		return Jwts.builder().subject(userDetails.getUsername())
				.claim("role", userDetails.getAuthorities().iterator().next().getAuthority()).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + jwtExpiration)).signWith(getSigningKey()).compact();
	}

	// Extract username/email
	public String extractUsername(String token) {

		return extractAllClaims(token).getSubject();
	}

	// Validate token
	public boolean isTokenValid(String token, UserDetails userDetails) {

		final String username = extractUsername(token);

		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	// Check expiration
	private boolean isTokenExpired(String token) {

		return extractAllClaims(token).getExpiration().before(new Date());
	}

	// Extract claims
	private Claims extractAllClaims(String token) {

		return Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(token).getPayload();
	}

	// Generate signing key
	private Key getSigningKey() {

		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}
}