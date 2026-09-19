# Subsidy Disbursement System — React Frontend

React + Vite frontend for the Government Subsidy/Grant Disbursement Tracking System.
The frontend is being built module-by-module against the confirmed Spring Boot backend contract.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your Spring Boot backend
npm run dev
```

## Current implementation

- Authentication: beneficiary registration, login, JWT storage and logout
- Role-aware routing for ADMIN, BENEFICIARY, FIELD_OFFICER, DISTRICT_OFFICER and FINANCE_OFFICER
- Shared authenticated application shell: sidebar, header, role/email display and logout
- Protected frontend routes with backend Spring Security remaining authoritative
- Scheme Management:
  - View all schemes for every authenticated role allowed by the backend
  - ADMIN: create, update and delete schemes
  - Client-side form validation matching the confirmed Scheme DTO constraints
  - Loading, success and API error states
  - Search by scheme code or name

## Source structure

```text
src/
  api/
    axiosClient.js
    authApi.js
    schemeApi.js
  components/
    layout/
      AppLayout.jsx
    schemes/
      SchemeForm.jsx
      SchemeTable.jsx
  config/
    navigation.js
  context/
    AuthContext.jsx
  pages/
    auth/
      Login.jsx
      Register.jsx
    schemes/
      SchemeManagement.jsx
    Dashboard.jsx
    StatusPages.jsx
  routes/
    ProtectedRoute.jsx
  utils/
    tokenStorage.js
  App.jsx
  main.jsx
  index.css
```

## Important design decisions

- JWT is stored in localStorage for the current MVP. A production financial system would normally use an httpOnly cookie-based approach, which requires corresponding backend/CSRF changes.
- The frontend normalizes Spring Security login roles such as `ROLE_BENEFICIARY` to `BENEFICIARY` at the authentication boundary. This keeps role checks consistent across routing and UI.
- `ProtectedRoute` is a frontend UX guard only. Actual authorization is enforced by Spring Security on the backend.
- HTTP 401 clears authentication and redirects to login through the shared Axios interceptor. HTTP 403 is handled by the calling page/component.
- No fake business statistics are generated. Business data displayed by the module comes from the backend API.
- Scheme fields and endpoints are based on the confirmed backend DTOs/controller; frontend code should not introduce fields that do not exist in the backend contract.

## Scheme API contract used by the frontend

```text
GET    /api/schemes
GET    /api/schemes/{id}
POST   /api/schemes
PUT    /api/schemes/{id}
DELETE /api/schemes/{id}
```

Create request fields:

```text
code
name
maximumAmount
active
```

Update request fields:

```text
code
name
maximumAmount
active
```

Response fields:

```text
id
code
name
maximumAmount
active
```

Authorization for the Scheme module is determined by the backend:

```text
All authenticated project roles: GET
ADMIN: POST, PUT, DELETE
```

## Development strategy

Complete one business phase at a time. Implement the phase, run it against the real backend, verify it locally, fix any issues found during verification, and only then move to the next phase. Final visual polish is intentionally deferred until the business workflow is complete.

## Phase 5 — Application & Eligibility Workflow

Implemented against the actual Spring Boot backend contracts:

- Beneficiary: `GET /api/applications/my`, `POST /api/applications/my`
- Staff/Admin: `GET /api/applications`, `POST /api/applications`
- Shared application detail/update/delete API helpers are available for later workflow phases.
- Eligibility evaluation: `POST /api/eligibility/application/{id}/evaluate` with no request body.
- Scheme data is loaded from `GET /api/schemes` and used only to identify/select schemes in the application UI.
- Beneficiary identity is never entered in the beneficiary form; the backend resolves it from the authenticated JWT.
- Applications start as `SUBMITTED` because the backend does not authorize beneficiaries to call the eligibility endpoint.
- Admin, Field Officer, and District Officer can trigger backend eligibility evaluation for `SUBMITTED` applications. The backend changes the status to `UNDER_VERIFICATION` when eligible or `REJECTED` when not eligible.
- Verification is intentionally not implemented in this phase; the backend itself only allows verification when the application is `UNDER_VERIFICATION`, so that dependency is reserved for the Verification phase.
- Finance Officer can view the application queue but is not shown eligibility actions because the backend does not authorize `/api/eligibility/**` for that role.
- Scheme-District is not coupled to Application in the current backend entity/DTO model: `ApplicationRequestDTO` and `BeneficiaryApplicationRequestDTO` contain only scheme/beneficiary/requested amount, so no frontend-only district field was invented.

## Phase 6 — Verification Management

Verification management is implemented against the existing backend contract:

- `GET /api/verifications`
- `GET /api/verifications/{id}`
- `POST /api/verifications`
- `PUT /api/verifications/{id}`
- `DELETE /api/verifications/{id}` (API helper exists; delete is intentionally not exposed in the workflow UI because the backend delete operation does not restore the related application status)

The verification UI is available to `ADMIN`, `FIELD_OFFICER`, and `DISTRICT_OFFICER` and loads applications to identify records currently in `UNDER_VERIFICATION`.

### Required backend compatibility fix

`VerificationRequestDTO` requires `verifiedById`, but the original login response exposed only token, token type, email, and role. Phase 6 therefore adds `userId` to `LoginResponseDTO` and populates it from the authenticated `User`. The React auth context stores this value and sends it as `verifiedById` when creating a verification. This does not remove or rename any existing login response fields.

## Phase 7 — Approval Workflow

Implemented approval workflow against the existing backend contract:
- Approval API: `/api/approvals/**`
- ADMIN and DISTRICT_OFFICER only
- Pending queue derives from applications with `VERIFIED` status and no existing approval
- `approvedById` is taken from authenticated `userId`
- Exact approval statuses: `APPROVED`, `REJECTED`
- Approved amount is validated client-side as zero or greater, matching backend validation
- Existing approval status can be updated; application status is refreshed from backend afterward
- Approval delete is intentionally not exposed because backend deletion does not roll back application status

Build note: local Vite build could not be executed because `node_modules`/Vite is not installed in the working environment. Source delimiter sanity checks passed.


## Phase 9 — Beneficiary Management

Added the beneficiary management workflow against the existing backend contract:

- `GET /api/beneficiaries`
- `GET /api/beneficiaries/{id}`
- `POST /api/beneficiaries`
- `PUT /api/beneficiaries/{id}`
- `DELETE /api/beneficiaries/{id}`

Beneficiary management UI is available to `ADMIN`, `FIELD_OFFICER`, and `DISTRICT_OFFICER`, matching the project authorization matrix. The beneficiary registration page remains on `POST /api/auth/register/beneficiary` and was not replaced by this phase.

Sensitive identity and bank-account values are masked in the beneficiary table.

## Phase 9 — Beneficiary + Admin User Management

### Beneficiary Management
- Admin, Field Officer, and District Officer can manage beneficiary profiles according to backend authorization.
- Uses the exact `/api/beneficiaries` CRUD endpoints and beneficiary DTO fields.

### Admin User / Officer Management
- Only `ADMIN` has access to User Management, matching the backend `/api/users/**` authorization.
- Admin can create staff accounts for `FIELD_OFFICER`, `DISTRICT_OFFICER`, and `FINANCE_OFFICER`.
- Officer accounts use the exact backend `UserRequestDTO`: `name`, `email`, `password`, `roleId`.
- Admin can view users, edit user details, optionally reset a password, change the assigned officer role, and delete accounts.
- The UI resolves role IDs through `GET /api/roles` rather than hard-coding database role IDs.
- The frontend does not expose public staff registration and does not allow selecting `ADMIN` as a staff role.
- Passwords are never displayed in the user table; password hashing remains a backend responsibility.

### User API Endpoints
- `POST /api/users`
- `GET /api/users/{id}`
- `GET /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Role API Used by User Management
- `GET /api/roles`

### Important
The backend remains the source of truth for authorization and business rules. React only provides role-aware UX and exact API integration.

## Phase 10 — Master Data: States, Districts & Scheme Coverage

Phase 10 adds a role-aware master-data workspace using the existing backend contracts only.

### State API
- GET `/api/states`
- GET `/api/states/{stateId}`
- POST `/api/states`
- DELETE `/api/states/{stateId}`
- State update is **not** exposed because the current backend controller does not provide a PUT endpoint, even though `StateUpdateRequestDTO` exists.

State request: `{ name }`
State response: `{ id, name }`

### District API
- GET `/api/districts`
- GET `/api/districts/{id}`
- POST `/api/districts`
- PUT `/api/districts/{id}`
- DELETE `/api/districts/{id}`

District request/update payload: `{ name, stateId }`
District response: `{ id, name, stateId, stateName }`

### Scheme-District API
- GET `/api/schemeDistricts`
- GET `/api/schemeDistricts/{id}`
- POST `/api/schemeDistricts`
- PUT `/api/schemeDistricts/{id}`
- DELETE `/api/schemeDistricts/{id}`

Scheme-district request/update payload: `{ schemeId, districtId }`
Scheme-district response: `{ id, schemeId, districtId }`

### UI / authorization behavior
- ADMIN: create/update/delete master data.
- FIELD_OFFICER, DISTRICT_OFFICER, FINANCE_OFFICER: read-only master-data view, matching the backend GET permissions.
- BENEFICIARY: no master-data navigation or route, matching the backend authorization rules.
- Scheme and district names are resolved in the UI from their existing GET APIs; no extra backend fields are invented.
- Duplicate state names and duplicate scheme-district mappings are surfaced through backend 409 responses.

## Phase 11 — Role Management

Added an Admin-only Role Management workspace using the exact backend `/api/roles` CRUD contract:
- POST `/api/roles`
- GET `/api/roles/{id}`
- GET `/api/roles`
- PUT `/api/roles/{id}`
- DELETE `/api/roles/{id}`

Role records use only `id` and `name`. The UI includes security warnings because the backend Spring Security configuration references the built-in role names. Creating a custom role does not automatically grant authorization.


## Phase 12 — Workflow & Dashboard Enhancement

### Included changes
- Beneficiaries can click **Apply** directly from the Schemes page. The application page opens with the selected scheme pre-populated.
- The beneficiary application form continues to use the exact backend endpoint `POST /api/applications/my` and request fields `schemeId` and `requestedAmount`.
- Staff beneficiary creation now includes an initial `password` in `BeneficiaryRequestDTO`; the backend creates a linked BENEFICIARY user account and stores the password using the existing BCrypt `PasswordEncoder`.
- Beneficiary edit continues to use `BeneficiaryUpdateDTO`, which has no password field; the frontend does not expose password editing.
- Staff-created beneficiary name/email changes are synchronized to the linked user account when applicable.
- Dashboard now displays role-specific counts using existing authorized APIs and backend-defined application statuses. No new dashboard API was invented.

### Backend contract change
`POST /api/beneficiaries` now accepts the existing beneficiary profile fields plus:
```json
{
  "password": "InitialPassword@123"
}
```
The password is never returned in `BeneficiaryResponseDTO`.

### Security note
Beneficiary management remains restricted by the existing Spring Security rule to `ADMIN`, `FIELD_OFFICER`, and `DISTRICT_OFFICER`. Beneficiary authentication remains through the existing `/api/auth/**` flow.


## Phase 13 — Beneficiary Citizen Dashboard
- Government-service inspired beneficiary dashboard with clear green/amber/red status cues.
- Fixed authenticated header and responsive citizen-service footer.
- Recent applications are placed near the bottom of the dashboard.
- Header profile opens `/beneficiary/profile`.
- Beneficiary self-profile GET/PUT uses `/api/beneficiaries/my`; no password field is exposed.
- Email changes require re-login so the JWT subject remains consistent.
