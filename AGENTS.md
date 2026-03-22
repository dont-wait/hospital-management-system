# AGENTS.md — Hospital Management System

This file provides guidance for agentic coding agents operating in this repository.

---

## Repository Structure

```
hospital-management-system/
├── client/          # Next.js 16 (App Router) frontend — TypeScript, Tailwind, MUI
└── server/          # ASP.NET Core 8 backend — C#, Clean Architecture
    ├── Domain/          # Entities, Enums, BaseEntity (no external deps)
    ├── Application/     # Interfaces, DTOs, Services, ServiceResult<T>
    ├── Infrastructure/  # EF Core, Repositories, Redis, JWT, Email, Hangfire
    ├── WebApi/          # Controllers, Middleware, Program.cs
    └── HospitalManagement.Tests2/  # xUnit tests
```

There is no root-level `package.json`. Each sub-project is independently managed.

---

## Build, Lint & Test Commands

### Server (.NET 8 / C#)

Run from the `server/` directory unless noted.

```bash
# Restore dependencies
dotnet restore

# Build
dotnet build --configuration Release

# Run dev server (from server/WebApi/)
dotnet run --project WebApi/WebApi.csproj

# Run all tests
dotnet test

# Run a single test project
dotnet test HospitalManagement.Tests2/HospitalManagement.Tests2.csproj

# Run a single test by method name
dotnet test --filter "DisplayName~<TestMethodName>"

# Run a single test by fully qualified name
dotnet test --filter "FullyQualifiedName~HospitalManagement.Tests2.UnitTest1.Test1"

# Publish
dotnet publish WebApi/WebApi.csproj --configuration Release --output ./publish
```

### Client (Next.js / TypeScript)

Run from the `client/` directory. Package manager is **Yarn 4**.

```bash
yarn install         # Install dependencies
yarn dev             # Start dev server
yarn build           # Production build
yarn start           # Start production server
yarn lint            # Run ESLint (next lint)
yarn analyze         # Bundle analysis (ANALYZE=true next build)
```

Vitest is configured (`vitest.config.mts`) but no test scripts are in `package.json`. Run tests manually with:
```bash
npx vitest            # Run tests in watch mode
npx vitest run        # Run tests once
```

---

## Server Code Style (C#)

### Formatting
- 4-space indentation; Allman brace style for classes and methods.
- File-scoped namespaces: `namespace WebApi.Controllers;`
- Implicit `using` directives are enabled — avoid redundant `using` statements.
- Nullable reference types are **enabled** across all projects; use `= null!` and `= string.Empty` for required non-nullable fields.

### Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Classes / Records | PascalCase | `AuthService`, `AppDbContext` |
| Interfaces | `I` prefix + PascalCase | `IAuthService`, `IUserAccountRepository` |
| Methods | PascalCase | `GetPatientById`, `CreateAppointmentAsync` |
| Private fields | `_camelCase` | `_context`, `_userAccountRepository` |
| Properties | PascalCase | `CitizenID`, `AppointmentStatus` |
| DTOs | `Request`/`Response` prefix + `DTO` | `RequestLoginDTO`, `ResponsePatientDTO` |
| Enums (type) | PascalCase | `AppointmentStatus`, `RoleEnum` |
| DB table names | `snake_case` | `user_accounts`, `medical_visits` |

### Architecture Rules
- Follow the existing **Clean Architecture** layering; do not reference `Infrastructure` or `WebApi` from `Domain`.
- Every service method must return `ServiceResult<T>` — never throw exceptions across service boundaries.
- Every new entity must extend `BaseEntity` (provides `CreatedAt`, `UpdatedAt`, soft-delete fields).
- Soft-delete only: set `DeletedAt` / `DeletedId` rather than removing rows.
- Register new services and repositories manually in `WebApi/DependencyInjection.cs` or `Program.cs` with `AddScoped<IFoo, Foo>()`.

### Error Handling (Server)
- Services return `ServiceResult<T>.Success(data)` or `ServiceResult<T>.Fail("message")`.
- Controllers wrap all logic in `try/catch`, check `result.IsSuccess`, and return `new JsonResult(new ApiResponse<T>(...)) { StatusCode = ... }`.
- Use `ILogger<T>` for all logging — do not use `Console.WriteLine` in new code.

---

## Client Code Style (TypeScript / React)

### Formatting
- 2-space indentation; double quotes.
- Trailing commas in multi-line structures.
- Use `function` keyword for named component exports and context providers; arrow functions for inline helpers.
- Path alias `@/*` maps to `src/*` — always use it instead of relative `../` imports.

### Naming Conventions
| Element | Convention | Example |
|---|---|---|
| Components | PascalCase `.tsx` | `Button.tsx`, `UserAuthContext.tsx` |
| Service files | kebab-case `.service.ts` | `auth.service.ts`, `medical-visit.service.ts` |
| Utility files | kebab-case `-utils.ts` | `auth-utils.ts`, `date-utils.ts` |
| Hooks | `useCamelCase` | `useForgotPassword`, `useUserAuthContext` |
| Interfaces (shapes) | PascalCase, no `I` prefix | `Patient`, `Employee`, `BookingData` |
| Type aliases / unions | PascalCase | `Roles`, `Priority`, `ModalType` |
| Zod schemas | `camelCase` + `Schema` | `patientSchema`, `accountSchema` |
| Inferred DTO types | PascalCase + `Dto` | `LoginAccountDto`, `RegisterPatientDto` |
| `as const` arrays | PascalCase | `RolesList`, `WORK_SHIFTS` |

### TypeScript
- `strict: true` is enabled — no `any`; use generics and proper types.
- Prefer `interface` for object shapes; use `type` for unions, aliases, and `z.infer<>`.
- Infer form types from Zod schemas via `z.infer<typeof schema>` — do not duplicate type declarations.
- Use `Omit<>`, `Pick<>`, and intersection types from `src/types/index.ts` rather than redefining shapes.

### Imports
- Always use the `@/` alias: `import { api } from "@/axios"`.
- Group imports: external libraries first, then internal `@/` imports.
- No default exports from service or utility files — use named exports.

### State & Data Fetching
- Global state uses **React Context** (no Redux/Zustand) — add new contexts in `src/contexts/`.
- API calls are **static async methods** on service classes in `src/services/`.
- Use the `api` axios instance (with toast interceptor) for client-side calls; use `apiSSR` for server-side / SSR calls.
- The axios interceptors in `src/axios/index.ts` centrally handle `400`, `401`, and `500` — do not duplicate toast/error logic in service methods.

### Error Handling (Client)
- Service methods do not catch errors — let the axios interceptor handle HTTP-level errors.
- Context providers and React event handlers use `try/catch` with `console.error` as fallback.
- Toast notifications come exclusively from the axios interceptor; do not call `toast.error()` directly for HTTP failures.

### Component Patterns
- Use `class-variance-authority` (CVA) for component variants (see `Button.tsx`).
- Use Radix UI primitives for headless elements (Checkbox, Select, Label, etc.).
- Shared/reusable primitives go in `src/components/shared/`.
- Feature components are grouped by user role: `admin/`, `employee/`, `patient/`.

---

## Database & Infrastructure Notes

- **ORM**: Entity Framework Core 9 — Code-First with migrations in `Infrastructure/Migrations/`.
- **Provider switching**: `appsettings.json` key `"DatabaseProvider"` accepts `"SqlServer"` or `"Oracle"`.
- **Caching**: Redis (StackExchange.Redis) for OTP tokens and slot scheduling.
- **Background jobs**: Hangfire with SQL Server storage.
- **Seed data**: JSON files in `Infrastructure/Persistence/SeedData/` loaded by `DataSeeder` on startup.
- Do not hard-delete rows — always soft-delete via `BaseEntity` fields.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `server/Application/Common/Utils/ServiceResult.cs` | `ServiceResult<T>` success/fail wrapper |
| `server/Application/Common/Utils/ApiResponse.cs` | HTTP response envelope |
| `server/Infrastructure/Persistence/AppDbContext.cs` | EF Core DbContext |
| `server/WebApi/Program.cs` | App startup, DI registration |
| `server/WebApi/Middleware/CookieToHeaderMiddleware.cs` | Cookie → Bearer token conversion |
| `client/src/axios/index.ts` | Axios instances + interceptors |
| `client/src/types/index.ts` | All shared TypeScript types |
| `client/src/schemas/` | Zod validation schemas |
| `client/src/services/` | Static API service classes |
| `client/src/contexts/` | React Context providers |
