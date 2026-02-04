# Database Schema Design

This document outlines the database schema for the AS Gadget Store application. This schema is designed to support the current features including Product Management, Orders, and User Administration.

## Tables

### 1. Users
Stores administrator and staff information.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `name` | VARCHAR(255) | Full name of the user |
| `email` | VARCHAR(255) | Email address (Unique) |
| `password` | VARCHAR(255) | Hashed password |
| `role` | ENUM | 'Admin', 'Editor', 'Viewer' |
| `status` | ENUM | 'Active', 'Inactive' |
| `last_login` | DATETIME | Timestamp of last login |
| `created_at` | DATETIME | Record creation timestamp |

### 2. Products
Main catalog of gadgets.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `name` | VARCHAR(255) | Product name (e.g., iPhone 15 Pro) |
| `slug` | VARCHAR(255) | URL friendly slug (Unique) |
| `brand` | VARCHAR(50) | Apple, Samsung, Xiaomi, etc. |
| `category` | VARCHAR(50) | Phone, Tablet, etc. |
| `release_year` | INT | Year of release |
| `description` | TEXT | Product description |
| `warranty` | VARCHAR(255) | Warranty information |
| `specs` | JSON | Key-value pair of specifications |
| `base_image` | VARCHAR(255) | URL to the main product image |
| `is_featured` | BOOLEAN | Whether to show on featured sections |
| `created_at` | DATETIME | Record creation timestamp |

### 3. Product Variants
Specific configurations of a product (Color, Storage, RAM).

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `product_id` | VARCHAR(36) | Foreign Key -> Products.id |
| `sku` | VARCHAR(100) | Stock Keeping Unit (Unique) |
| `storage` | VARCHAR(50) | e.g., 128GB, 256GB |
| `color` | VARCHAR(50) | e.g., Natural Titanium |
| `ram` | VARCHAR(50) | e.g., 8GB, 12GB (Nullable) |
| `image` | VARCHAR(255) | Specific image for this variant (Nullable) |

### 4. Variant Prices
Pricing and stock information for each variant based on condition.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `variant_id` | VARCHAR(36) | Foreign Key -> ProductVariants.id |
| `condition` | ENUM | 'New Official', 'New Inter', 'Second Ex-Box' |
| `price` | DECIMAL | Base selling price |
| `promo_price` | DECIMAL | Discounted price (Nullable) |
| `stock_status` | ENUM | 'ready', 'low', 'empty' |

### 5. Orders
Customer orders.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `customer_name` | VARCHAR(255) | Customer's full name |
| `customer_phone` | VARCHAR(20) | Customer's phone number |
| `total_amount` | DECIMAL | Total order value |
| `status` | ENUM | 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled' |
| `date` | DATETIME | Order placement date |

### 6. Order Items
Items contained within an order.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `order_id` | VARCHAR(36) | Foreign Key -> Orders.id |
| `product_id` | VARCHAR(36) | Foreign Key -> Products.id |
| `variant_id` | VARCHAR(36) | Foreign Key -> ProductVariants.id |
| `product_name` | VARCHAR(255) | Snapshot of product name at time of order |
| `spec_summary` | VARCHAR(255) | Snapshot of specs (Storage - Color) |
| `condition` | VARCHAR(50) | Condition purchased |
| `price` | DECIMAL | Price per unit at time of order |
| `quantity` | INT | Number of units |

### 7. Activity Logs
Audit trail for admin actions.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR(36) | Primary Key (UUID) |
| `user_id` | VARCHAR(36) | Foreign Key -> Users.id (or username snapshot) |
| `action` | VARCHAR(255) | Action performed (e.g., 'Created Product') |
| `target` | VARCHAR(255) | Target resource (e.g., 'iPhone 15 Pro') |
| `type` | ENUM | 'info', 'success', 'warning', 'danger' |
| `timestamp` | DATETIME | Time of action |

## Relationships

*   **One Product** has **Many Variants**.
*   **One Variant** has **Many Prices** (Conditions).
*   **One Order** has **Many Order Items**.
*   **One User** has **Many Activity Logs**.
