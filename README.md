# Hogwarts Cafe ☕🏰
> *The Wizarding World's Dining Room — A Little Magic in Every Serving.*

A heritage café management and point-of-sale (POS) web application designed for Hogwarts Cafe. Built with React, Vite, and custom CSS design tokens inspired by the Great Hall, antique English libraries, and heritage British hospitality systems.

**Live Deployment:** [https://expediti.github.io/hogwarts-cafe/](https://expediti.github.io/hogwarts-cafe/)  
**Repository:** [https://github.com/expediti/hogwarts-cafe](https://github.com/expediti/hogwarts-cafe)

---

## 🏛️ Overview & Design Aesthetics
Hogwarts Cafe combines the grandeur of the Hogwarts Great Hall with the intimate warmth of a classic English coffee house and the reliability of a heritage restaurant POS system.

- **Art Direction:** Deep forest green (`#172B24`), dark woodland green (`#223A30`), warm ivory (`#F4EEDF`), antique parchment (`#E9DFC8`), and antique brass accents (`#AB8954`).
- **Typography:** Cormorant Garamond for regal editorial headings, Libre Baskerville for traditional descriptions, and Inter for precision data tables.
- **Zero External Server Dependency:** Fully static client-side application running offline-first with persistent `localStorage` data handling and error safeguards.

---

## ✨ Features & Architecture

### 1. Overview Dashboard
- Dynamic time-aware manager greeting (*"Good evening, Café Manager"*).
- 8 live operational metric cards: Today's Revenue, Orders Received, Active Orders, Available Tables, Occupied Tables, Today's Reservations, Average Order Value (AOV), and Low-Stock Ingredients.
- 7-Day Revenue bar graph calculating real gross earnings in Indian Rupees (`₹`).
- Live table occupancy snapshot across all 5 chambers.
- Popular dishes ranking calculated dynamically from order records.
- Quick action shortcuts to trigger orders, reservations, floor plan, and menu creation.

### 2. Orders & POS Management
- Split-screen point-of-sale layout: interactive dish catalog on the left, live ticket receipt drawer on the right.
- Category filters (Enchanted Coffee, Butterbrew & Beverages, Breakfast at Hogwarts, Great Hall Mains, Magical Desserts, Bakery & Pastries, Seasonal Specials).
- Table selector and customer profile matching (or walk-in guest recording).
- Real-time calculations: subtotal, discount, 5% GST tax, and grand total in INR format (`₹1,250.00`).
- Payment method support: **UPI**, **Card**, and **Cash**.
- Printable bill/receipt modal formatted with wax seal crest and native `window.print()` layout.
- Order tracker with status lifecycle: *Pending* ➔ *Preparing* ➔ *Ready* ➔ *Served* ➔ *Completed* / *Cancelled*.

### 3. Interactive Floor Plan & Seating
- Top-down visual architectural layout spanning 5 distinct chambers:
  1. **The Great Hall** (T01–T05)
  2. **The Library Lounge** (T06–T09)
  3. **The Common Room** (T10–T12)
  4. **The Courtyard** (T13–T15)
  5. **The Fireplace Section** (T16–T20)
- Individual 2D table objects with dynamic surrounding chairs.
- Real-time color-coded states: *Available* (Forest Green), *Occupied* (Muted Burgundy), *Reserved* (Antique Brass), *Cleaning* (Dark Walnut).
- Side drawer inspector with seating party assignment, occupancy status, active orders, and direct POS launching.

### 4. Reservation Book & Conflict Prevention
- Complete reservation scheduling with patron name, Indian contact numbers (`+91`), party sizes, dates, arrival times, section preferences, and table allocations.
- Automatic conflict check calculating booking times and durations (default 90 mins) to prevent overlapping double-bookings.
- Dual presentation: filterable table list and hourly daily calendar timeline.

### 5. Menu Catalog & Recipe Management
- Over 35 seed dishes with realistic Indian Rupee pricing, preparation times, vegetarian/non-vegetarian indicators, and descriptions.
- Instant stock availability toggling (*In Stock* / *Sold Out*).
- Dish creation and editing modal with local image compression to safely respect browser storage limits.

### 6. Pantry & Ingredient Inventory
- Tracking of raw stock for 15 core ingredients (Coffee beans, Milk, Cocoa powder, Sugar, Flour, Butter, Eggs, Cream, Strawberries, Mushrooms, Cheese, Bread, Potatoes, Chicken, Pumpkin juice concentrate).
- Automatic inventory depletion when food orders are marked *Completed*.
- Minimum threshold health indicators and low-stock warning banners.
- Quick restock and wastage adjustment tool.

### 7. Patron & Guest Directory
- Tracks customer visit frequency, lifetime spend in INR, last visit date, and dining preferences.
- Automatic patron metrics synchronization upon order completion.
- Detailed historical order ledger for individual patrons.

### 8. Revenue Reports & Analytics
- Financial summaries across selectable ranges (*Today*, *Last 7 Days*, *Last 30 Days*, *All Time*).
- Category-wise revenue contribution bar graphs.
- Payment method distribution metrics (UPI vs. Card vs. Cash).
- Table utilization analysis.
- Instant **CSV Export** for operational accounting.

### 9. Operational Settings & Data Portability
- Configurable café parameters, opening hours, GST percentage, concierge details, and custom receipt blessing.
- **Export Database Backup:** Generates complete JSON archive of all tables, orders, reservations, and inventory.
- **Restore Database Backup:** Upload and restore previously exported JSON backups.
- One-click demonstration data reset and safe data wipe tools.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + Vite 6
- **Language:** JavaScript (ESNext)
- **Styling:** Custom CSS Design Tokens & Media Queries (No Tailwind)
- **Icons:** `lucide-react`
- **Data Persistence:** Versioned browser `localStorage`
- **CI/CD Deployment:** GitHub Actions (`.github/workflows/deploy.yml`) ➔ GitHub Pages

---

## 👥 The Minds Behind Hogwarts Cafe

- **Vaishnavi Singh**
- **Vishakha Singh**
- **Vaishali Pandey**
- **Vaishnavi**

> *“Designed with care, served with a little magic.”*
