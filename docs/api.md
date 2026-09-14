# API Documentation

## Base URL

/api

## Endpoints

### Menu

GET /api/menu
Returns all menu items.

### Cart

POST /api/cart
Body: { action: "add" | "remove" | "update" | "clear", item?: CartItem }

### Orders

POST /api/orders
Body: Order object
Returns: { success: boolean, order?: Order }

GET /api/orders
Returns all orders (admin)

### Reservations

GET /api/reservations
Returns all reservations

POST /api/reservations
Body: Reservation object
Returns: { success: boolean, reservation?: Reservation }

DELETE /api/reservations?id=<id>
Cancels a reservation

### Reviews

GET /api/reviews
Returns approved reviews

POST /api/reviews
Body: Review object
Returns: { success: boolean }

### Promos

GET /api/promos
Returns all promos

POST /api/promos
Body: { action: "create" | "update" | "delete" | "increment-use", promo?: PromoCode, id?: string }

### Gift Cards

GET /api/gift-cards
Returns all gift cards

POST /api/gift-cards
Body: { action: "create" | "redeem" | "delete", code?: string, amount?: number }

### Payments

POST /api/payments
Body: { amount: number, orderId: string, cardDetails: object }
Returns: { success: boolean, transactionId?: string }

### Tracking

GET /api/tracking?orderId=<id>&phone=<phone>
Returns order tracking info

POST /api/tracking
Body: { orderId: string, status: string }
Updates order status

### Tables QR

GET /api/tables-qr
Returns tables with QR codes

POST /api/tables-qr
Body: { action: "create" | "update" | "delete", table: object }

### Notifications

POST /api/notifications/email
Body: { to: string, subject: string, html: string }

POST /api/notifications/sms
Body: { to: string, message: string }

POST /api/notifications/push
Body: { subscription: object, title: string, body: string }

### Instagram

GET /api/instagram
Returns mock Instagram posts

### Admin Analytics

GET /api/admin/analytics?range=7d|30d|90d
Returns analytics data

### Inventory

GET /api/inventory
Returns inventory items

POST /api/inventory
Body: { action: "deduct" | "update", menuItemId: number, quantity?: number }