# Digital Subsidy & Grant Administration Platform

This bundle contains the existing Spring Boot backend and React frontend for the Digital Subsidy & Grant Administration Platform.

## Structure

- `subsidy-backend/` — existing Spring Boot API, security, workflow and business logic.
- `subsidy-frontend-phase15/` — React/Vite frontend, redesigned while preserving the existing API contracts and role-based routes.

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
