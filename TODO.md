# Restaurant Management System — TODO

> Full feature roadmap after initial codebase review
> Last updated: 2026-08-26

---

## Progress Summary

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Fix Existing Bugs | **COMPLETE** (5/5) |
| **Phase 2** | Menu Item CRUD | **COMPLETE** (6/6) |
| **Phase 3** | Ingredient CRUD | **COMPLETE** (6/6) |
| **Phase 4** | MenuItem ↔ Ingredient Association | **COMPLETE** (6/6) |
| **Phase 5** | Cart | **COMPLETE** (7/7) |
| **Phase 6** | Orders | **NOT STARTED** (0/7) |
| **Phase 7** | Payments | **NOT STARTED** (0/6) |
| **Phase 8** | Inventory Transactions | **NOT STARTED** (0/5) |
| **Phase 9** | User Admin Enhancements | **PARTIAL** (7/8) |
| **Phase 10** | Seed Data & Polish | **NOT STARTED** (0/8) |
| **Phase 11** | Architecture Improvements | **NOT STARTED** (0/20) |

**Overall Progress: 39/79 items complete (~49%)**

---

## Phase 1 — Fix Existing Bugs

- [x] **BUG-1: Add authMiddleware to DELETE /api/user/:id**
  - File: `src/routes/user.routes.ts:142`
  - `authorizeMiddleware` checks `req.user` but `authMiddleware` is not applied first
  - Add `authMiddleware.handle` before `authorizationMiddleware.handle`

- [x] **BUG-2: Fix GET /api/category returning 400 when empty**
  - File: `src/services/category.service.ts:10-11`
  - Currently throws `"No categories yet"` and returns 400
  - Change to return 200 with `[]` when no categories exist

- [x] **BUG-3: Fix POST /api/category passing string instead of object**
  - File: `src/controllers/category.controller.ts:25-26`
  - `createCategory(name)` passes a plain string, but service expects `CategoryCreateInput` (`{ name }`)
  - Fix: pass `{ name }` object

- [x] **BUG-4: Add ownership check to PATCH /api/user/:id**
  - File: `src/controllers/user.controller.ts:43-61`
  - Any authenticated user can update any user by specifying a different `:id`
  - Add check: `req.user.id === req.params.id` unless caller is ADMIN

- [x] **BUG-5: Fix Swagger enum — USER → CUSTOMER**
  - File: `src/config/swagger.ts`
  - Role enum lists `USER` but actual enum value is `CUSTOMER`

---

## Phase 2 — Menu Item CRUD

### 2a. Validation Schema

- [x] Create `src/validations/menuItem.validation.ts`
  - `createMenuItemSchema`: `{ categoryId (uuid, required), name (string, 1-255, stripHtml), price (number, >0), description (string, stripHtml), image (string, url, optional) }`
  - `updateMenuItemSchema`: all fields optional
  - `menuItemParamsSchema`: `{ id (uuid) }`
  - `menuFilterSchema`: `{ categoryId (uuid, optional) }` for query params

### 2b. Repository

- [x] Create `src/repositories/menuItem.repository.ts`
  - Extends `BaseRepository<MenuItem, MenuItemCreateInput, MenuItemUpdateInput>`
  - Add: `findByCategoryId(categoryId: string): Promise<MenuItem[]>`
  - Add: `findAllWithCategory(): Promise<MenuItem[]>` — includes `category` relation

### 2c. Service

- [x] Create `src/services/menuItem.service.ts`
  - `getAll(categoryId?: string)`: list all, optionally filtered by category
  - `getById(id)`: get single item with category
    - `create(data)`: create menu item (admin/staff only)
  - `update(id, data)`: update menu item (admin/staff only)
  - `delete(id)`: delete menu item (admin/staff only)

### 2d. Controller

- [x] Create `src/controllers/menuItem.controller.ts`
  - Standard CRUD controller following category.controller.ts pattern
  - All responses use generic error messages (log full error server-side)

### 2e. Routes

- [x] Create `src/routes/menuItem.routes.ts`
  - `GET /api/menu/` — public, supports `?categoryId=` query filter
  - `GET /api/menu/:id` — public
  - `POST /api/menu/` — auth required, ADMIN or STAFF
  - `PATCH /api/menu/:id` — auth required, ADMIN or STAFF
  - `DELETE /api/menu/:id` — auth required, ADMIN or STAFF

### 2f. Wire Up

- [x] Update `src/app.ts`
  - Create MenuItemRepository → MenuItemService → MenuItemController
  - Create `menuAuthorization = AuthorizationMiddleware([Role.ADMIN, Role.STAFF])`
  - Mount at `/api/menu`
  - Import and use validation schemas in routes

---

## Phase 3 — Ingredient CRUD

### 3a. Validation Schema

- [x] Create `src/validations/ingredient.validation.ts`
  - `createIngredientSchema`: `{ name (string, 1-255, stripHtml), unit (KG|G|L|ML|PIECE), quantity (int, >=0), minimumQuantity (int, >=0) }`
  - `updateIngredientSchema`: all fields optional
  - `ingredientParamsSchema`: `{ id (uuid) }`

### 3b. Repository

- [x] Create `src/repositories/ingredient.repository.ts`
  - Extends `BaseRepository<Ingredient, IngredientUncheckedCreateInput, IngredientUpdateInput>`
  - Add: `findByName(name: string): Promise<Ingredient | null>`
  - Add: `findLowStock(): Promise<Ingredient[]>` — ingredients where `quantity <= minimumQuantity`

### 3c. Service

- [x] Create `src/services/ingredient.service.ts`
  - `getAll()`: list all ingredients
  - `getById(id)`: get single ingredient
  - `getLowStock()`: list ingredients below minimum quantity
  - `create(data)`: create ingredient (admin/staff only)
  - `update(id, data)`: update ingredient (admin/staff only)
  - `delete(id)`: delete ingredient (admin only)

### 3d. Controller

- [x] Create `src/controllers/ingredient.controller.ts`
  - Standard CRUD controller following category.controller.ts pattern
  - All responses use generic error messages (log full error server-side)

### 3e. Routes

- [x] Create `src/routes/ingredient.routes.ts`
  - `GET /api/ingredients/` — auth required (STAFF+), list all
  - `GET /api/ingredients/low-stock` — auth required (STAFF+), low stock alerts
  - `GET /api/ingredients/:id` — auth required (STAFF+)
  - `POST /api/ingredients/` — auth required, ADMIN or STAFF
  - `PATCH /api/ingredients/:id` — auth required, ADMIN or STAFF
  - `DELETE /api/ingredients/:id` — auth required, ADMIN only

### 3f. Wire Up

- [x] Update `src/app.ts`
  - Create IngredientRepository → IngredientService → IngredientController
  - Create `ingredientAuthorization = AuthorizationMiddleware([Role.ADMIN, Role.STAFF])`
  - Mount at `/api/ingredients`
  - Import and use validation schemas in routes

---

## Phase 4 — MenuItem ↔ Ingredient Association

### 4a. Validation Schema

- [x] Create `src/validations/menuItemIngredient.validation.ts`
  - `createMenuItemIngredientSchema`: `{ menuItemId (uuid), ingredientId (uuid), quantityRequired (int, >0) }`
  - `updateMenuItemIngredientSchema`: `{ quantityRequired (int, >0) }`
  - `menuItemIngredientParamsSchema`: `{ id (uuid) }`
  - `menuItemIdParamsSchema`: `{ menuItemId (uuid) }`

### 4b. Repository

- [x] Create `src/repositories/menuItemIngredient.repository.ts`
  - Extends `BaseRepository<MenuItemIngredient, MenuItemIngredientUncheckedCreateInput, MenuItemIngredientUpdateInput>`
  - Add: `findByMenuItemId(menuItemId: string): Promise<MenuItemIngredient[]>`
  - Add: `findByIngredientId(ingredientId: string): Promise<MenuItemIngredient[]>`
  - Add: `findByMenuItemAndIngredient(menuItemId: string, ingredientId: string): Promise<MenuItemIngredient | null>`

### 4c. Service

- [x] Create `src/services/menuItemIngredient.service.ts`
  - `getAllByMenuItemId(menuItemId)`: list ingredients for a menu item
  - `getAllByIngredientId(ingredientId)`: list menu items using an ingredient
  - `getById(id)`: get single association
  - `create(data)`: assign ingredient to menu item (admin/staff only)
    - Validate both menuItemId and ingredientId exist
    - Check uniqueness (prevent duplicate associations)
  - `update(id, data)`: update quantity required (admin/staff only)
  - `delete(id)`: remove association (admin/staff only)

### 4d. Controller

- [x] Create `src/controllers/menuItemIngredient.controller.ts`
  - Standard CRUD controller following category.controller.ts pattern
  - All responses use generic error messages (log full error server-side)

### 4e. Routes

- [x] Create `src/routes/menuItemIngredient.routes.ts`
  - `GET /api/menu/:menuItemId/ingredients` — auth required (STAFF+)
  - `GET /api/menu/:menuItemId/ingredients/:id` — auth required (STAFF+)
  - `POST /api/menu/:menuItemId/ingredients` — auth required, ADMIN or STAFF
  - `PATCH /api/menu/:menuItemId/ingredients/:id` — auth required, ADMIN or STAFF
  - `DELETE /api/menu/:menuItemId/ingredients/:id` — auth required, ADMIN or STAFF

### 4f. Wire Up

- [x] Update `src/app.ts`
  - Create MenuItemIngredientRepository → MenuItemIngredientService → MenuItemIngredientController
  - Create `menuIngredientAuthorization = AuthorizationMiddleware([Role.ADMIN, Role.STAFF])`
  - Mount at `/api/menu/:menuItemId/ingredients`
  - Import and use validation schemas in routes

---

## Phase 5 — Cart

### 5a. Validation Schema

- [x] Create `src/validations/cart.validation.ts`
  - `addToCartSchema`: `{ menuItemId (uuid), quantity (int, >=1) }`
  - `updateCartItemSchema`: `{ quantity (int, >=1) }`
  - `cartItemParamsSchema`: `{ cartItemId (uuid) }`

### 5b. Repository

- [x] Create `src/repositories/cart.repository.ts`
  - Extends `BaseRepository<Cart, CartCreateInput, CartUpdateInput>`
  - Add: `findByUserId(userId): Promise<Cart | null>` — one cart per user
  - Add: `findCartWithItems(userId): Promise<Cart & { items: CartItem[] }>` — includes cart items with menu item details

### 5c. CartItem Repository

- [x] Create `src/repositories/cartItem.repository.ts`
  - Extends `BaseRepository<CartItem, ...>`
  - Add: `findByCartIdAndMenuItemId(cartId, menuItemId)`: find specific cart item
  - Add: `deleteByCartId(cartId)`: clear all items from cart

### 5d. Service

- [x] Create `src/services/cart.service.ts`
  - `getCart(userId)`: get or create user's cart with items
  - `addItem(userId, menuItemId, quantity)`: add item (or increment if exists)
  - `updateItemQuantity(cartItemId, quantity, userId)`: update quantity (ownership check)
  - `removeItem(cartItemId, userId)`: remove item from cart (ownership check)
  - `clearCart(userId)`: remove all items from cart

### 5e. Controller

- [x] Create `src/controllers/cart.controller.ts`
  - All cart operations are per-user (check `req.user.id`)

### 5f. Routes

- [x] Create `src/routes/cart.routes.ts`
  - `GET /api/cart/` — auth required (CUSTOMER+), get own cart
  - `POST /api/cart/items` — auth required (CUSTOMER+), add item
  - `PATCH /api/cart/items/:cartItemId` — auth required (CUSTOMER+), update quantity
  - `DELETE /api/cart/items/:cartItemId` — auth required (CUSTOMER+), remove item
  - `DELETE /api/cart/` — auth required (CUSTOMER+), clear cart

### 5g. Wire Up

- [x] Update `src/app.ts` — mount at `/api/cart` with auth middleware for all routes

---

## Phase 6 — Orders

### 6a. Validation Schema

- [ ] Create `src/validations/order.validation.ts`
  - `createOrderSchema`: `{ orderType (DINE_IN | TAKEAWAY | DELIVERY) }`
  - `updateOrderStatusSchema`: `{ status (PREPARING | READY | COMPLETED | CANCELLED) }`
  - `orderParamsSchema`: `{ id (uuid) }`
  - `orderFilterSchema`: `{ status (enum, optional) }` for query params

### 6b. Repository

- [ ] Create `src/repositories/order.repository.ts`
  - Extends `BaseRepository<Order, ...>`
  - Add: `findByUserId(userId)`: all orders for a user
  - Add: `findOrderWithItems(orderId)`: order + orderItems + menuItems
  - Add: `findAllWithUser()`: all orders with user info (admin view)

### 6c. OrderItem Repository

- [ ] Create `src/repositories/orderItem.repository.ts`
  - Extends `BaseRepository<OrderItem, ...>`
  - Add: `findByOrderId(orderId)`: all items in an order

### 6d. Service

- [ ] Create `src/services/order.service.ts`
  - `createOrder(userId, orderType)`: create order from cart
    - Snapshot menu item prices at time of order
    - Calculate `totalAmount` from cart items
    - Clear cart after order creation
    - Status defaults to `PENDING`
  - `getAllOrders(userId?, status?)`: admin sees all, customer sees own, optional status filter
  - `getOrderById(orderId, userId)`: get order with items, ownership check (admin sees any)
  - `updateOrderStatus(orderId, status)`: admin/staff only, validate status transitions
    - Allowed transitions: PENDING→PREPARING, PREPARING→READY, READY→COMPLETED, any→CANCELLED
  - `cancelOrder(orderId, userId)`: customer can cancel own PENDING order

### 6e. Controller

- [ ] Create `src/controllers/order.controller.ts`

### 6f. Routes

- [ ] Create `src/routes/order.routes.ts`
  - `POST /api/orders/` — auth required (CUSTOMER+), create order from cart
  - `GET /api/orders/` — auth required, ADMIN sees all, CUSTOMER sees own
  - `GET /api/orders/:id` — auth required, ownership check
  - `PATCH /api/orders/:id/status` — auth required, ADMIN or STAFF
  - `DELETE /api/orders/:id` — auth required (CUSTOMER+), cancel own PENDING order

### 6g. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/orders`

---

## Phase 7 — Payments

### 7a. Validation Schema

- [ ] Create `src/validations/payment.validation.ts`
  - `createPaymentSchema`: `{ orderId (uuid), method (CASH | CARD | WALLET), transactionReference (string) }`
  - `updatePaymentStatusSchema`: `{ status (PAID | FAILED | REFUNDED) }`

### 7b. Repository

- [ ] Create `src/repositories/payment.repository.ts`
  - Extends `BaseRepository<Payment, ...>`
  - Add: `findByOrderId(orderId)`: get payment for an order
  - Add: `findByTransactionReference(ref)`: lookup by reference

### 7c. Service

- [ ] Create `src/services/payment.service.ts`
  - `createPayment(orderId, method, transactionReference)`: create payment record
    - Validate order exists and has no existing payment
    - Set initial status to `PENDING`
  - `updatePaymentStatus(paymentId, status)`: admin only
    - If status = PAID, set `paidAt` timestamp
  - `getPaymentByOrder(orderId)`: get payment details for an order

### 7d. Controller

- [ ] Create `src/controllers/payment.controller.ts`

### 7e. Routes

- [ ] Create `src/routes/payment.routes.ts`
  - `POST /api/payments/` — auth required (CUSTOMER+), create payment for own order
  - `PATCH /api/payments/:id/status` — auth required, ADMIN only
  - `GET /api/payments/order/:orderId` — auth required, get payment for order

### 7f. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/payments`

---

## Phase 8 — Inventory Transactions

### 8a. Validation Schema

- [ ] Create `src/validations/inventoryTransaction.validation.ts`
  - `createTransactionSchema`: `{ ingredientId (uuid), type (IN|OUT|ADJUSTMENT), quantity (int, >0), reference (ORDER|MANUAL|RESTOCK), orderId? (uuid) }`
  - `transactionFilterSchema`: `{ ingredientId? (uuid), type? (enum) }`

### 8b. Repository

- [ ] Create `src/repositories/inventoryTransaction.repository.ts`
  - Extends `BaseRepository<InventoryTransaction, ...>`
  - Add: `findByIngredientId(ingredientId)`: transaction history for ingredient
  - Add: `findByOrderId(orderId)`: transactions linked to an order

### 8c. Service

- [ ] Create `src/services/inventoryTransaction.service.ts`
  - `createTransaction(data)`: record stock change
    - IN: increment ingredient quantity
    - OUT: decrement ingredient quantity (check sufficient stock)
    - ADJUSTMENT: set quantity to new value
  - `getByIngredient(ingredientId)`: transaction history
  - `getLowStockAlerts()`: ingredients needing restock

### 8d. Controller

- [ ] Create `src/controllers/inventoryTransaction.controller.ts`

### 8e. Routes

- [ ] Create `src/routes/inventoryTransaction.routes.ts`
  - `GET /api/inventory/` — auth required (STAFF+), list transactions (filterable)
  - `POST /api/inventory/` — auth required, ADMIN or STAFF
  - `GET /api/inventory/ingredient/:ingredientId` — auth required (STAFF+)

### 8f. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/inventory`

---

## Phase 9 — User Admin Enhancements

- [x] **GET /api/user/profile** — auth required, get own profile (ID from JWT)
- [x] **PATCH /api/user/profile** — auth required, update own profile (ID from JWT)
- [x] **DELETE /api/user/profile** — auth required, delete own account (ID from JWT)
- [x] **GET /api/user/:id** — admin only, get user by ID
- [x] **PATCH /api/user/:id** — admin only, update user by ID
- [x] **DELETE /api/user/:id** — admin only, delete user by ID
- [x] **GET /api/user/** — admin only, list all users
- [ ] Add pagination support to list endpoints (query params: `page`, `limit`)

---

## Phase 10 — Seed Data & Polish

- [ ] **Seed admin user**: email `admin@restaurant.com`, password `admin123`, role ADMIN
- [ ] **Seed sample menu items**: link existing categories to menu items with prices
- [ ] **Seed sample ingredients**: common restaurant ingredients (chicken, rice, vegetables, etc.)
- [ ] **Seed menu-item-ingredient associations**: link menu items to ingredients with quantities
- [ ] **Add pagination** to all list endpoints (categories, menu items, orders, users, ingredients)
- [ ] **Complete Swagger docs** for all new endpoints (MenuItem, Cart, Order, Payment, Ingredient, Inventory)
- [ ] **Add image upload** for menu items (store path in `image` field)
- [ ] **Add order total calculation** middleware/service helper

---

## Phase 11 — Architecture Improvements

### 11a. Error Handling

- [ ] **Create custom error classes** in `src/utils/errors.ts`
  - `AppError` (base class with statusCode, message, isOperational)
  - `NotFoundError` (404)
  - `ValidationError` (400)
  - `ConflictError` (409)
  - `UnauthorizedError` (401)
  - `ForbiddenError` (403)

- [ ] **Refactor global error handler** (`src/middlewares/errorHandler.ts`)
  - Detect custom error classes and set appropriate HTTP status codes
  - Handle non-Error throws (strings, objects)
  - Return structured error envelope: `{ message, errors?, statusCode }`
  - Hide stack traces in production mode

- [ ] **Remove try/catch from controllers**
  - Use `next(error)` to delegate to global handler
  - Remove redundant try/catch blocks in all controllers
  - Update services to throw custom error classes instead of generic `Error`

### 11b. Logging

- [ ] **Add structured logging** with `pino` or `winston`
  - Install logger package
  - Create `src/lib/logger.ts` with configurable log levels
  - Correlate logs with request ID (`req.id`)
  - Use different levels: error, warn, info, debug
  - Add request/response logging middleware

- [ ] **Replace console.error/console.log**
  - Update all controllers to use logger
  - Update server startup to use logger
  - Update error handler to use logger

### 11c. Code Quality

- [ ] **Add ESLint + Prettier**
  - Install `eslint`, `@typescript-eslint`, `prettier`
  - Create `.eslintrc.json` and `.prettierrc`
  - Add `lint` and `format` scripts to `package.json`
  - Fix existing linting issues

- [ ] **Move `@types/*` to devDependencies**
  - Move `@types/cors`, `@types/helmet`, `@types/morgan`, etc. to devDependencies in `package.json`

### 11d. Security Hardening

- [ ] **Configure CORS properly**
  - Add `ALLOWED_ORIGINS` to environment variables
  - Update `cors()` middleware to restrict origins
  - Update `.env.example` with new variable

- [ ] **Add environment mode handling**
  - Check `NODE_ENV` in config
  - Control error detail exposure (hide stack traces in production)
  - Disable Swagger UI in production
  - Add different behaviors for development vs production

### 11e. Infrastructure

- [ ] **Add database connection validation**
  - Validate `DATABASE_URL` exists before creating Prisma adapter
  - Ensure `validateEnv()` runs before any Prisma operations in `lib/prisma.ts`

- [ ] **Add graceful shutdown timeout**
  - Add `setTimeout(() => process.exit(1), 10000)` fallback in `server.ts`
  - Prevent hanging if `prisma.$disconnect()` takes too long

- [ ] **Add missing npm scripts**
  - Add `"db:migrate": "npx prisma migrate dev"` to package.json
  - Add `"db:migrate:prod": "npx prisma migrate deploy"` to package.json
  - Add `"db:generate": "npx prisma generate"` to package.json

### 11f. Testing

- [ ] **Add testing infrastructure**
  - Install Vitest (fast, ESM-native)
  - Create `vitest.config.ts`
  - Add `test` and `test:coverage` scripts to package.json

- [ ] **Add service unit tests**
  - Create test files for existing services (user, category, menuItem)
  - Mock repository dependencies
  - Test business logic, error handling, and edge cases

### 11g. Health Check

- [ ] **Improve health check endpoint**
  - Add database connectivity check (`prisma.$queryRaw`SELECT 1``)
  - Return detailed status: `{ status: "ok", database: "connected", uptime: ... }`
  - Return 503 if database is unreachable

### 11h. API Improvements

- [ ] **Add API versioning**
  - Use `/api/v1/...` prefix for all routes
  - Update route mounting in app.ts
  - Update Swagger configuration

- [ ] **Standardize error messages**
  - Use consistent format: "Resource not found" (capitalized)
  - Use consistent phrasing across all services
  - Create error message constants

---

## Dependency Graph

```
Phase 1 (Bug Fixes)
    ↓
Phase 2 (Menu Item CRUD)
    ↓
Phase 3 (Ingredient CRUD)
    ↓
Phase 4 (MenuItem ↔ Ingredient)
    ↓
Phase 5 (Cart)
    ↓
Phase 6 (Orders)
    ↓
Phase 7 (Payments)
    ↓
Phase 8 (Inventory Transactions)
    ↓
Phase 9 (User Admin)
    ↓
Phase 10 (Seed & Polish)
    ↓
Phase 11 (Architecture Improvements)
```

---

## Suggested Priority Order

1. **Phase 1** — Fix bugs (unblocks everything)
2. **Phase 2** — Menu Item CRUD (core feature, needed for cart/orders)
3. **Phase 3** — Ingredient CRUD (ingredients must exist before associations)
4. **Phase 4** — MenuItem ↔ Ingredient (links menu to ingredients)
5. **Phase 5** — Cart (depends on menu items)
6. **Phase 6** — Orders (depends on cart + inventory)
7. **Phase 7** — Payments (depends on orders)
8. **Phase 8** — Inventory Transactions (depends on ingredients + orders)
9. **Phase 9** — User Admin (independent, can be done anytime)
10. **Phase 10** — Polish (final pass)
11. **Phase 11** — Architecture Improvements (can be done in parallel with feature development)
