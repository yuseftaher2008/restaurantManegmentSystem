# Code Review - Issues to Fix

> Generated from full codebase review on 2026-08-21
> 39 issues total: 5 Critical, 9 High, 13 Medium, 12 Low

---

## CRITICAL

- [ ] **C-1: Add JWT authentication middleware**
  - File: `src/middlewares/` (new file)
  - Create `auth.middleware.ts` that verifies JWT token from `Authorization: Bearer <token>` header
  - Attach decoded user (`id`, `email`, `role`) to `req.user`
  - Apply to all protected routes (everything except login/register)

- [ ] **C-2: Add role-based authorization middleware**
  - File: `src/middlewares/` (new file)
  - Create `authorize.middleware.ts` that accepts allowed roles as parameter
  - Example: `authorize(Role.ADMIN, Role.STAFF)`
  - Apply to category rouDMINtes (A/STAFF only) and user delete (ADMIN only)

- [ ] **C-3: Require re-authentication for password change**
  - File: `src/controllers/user.controller.ts:39-55`
  - Add `currentPassword` field to `updateUserSchema` when `password` is provided
  - Verify `currentPassword` against stored hash before allowing update

- [ ] **C-4: Audit git history for `.env` leaks**
  - Run `git log --all --full-history -- .env` to check if `.env` was ever committed
  - If yes: rotate `JWT_SECRET` and database password immediately
  - Ensure `.env` is in `.gitignore` (already confirmed)

- [ ] **C-5: Verify `generated/prisma` exists**
  - Run `npx prisma generate` to ensure Prisma client types are generated
  - Verify `src/services/category.service.ts:2-3` imports resolve correctly

---

## HIGH

- [ ] **H-1: Add CORS middleware**
  - File: `src/app.ts`
  - Install: `npm install cors @types/cors`
  - Configure with appropriate origins for frontend

- [ ] **H-2: Add global error handling middleware**
  - File: `src/middlewares/` (new file)
  - Create `errorHandler.middleware.ts` with Express error middleware signature `(err, req, res, next)`
  - Catch unhandled errors, log them, return generic 500 response
  - Register in `src/app.ts` after all routes

- [ ] **H-3: Add rate limiting**
  - File: `src/app.ts`
  - Install: `npm install express-rate-limit`
  - Apply stricter limit on login/register (e.g., 5 req/15min)
  - Apply general limit on all routes (e.g., 100 req/15min)

- [ ] **H-4: Add `helmet` security headers**
  - File: `src/app.ts`
  - Install: `npm install helmet @types/helmet`
  - Add `app.use(helmet())` before other middleware

- [ ] **H-5: Hash password on update**
  - File: `src/services/user.service.ts:59-67`
  - `userUpdate()` passes plaintext password to repository
  - Add: `if (data.password) { data.password = await bcrypt.hash(data.password, saltRounds); }`

- [ ] **H-6: Fix BaseRepository `update` type**
  - File: `src/repositories/base.repository.ts:32`
  - Change `data: any` to `data: Prisma.InputJsonValue` or make it generic
  - Prevents mass-assignment of unexpected fields

- [ ] **H-7: Type controller request data**
  - File: `src/controllers/category.controller.ts:27`
  - Change `const data = req.body` to use typed validated data
  - Import and use `UpdateCategoryInput` type

- [ ] **H-8: Fix HTTP methods for REST conventions**
  - File: `src/routes/user.routes.ts:11`
    - Change `POST /update/:id` to `PATCH /:id`
  - File: `src/routes/category.routes.ts`
    - Change `POST /update/:id` to `PATCH /:id`
    - Change `POST /create` to `POST /` (POST implies creation)

- [ ] **H-9: Validate UUID param on user update**
  - File: `src/routes/user.routes.ts:11`
  - Add `validate(uuidParamsSchema, "params")` to the update route
  - Currently only validates body, not the `:id` param

---

## MEDIUM

- [ ] **M-1: Add logging infrastructure**
  - Install: `npm install morgan @types/morgan` (or `pino`)
  - Add request logging middleware in `src/app.ts`
  - Log errors in controllers (not just returning to client)

- [ ] **M-2: Add graceful shutdown handling**
  - File: `src/server.ts`
  - Listen for `SIGTERM` and `SIGINT` signals
  - Call `prisma.$disconnect()` before process exit
  - Close server gracefully

- [ ] **M-3: Move bcrypt config to env.ts**
  - File: `src/services/user.service.ts:16`
  - `Number(process.env.BCRYPT_SALT_ROUNDS)` is read at runtime inside service
  - Read once in `src/config/env.ts` and export as config constant

- [ ] **M-4: Add null check for JWT_SECRET**
  - File: `src/services/user.service.ts:44`
  - Replace `process.env.JWT_SECRET as string` with validated config value
  - Use value from `env.ts` validator instead of raw `process.env`

- [ ] **M-5: Normalize email before validation**
  - File: `src/validations/user.validation.ts`
  - Add `.toLowerCase()` transform to email fields in `registerSchema` and `loginSchema`
  - Prevents duplicate accounts with different casing

- [ ] **M-6: Handle race condition on category creation**
  - File: `src/services/category.service.ts:8-15`
  - Use Prisma `upsert` or wrap in a transaction
  - Or catch Prisma unique constraint error and return friendly message

- [ ] **M-7: Don't return deleted object**
  - File: `src/controllers/category.controller.ts:45-48`
  - Change to return `204 No Content` like `deleteUser` does
  - Remove `deletedCategory` from response body

- [ ] **M-8: Move `validateEnv()` to server.ts**
  - File: `src/app.ts:13`
  - Currently runs at import time (side effect)
  - Move to `src/server.ts` before `app.listen()`

- [ ] **M-9: Use `import type` for CategoryService**
  - File: `src/controllers/category.controller.ts:2`
  - Change `import { CategoryService }` to `import type { CategoryService }`

- [ ] **M-10: Remove BaseRepository `create` override in subclasses**
  - File: `src/repositories/user.repository.ts:12-16`, `category.repository.ts:12-16`
  - Use base class `create()` method instead of overriding
  - Or make base `create()` non-abstract and pass prisma model

- [ ] **M-11: Sanitize error messages before sending to client**
  - Files: All controllers
  - Don't pass raw `error.message` to response
  - Log full error server-side, return generic message to client

- [ ] **M-12: Add request ID tracking**
  - Install: `npm install uuid @types/uuid` (or use `crypto.randomUUID`)
  - Add middleware that assigns unique ID to each request
  - Include in logs and error responses for traceability

- [ ] **M-13: Disconnect Prisma on process exit**
  - File: `lib/prisma.ts`
  - Export `prisma.$disconnect()` function
  - Call it in graceful shutdown handler (see M-2)

---

## LOW

- [ ] **L-1: Fix typos in error messages**
  - `src/controllers/user.controller.ts:51`: `massege` → `message`
  - `src/controllers/user.controller.ts:67`: `faield` → `failed`
  - `src/controllers/category.controller.ts:36`: `faield` → `failed`
  - `src/controllers/category.controller.ts:54`: `failde` → `failed`

- [ ] **L-2: Standardize naming conventions**
  - Service methods: use consistent pattern (e.g., all `create`/`update`/`delete` or all prefixed)
  - Route variables: `route` vs `router` — pick one
  - Route paths: decide on `/create` vs bare `/` pattern

- [ ] **L-3: Add `dotenv` import to app.ts**
  - File: `src/app.ts`
  - Add `import "dotenv/config"` at top to ensure env vars are loaded

- [ ] **L-4: Add missing npm scripts**
  - File: `package.json`
  - Add `"start": "node dist/server.js"`
  - Add `"build": "tsc"`
  - Add `"prisma:generate": "prisma generate"`

- [ ] **L-5: Fix `main` field in package.json**
  - File: `package.json:5`
  - Change `"main": "index.js"` to `"main": "src/server.ts"` or remove it

- [ ] **L-6: Add input sanitization for XSS**
  - Install: `npm install sanitizer` or use Zod `.transform()` to strip HTML tags
  - Apply to user names and category names

- [ ] **L-7: Add health check endpoint**
  - File: `src/app.ts`
  - Add `GET /health` that returns `200 OK` with `{ status: "ok" }`
  - Useful for load balancers and monitoring

- [ ] **L-8: Fix inconsistent route patterns**
  - User routes: `/register`, `/login`, `/update/:id`, `/:id`
  - Category routes: `/create`, `/update/:id`, `/delete/:id`
  - Align to same pattern (e.g., all use `/:id` for resources)

- [ ] **L-9: Fix category delete controller param**
  - File: `src/controllers/category.controller.ts:44`
  - Already fixed to `req.params.id` but verify service accepts `id` not `name`

- [ ] **L-10: Add API documentation**
  - Install: `npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express`
  - Add OpenAPI/Swagger spec for all endpoints

- [ ] **L-11: Verify dotenv version**
  - File: `package.json:27`
  - `dotenv: ^17.4.2` may not exist, verify and update to latest stable

- [ ] **L-12: Add `.env.example`**
  - Create `.env.example` with placeholder values
  - Document all required environment variables
  - Helps new developers set up the project

---

## Suggested Priority Order

1. **Security first** (C-1, C-2, C-3, H-1, H-3, H-4)
2. **Data integrity** (H-5, H-6, C-5)
3. **Code quality** (H-7, H-8, H-9, M-9)
4. **Infrastructure** (H-2, M-1, M-2, M-13)
5. **Polish** (L-1 through L-12)

