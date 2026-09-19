import axiosClient from './axiosClient';

// POST /api/auth/register/beneficiary
// Public endpoint. Request DTO: BeneficiaryRegistrationRequestDTO
// Backend creates a User account, assigns BENEFICIARY role, hashes the
// password, and creates the Beneficiary profile in one flow.
export function registerBeneficiary({
  name,
  email,
  password,
  phone,
  age,
  annualIncome,
  address,
  identityNumber,
  bankAccountNumber,
  ifscCode,
}) {
  return axiosClient.post('/api/auth/register/beneficiary', {
    name,
    email,
    password,
    phone,
    age,
    annualIncome,
    address,
    identityNumber,
    bankAccountNumber,
    ifscCode,
  });
}

// POST /api/auth/login
// Public endpoint. Request DTO: LoginRequestDTO { email, password }
// Response DTO: LoginResponseDTO { token, tokenType, email, role }
export function login({ email, password }) {
  return axiosClient.post('/api/auth/login', { email, password });
}
