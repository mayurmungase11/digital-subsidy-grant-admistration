

## Phase 13 — Beneficiary Self Profile
Added authenticated beneficiary profile endpoints:
- GET `/api/beneficiaries/my` — returns the logged-in beneficiary profile.
- PUT `/api/beneficiaries/my` — updates the logged-in beneficiary profile without allowing password changes.
The endpoints derive identity from the authenticated JWT email and are restricted to `BENEFICIARY`. Beneficiary registration now also links the User account to the Beneficiary profile so profile updates keep both records synchronized.
