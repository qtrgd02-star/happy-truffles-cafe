# Staff Training Guide - Happy Truffles Cafe

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin Panel](#admin-panel)
3. [POS Operations](#pos-operations)
4. [Kitchen Display](#kitchen-display)
5. [Driver Assignment](#driver-assignment)
6. [Order Management](#order-management)
7. [Inventory Management](#inventory-management)
8. [Staff Management](#staff-management)
9. [Reports & Analytics](#reports--analytics)
10. [Common Workflows](#common-workflows)

---

## Getting Started

### Accessing the System
- Admin Panel: `http://localhost:3000/admin`
- POS: `http://localhost:3000/pos`
- Kitchen: `http://localhost:3000/kitchen`
- Drivers: `http://localhost:3000/drivers`

### Login
- Email: admin@happytruffles.qa
- Password: admin123
- **Change password after first login!**

### User Roles
- **Admin**: Full access to all features
- **Manager**: Menu, inventory, orders, reports
- **Staff**: POS, orders, reservations

---

## Admin Panel

### Dashboard
- View today's orders, revenue, active reservations
- Quick stats: total orders, pending orders, low stock items
- Recent activity feed

### Menu Management
1. Go to **Admin > Menu**
2. View all menu items organized by category
3. Click **Edit** to update:
   - Item name, description, price
   - Image URL
   - Category assignment
   - Stock status
4. Click **Add Item** to create new menu items
5. Use **Bulk Actions** to update multiple items

### Inventory Management
1. Go to **Admin > Inventory**
2. View current stock levels
3. Low stock items highlighted in red
4. Click **Update Stock** to adjust quantities
5. Set low stock thresholds for alerts
6. Auto-deduction happens when orders are placed

### Promo Codes
1. Go to **Admin > Promos**
2. Click **Create Promo**
3. Fill in:
   - Code name (e.g., SUMMER20)
   - Type: Percentage, Fixed Amount, or Item-specific
   - Value: 1-100%
   - Min order amount (optional)
   - Max uses (optional)
   - Valid from/to dates
4. Toggle **Active** to enable/disable

### Staff Management
1. Go to **Admin > Staff**
2. Click **Add Staff Member**
3. Enter:
   - Name, email, phone
   - Role: Admin, Manager, or Staff
   - Status: Active/Inactive
4. Staff can login with their email and default password

### Reviews
1. Go to **Admin > Reviews**
2. View pending reviews
3. Click **Approve** to show on website
4. Click **Reject** to remove
5. Approved reviews appear on homepage

### Reports
1. Go to **Admin > Reports**
2. Select date range
3. Click **Export CSV** to download:
   - Orders report
   - Staff report
   - Inventory report
4. View analytics charts

### Settings
1. Go to **Admin > Settings**
2. Update restaurant information:
   - Name, address, phone, email
   - Opening hours
   - Description
3. Changes reflect immediately on website

### Analytics
1. Go to **Admin > Analytics**
2. View:
   - Total sales, orders, average order value
   - Top selling items
   - Sales by hour/day charts
3. Select time range: 7 days, 30 days, 90 days

### Newsletter
1. Go to **Admin > Newsletter**
2. Create email campaigns
3. View subscriber list
4. Send promotional emails

### Backups
1. Go to **Admin > Backups**
2. View backup history
3. Click **Create Backup** for manual backup
4. Download or restore backups

---

## POS Operations

### Starting a New Order
1. Open **POS** (`/pos`)
2. Select **Order Type**:
   - Dine-in: Select table number
   - Takeaway: Customer name required
   - Delivery: Enter customer address
3. Add items to cart:
   - Click item card or use search
   - Adjust quantity with +/- buttons
   - Add special instructions
4. Click **Proceed to Checkout**

### Applying Discounts
1. In cart, enter promo code in **Promo Code** field
2. Click **Apply**
3. Discount will reflect in total

### Payment Processing
1. Select payment method:
   - **Cash**: Enter amount received, calculate change
   - **Card**: Process via card terminal
   - **Wallet**: Confirm wallet payment
2. Click **Process Payment**
3. Order is sent to kitchen

### Customer Information
- Enter customer name, phone, email
- Address required for delivery
- Notes for special requests

### Offline Mode
- If internet disconnects, POS continues working
- Orders are queued locally
- Auto-sync when connection restores
- Orange banner shows offline status

---

## Kitchen Display System

### Accessing Kitchen Display
- Open **Kitchen** (`/kitchen`)
- Shows all active orders in real-time

### Order Status Workflow
1. **Pending**: New order received
2. **Preparing**: Kitchen started preparing
3. **Ready**: Order ready for pickup/delivery
4. **Completed**: Order delivered/served

### Managing Orders
1. Click order card to expand details
2. View:
   - Customer name and contact
   - All items with quantities
   - Special instructions
   - Order time
3. Click **Start Preparing** to change status to "Preparing"
4. Click **Mark Ready** when order is complete
5. Kitchen printer auto-prints ticket (if configured)

### Priority Orders
- Delivery orders highlighted in red
- Dine-in orders highlighted in blue
- Takeaway orders highlighted in green
- Sort by order time or priority

---

## Driver Assignment

### Accessing Driver Management
- Open **Drivers** (`/drivers`)

### Managing Drivers
1. View all drivers and their status:
   - Available (green)
   - Busy (red)
   - Offline (gray)
2. Click **Add Driver** to register new driver:
   - Name, phone, vehicle type
   - License number
   - Status

### Assigning Orders
1. Go to **Orders** with delivery type
2. Click **Assign Driver**
3. Select available driver
4. Driver receives notification
5. Track delivery status in real-time

### Delivery Status Updates
- Assigned → Picked Up → Delivered
- Customer can track on `/tracking` page
- Auto SMS/email notifications sent

---

## Order Management

### Viewing Orders
1. Go to **Admin > Orders** or **Orders** page
2. Filter by:
   - Date range
   - Status (pending, confirmed, preparing, ready, completed, cancelled)
   - Order type (dine-in, takeaway, delivery)
   - Payment method

### Order Actions
- **View Details**: Click order to see full details
- **Update Status**: Change order status
- **Refund**: Process refund for cancelled orders
- **Print Receipt**: Print order receipt
- **Send Notification**: SMS/email to customer

### Common Issues
- **Order not showing**: Check filters and date range
- **Payment failed**: Verify payment method and retry
- **Customer complaint**: Check order notes and status history

---

## Inventory Management

### Daily Tasks
1. Check low stock alerts each morning
2. Update stock levels after deliveries
3. Review inventory reports weekly

### Stock Deduction
- Automatic when orders are placed
- Manual adjustment for:
  - Spoilage/waste
  - Staff meals
  - Sample items

### Low Stock Alerts
- SMS/email sent when stock below threshold
- Items highlighted in red in inventory list
- Set thresholds per item

### Reordering
1. View items below reorder point
2. Create purchase order
3. Update stock when received

---

## Staff Management

### Adding New Staff
1. Go to **Admin > Staff**
2. Click **Add Staff Member**
3. Fill in details:
   - Full name
   - Email (used for login)
   - Phone number
   - Role: Admin, Manager, or Staff
   - Status: Active/Inactive
4. Default password: `staff123`
5. Staff should change password on first login

### Role Permissions
- **Admin**: Full access
- **Manager**: Menu, inventory, orders, reports
- **Staff**: POS, orders, reservations only

### Staff Scheduling
1. Go to **Staff Schedule** (`/staff-schedule`)
2. View weekly roster
3. Assign shifts:
   - Morning: 9:00 AM - 5:00 PM
   - Evening: 5:00 PM - 11:30 PM
4. Staff receives schedule notification

---

## Reports & Analytics

### Sales Reports
1. Go to **Admin > Reports**
2. Select report type:
   - Daily sales
   - Weekly sales
   - Monthly sales
3. Export to CSV

### Popular Items
- View top 10 selling items
- Revenue per item
- Quantity sold

### Peak Hours
- Identify busy hours
- Plan staffing accordingly
- Optimize kitchen prep

### Customer Insights
- Repeat customers
- Average order value
- Preferred payment methods

---

## Common Workflows

### Dine-in Order
1. Customer seated → POS: Select table
2. Take order → Add items to cart
3. Submit order → Kitchen receives ticket
4. Kitchen prepares → Mark as ready
5. Serve customer → Mark as completed

### Delivery Order
1. Customer orders online/WhatsApp
2. Kitchen prepares order
3. Assign driver → Driver picks up
4. Driver delivers → Mark delivered
5. Customer receives tracking update

### Walk-in Customer
1. Check waitlist status
2. If available, seat customer
3. Take order via POS
4. Process payment
5. Mark table as available

### Reservation
1. Customer calls/books online
2. Check table availability
3. Confirm reservation
4. Send confirmation SMS/email
5. On arrival: seat and mark as seated

### Refund Process
1. Go to order details
2. Click **Refund**
3. Enter reason
4. Select refund method
5. Process refund
6. Notify customer

---

## Troubleshooting

### POS Issues
- **Cart not updating**: Refresh page, check internet
- **Payment failed**: Verify payment method, retry
- **Printer not working**: Check USB/network connection

### Kitchen Display Issues
- **Orders not appearing**: Check internet connection
- **Status not updating**: Refresh page
- **Printer offline**: Restart printer service

### General Issues
- **Page not loading**: Clear cache, check internet
- **Login failed**: Verify credentials, check if account active
- **Data not syncing**: Check internet, wait for auto-sync

---

## Support Contacts

- Technical Support: +974 3159 0002
- Email: info@happytruffles.qa
- Emergency: Available 9:00 AM - 11:30 PM

---

## Training Checklist

- [ ] Login and navigation
- [ ] Taking a dine-in order
- [ ] Taking a delivery order
- [ ] Processing payment
- [ ] Managing reservations
- [ ] Using kitchen display
- [ ] Updating order status
- [ ] Managing inventory
- [ ] Creating promo codes
- [ ] Generating reports
- [ ] Handling refunds
- [ ] Staff management
- [ ] Driver assignment
- [ ] Waitlist management
- [ ] Offline mode procedures

---

*Last updated: 2026-09-14*