# Restaurant Management System — TODO

> Full feature roadmap after initial codebase review
> Last updated: 2026-08-24

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

- [ ] Create `src/controllers/menuItem.controller.ts`
  - Standard CRUD controller following category.controller.ts pattern
  - All responses use generic error messages (log full error server-side)

### 2e. Routes

- [ ] Create `src/routes/menuItem.routes.ts`
  - `GET /api/menu/` — public, supports `?categoryId=` query filter
  - `GET /api/menu/:id` — public
  - `POST /api/menu/` — auth required, ADMIN or STAFF
  - `PATCH /api/menu/:id` — auth required, ADMIN or STAFF
  - `DELETE /api/menu/:id` — auth required, ADMIN or STAFF

### 2f. Wire Up

- [ ] Update `src/app.ts`
  - Create MenuItemRepository → MenuItemService → MenuItemController
  - Create `menuAuthorization = AuthorizationMiddleware([Role.ADMIN, Role.STAFF])`
  - Mount at `/api/menu`
  - Import and use validation schemas in routes

---

## Phase 3 — MenuItem ↔ Ingredient Association

### 3a. Validation Schema

- [ ] Create `src/validations/menuItemIngredient.validation.ts`
  - `createMenuItemIngredientSchema`: `{ menuItemId (uuid), ingredientId (uuid), quantityRequired (int, >0) }`
  - `updateMenuItemIngredientSchema`: `{ quantityRequired (int, >0) }`

### 3b. Repository

- [ ] Create `src/repositories/menuItemIngredient.repository.ts`
  - Extends `BaseRepository<MenuItemIngredient, ...>`
  - Add: `findByMenuItemId(menuItemId)`: all ingredients for a menu item
  - Add: `findByIngredientId(ingredientId)`: all menu items using this ingredient
  - Add: `findUnique(menuItemId, ingredientId)`: find specific association

### 3c. Service

- [ ] Create `src/services/menuItemIngredient.service.ts`
  - `getByMenuItem(menuItemId)`: list ingredients for a menu item
  - `getByIngredient(ingredientId)`: list menu items using an ingredient
  - `assign(menuItemId, ingredientId, quantityRequired)`: link ingredient to menu item
  - `updateQuantity(menuItemId, ingredientId, quantityRequired)`: update quantity
  - `unassign(menuItemId, ingredientId)`: remove link

### 3d. Controller

- [ ] Create `src/controllers/menuItemIngredient.controller.ts`

### 3e. Routes

- [ ] Create `src/routes/menuItemIngredient.routes.ts`
  - `GET /api/menu/:menuItemId/ingredients` — auth required (STAFF+)
  - `POST /api/menu/:menuItemId/ingredients` — auth required, ADMIN or STAFF
  - `PATCH /api/menu/:menuItemId/ingredients/:ingredientId` — auth required, ADMIN or STAFF
  - `DELETE /api/menu/:menuItemId/ingredients/:ingredientId` — auth required, ADMIN or STAFF

### 3f. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/menu/:menuItemId/ingredients`

---

## Phase 4 — Cart

### 4a. Validation Schema

- [ ] Create `src/validations/cart.validation.ts`
  - `addToCartSchema`: `{ menuItemId (uuid), quantity (int, >=1) }`
  - `updateCartItemSchema`: `{ quantity (int, >=1) }`
  - `cartItemParamsSchema`: `{ cartItemId (uuid) }`

### 4b. Repository

- [ ] Create `src/repositories/cart.repository.ts`
  - Extends `BaseRepository<Cart, CartCreateInput, CartUpdateInput>`
  - Add: `findByUserId(userId): Promise<Cart | null>` — one cart per user
  - Add: `findCartWithItems(userId): Promise<Cart & { items: CartItem[] }>` — includes cart items with menu item details

### 4c. CartItem Repository

- [ ] Create `src/repositories/cartItem.repository.ts`
  - Extends `BaseRepository<CartItem, ...>`
  - Add: `findByCartIdAndMenuItemId(cartId, menuItemId)`: find specific cart item
  - Add: `deleteByCartId(cartId)`: clear all items from cart

### 4d. Service

- [ ] Create `src/services/cart.service.ts`
  - `getCart(userId)`: get or create user's cart with items
  - `addItem(userId, menuItemId, quantity)`: add item (or increment if exists)
  - `updateItemQuantity(cartItemId, quantity, userId)`: update quantity (ownership check)
  - `removeItem(cartItemId, userId)`: remove item from cart (ownership check)
  - `clearCart(userId)`: remove all items from cart

### 4e. Controller

- [ ] Create `src/controllers/cart.controller.ts`
  - All cart operations are per-user (check `req.user.id`)

### 4f. Routes

- [ ] Create `src/routes/cart.routes.ts`
  - `GET /api/cart/` — auth required (CUSTOMER+), get own cart
  - `POST /api/cart/items` — auth required (CUSTOMER+), add item
  - `PATCH /api/cart/items/:cartItemId` — auth required (CUSTOMER+), update quantity
  - `DELETE /api/cart/items/:cartItemId` — auth required (CUSTOMER+), remove item
  - `DELETE /api/cart/` — auth required (CUSTOMER+), clear cart

### 4g. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/cart` with auth middleware for all routes

---

## Phase 5 — Orders

### 5a. Validation Schema

- [ ] Create `src/validations/order.validation.ts`
  - `createOrderSchema`: `{ orderType (DINE_IN | TAKEAWAY | DELIVERY) }`
  - `updateOrderStatusSchema`: `{ status (PREPARING | READY | COMPLETED | CANCELLED) }`
  - `orderParamsSchema`: `{ id (uuid) }`
  - `orderFilterSchema`: `{ status (enum, optional) }` for query params

### 5b. Repository

- [ ] Create `src/repositories/order.repository.ts`
  - Extends `BaseRepository<Order, ...>`
  - Add: `findByUserId(userId)`: all orders for a user
  - Add: `findOrderWithItems(orderId)`: order + orderItems + menuItems
  - Add: `findAllWithUser()`: all orders with user info (admin view)

### 5c. OrderItem Repository

- [ ] Create `src/repositories/orderItem.repository.ts`
  - Extends `BaseRepository<OrderItem, ...>`
  - Add: `findByOrderId(orderId)`: all items in an order

### 5d. Service

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

### 5e. Controller

- [ ] Create `src/controllers/order.controller.ts`

### 5f. Routes

- [ ] Create `src/routes/order.routes.ts`
  - `POST /api/orders/` — auth required (CUSTOMER+), create order from cart
  - `GET /api/orders/` — auth required, ADMIN sees all, CUSTOMER sees own
  - `GET /api/orders/:id` — auth required, ownership check
  - `PATCH /api/orders/:id/status` — auth required, ADMIN or STAFF
  - `DELETE /api/orders/:id` — auth required (CUSTOMER+), cancel own PENDING order

### 5g. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/orders`

---

## Phase 6 — Payments

### 6a. Validation Schema

- [ ] Create `src/validations/payment.validation.ts`
  - `createPaymentSchema`: `{ orderId (uuid), method (CASH | CARD | WALLET), transactionReference (string) }`
  - `updatePaymentStatusSchema`: `{ status (PAID | FAILED | REFUNDED) }`

### 6b. Repository

- [ ] Create `src/repositories/payment.repository.ts`
  - Extends `BaseRepository<Payment, ...>`
  - Add: `findByOrderId(orderId)`: get payment for an order
  - Add: `findByTransactionReference(ref)`: lookup by reference

### 6c. Service

- [ ] Create `src/services/payment.service.ts`
  - `createPayment(orderId, method, transactionReference)`: create payment record
    - Validate order exists and has no existing payment
    - Set initial status to `PENDING`
  - `updatePaymentStatus(paymentId, status)`: admin only
    - If status = PAID, set `paidAt` timestamp
  - `getPaymentByOrder(orderId)`: get payment details for an order

### 6d. Controller

- [ ] Create `src/controllers/payment.controller.ts`

### 6e. Routes

- [ ] Create `src/routes/payment.routes.ts`
  - `POST /api/payments/` — auth required (CUSTOMER+), create payment for own order
  - `PATCH /api/payments/:id/status` — auth required, ADMIN only
  - `GET /api/payments/order/:orderId` — auth required, get payment for order

### 6f. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/payments`

---

## Phase 7 — Inventory

### 7a. Validation Schema

- [ ] Create `src/validations/ingredient.validation.ts`
  - `createIngredientSchema`: `{ name (string), unit (KG|G|L|ML|PIECE), quantity (int, >=0), minimumQuantity (int, >=0) }`
  - `updateIngredientSchema`: all fields optional
  - `ingredientParamsSchema`: `{ id (uuid) }`

- [ ] Create `src/validations/inventoryTransaction.validation.ts`
  - `createTransactionSchema`: `{ ingredientId (uuid), type (IN|OUT|ADJUSTMENT), quantity (int, >0), reference (ORDER|MANUAL|RESTOCK), orderId? (uuid) }`
  - `transactionFilterSchema`: `{ ingredientId? (uuid), type? (enum) }`

### 7b. Repository

- [ ] Create `src/repositories/ingredient.repository.ts`
  - Extends `BaseRepository<Ingredient, ...>`
  - Add: `findLowStock()`: ingredients where `quantity <= minimumQuantity`

- [ ] Create `src/repositories/inventoryTransaction.repository.ts`
  - Extends `BaseRepository<InventoryTransaction, ...>`
  - Add: `findByIngredientId(ingredientId)`: transaction history for ingredient
  - Add: `findByOrderId(orderId)`: transactions linked to an order

### 7c. Service

- [ ] Create `src/services/ingredient.service.ts`
  - CRUD for ingredients (admin/staff)
  - `getLowStock()`: list ingredients below minimum quantity

- [ ] Create `src/services/inventoryTransaction.service.ts`
  - `createTransaction(data)`: record stock change
    - IN: increment ingredient quantity
    - OUT: decrement ingredient quantity (check sufficient stock)
    - ADJUSTMENT: set quantity to new value
  - `getByIngredient(ingredientId)`: transaction history
  - `getLowStockAlerts()`: ingredients needing restock

### 7d. Controller

- [ ] Create `src/controllers/ingredient.controller.ts`
- [ ] Create `src/controllers/inventoryTransaction.controller.ts`

### 7e. Routes

- [ ] Create `src/routes/ingredient.routes.ts`
  - `GET /api/ingredients/` — auth required (STAFF+), list all
  - `GET /api/ingredients/low-stock` — auth required (STAFF+), low stock alerts
  - `GET /api/ingredients/:id` — auth required (STAFF+)
  - `POST /api/ingredients/` — auth required, ADMIN or STAFF
  - `PATCH /api/ingredients/:id` — auth required, ADMIN or STAFF
  - `DELETE /api/ingredients/:id` — auth required, ADMIN only

- [ ] Create `src/routes/inventoryTransaction.routes.ts`
  - `GET /api/inventory/` — auth required (STAFF+), list transactions (filterable)
  - `POST /api/inventory/` — auth required, ADMIN or STAFF
  - `GET /api/inventory/ingredient/:ingredientId` — auth required (STAFF+)

### 7f. Wire Up

- [ ] Update `src/app.ts` — mount at `/api/ingredients` and `/api/inventory`

---

## Phase 8 — User Admin Enhancements

- [x] **GET /api/user/profile** — auth required, get own profile (ID from JWT)
- [x] **PATCH /api/user/profile** — auth required, update own profile (ID from JWT)
- [x] **DELETE /api/user/profile** — auth required, delete own account (ID from JWT)
- [x] **GET /api/user/:id** — admin only, get user by ID
- [x] **PATCH /api/user/:id** — admin only, update user by ID
- [x] **DELETE /api/user/:id** — admin only, delete user by ID
- [x] **GET /api/user/** — admin only, list all users
- [ ] Add pagination support to list endpoints (query params: `page`, `limit`)

---

## Phase 9 — Seed Data & Polish

- [ ] **Seed admin user**: email `admin@restaurant.com`, password `admin123`, role ADMIN
- [ ] **Seed sample menu items**: link existing categories to menu items with prices
- [ ] **Seed sample ingredients**: common restaurant ingredients (chicken, rice, vegetables, etc.)
- [ ] **Seed menu-item-ingredient associations**: link menu items to ingredients with quantities
- [ ] **Add pagination** to all list endpoints (categories, menu items, orders, users, ingredients)
- [ ] **Complete Swagger docs** for all new endpoints (MenuItem, Cart, Order, Payment, Ingredient, Inventory)
- [ ] **Add image upload** for menu items (store path in `image` field)
- [ ] **Add order total calculation** middleware/service helper

---

## Dependency Graph

```
Phase 1 (Bug Fixes)
    ↓
Phase 2 (Menu Item CRUD)  ←  Phase 3 (MenuItem ↔ Ingredient)
    ↓                              ↓
Phase 4 (Cart)              Phase 7 (Inventory)
    ↓                              ↓
Phase 5 (Orders)  ←←←←←←←←←←←←←←←
    ↓
Phase 6 (Payments)
    ↓
Phase 8 (User Admin)
    ↓
Phase 9 (Seed & Polish)
```

---

## Suggested Priority Order

1. **Phase 1** — Fix bugs (unblocks everything)
2. **Phase 2** — Menu Item CRUD (core feature, needed for cart/orders)
3. **Phase 7** — Inventory (ingredients must exist before orders)
4. **Phase 3** — MenuItem ↔ Ingredient (links menu to inventory)
5. **Phase 4** — Cart (depends on menu items)
6. **Phase 5** — Orders (depends on cart + inventory)
7. **Phase 6** — Payments (depends on orders)
8. **Phase 8** — User Admin (independent, can be done anytime)
9. **Phase 9** — Polish (final pass)

