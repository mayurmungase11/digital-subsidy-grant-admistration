# Digital Subsidy & Grant Administration Platform

This bundle contains the existing Spring Boot backend and React frontend for the Digital Subsidy & Grant Administration Platform.

## Structure

- `subsidy-backend/` — existing Spring Boot API, security, workflow and business logic.
- `subsidy-frontend-phase15/` — React/Vite frontend, redesigned while preserving the existing API contracts and role-based routes.

## Frontend redesign

The redesign focuses on a production-grade government/enterprise experience:

- restrained government-appropriate visual system
- role-aware navigation groups
- sidebar-only logout fixed at the sidebar base
- responsive authenticated shell
- public citizen landing page before sign-in
- role-based operational dashboards using existing backend records
- beneficiary dashboard using live schemes and personal applications
- workflow pipeline and financial summaries where the current role has access to the relevant APIs
- improved tables, forms, status badges, empty states, loading states and alerts
- project identity updated in UI to `Digital Subsidy & Grant Administration Platform`

No new backend endpoints or business rules were introduced for the redesign.

## Run frontend

From `subsidy-frontend-phase15/`:

```bash
npm install
npm run dev
```

The frontend uses `http://localhost:8080` by default. Set `VITE_API_BASE_URL` if the backend runs elsewhere.

## Run backend

From `subsidy-backend/`:

```bash
./mvnw spring-boot:run
```

On Windows:

```bat
mvnw.cmd spring-boot:run
```
