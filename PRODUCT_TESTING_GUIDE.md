# Product System Testing Guide

## Pre-Testing Setup

### 1. Reset Database (Optional)
Run the seed script to start with clean database:
```bash
cd backend
npm run seed
# Database will be empty, ready for new products
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Test Case 1: Admin Creates First Product

### Prerequisites
- ✅ Admin user logged in
- ✅ Empty database (no products)

### Steps
1. Navigate to Admin Dashboard → Products Management
2. Click "Add Product" button
3. Fill in form:
   - **Name:** Premium Leather Journal
   - **Description:** Handcrafted leather journal with 200 pages of premium paper
   - **Price:** 29.99
   - **Stock:** 50
   - **Category:** Notebooks
   - **Discount:** 10
   - **Image URL:** https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop
4. Verify image preview shows
5. Click "Create Product"

### Expected Results
- ✅ Form validates successfully
- ✅ Success toast: "Product created successfully"
- ✅ Product appears in admin product list
- ✅ Product shows:
  - Image
  - Name: "Premium Leather Journal"
  - Price: $29.99
  - Stock: 50
  - Category: Notebooks badge
  - Discount: 10%

### Verify User Side
1. Go to Products page (user view)
2. Should see the new product
3. Should show:
  - ✅ Product image
  - ✅ "IN STOCK" green badge
  - ✅ "10% OFF" orange badge
  - ✅ Sale price: $26.99 (bold blue)
  - ✅ Original price: $29.99 (strikethrough gray)
  - ✅ Name and description
  - ✅ Add to Cart button (blue)

---

## Test Case 2: Admin Creates Multiple Products

### Create 3 Different Products

**Product 1: Notebooks**
- Name: Classic Dotted Notebook
- Price: 14.99
- Stock: 100
- Category: Notebooks
- Image: https://images.unsplash.com/photo-1557672172-298e090d0f80?w=400&h=400&fit=crop

**Product 2: Writing (Low Stock)**
- Name: Fine Tip Gel Pen Set
- Price: 12.99
- Stock: 3
- Category: Writing
- Discount: 15
- Image: https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop

**Product 3: Writing (Out of Stock)**
- Name: Mechanical Pencil Set
- Price: 8.99
- Stock: 0
- Category: Writing
- Image: https://images.unsplash.com/photo-1608876642117-adf64e543b64?w=400&h=400&fit=crop

### Expected Results
- ✅ All 3 products created successfully
- ✅ Admin list shows 3 products
- ✅ Product 1: Green "IN STOCK" badge
- ✅ Product 2: Yellow "LOW STOCK (3)" badge
- ✅ Product 3: Red "OUT OF STOCK" badge
- ✅ On Products page, user sees all 3 products with badges

---

## Test Case 3: Search Functionality

### Test Search by Name
1. Go to Products page
2. Type "notebook" in search bar
3. Should show:
   - ✅ Premium Leather Journal
   - ✅ Classic Dotted Notebook

### Test Search by Description
1. Type "leather" in search bar
2. Should show:
   - ✅ Premium Leather Journal

### Test Search with No Results
1. Type "xyz123" (non-existent product)
2. Should show:
   - ✅ "No Products Found" message
   - ✅ "Clear All Filters" button

---

## Test Case 4: Filter by Category

### Test Category Filter
1. Go to Products page
2. In sidebar, click "Writing"
3. Should show only:
   - ✅ Fine Tip Gel Pen Set
   - ✅ Mechanical Pencil Set
4. Click "Notebooks"
5. Should show only:
   - ✅ Premium Leather Journal
   - ✅ Classic Dotted Notebook
6. Click "All Categories"
7. Should show all products

---

## Test Case 5: Filter by Price

### Test Price Range
1. Go to Products page
2. Drag price slider to: $10 - $20
3. Should show:
   - ✅ Classic Dotted Notebook ($14.99)
   - ✅ Fine Tip Gel Pen Set ($12.99)
4. Should NOT show:
   - ❌ Premium Leather Journal ($29.99)
5. Adjust slider to: $0 - $30
6. Should show all products

---

## Test Case 6: Multiple Filters Together

### Test Combined Filters
1. Select Category: Writing
2. Set Price: $10 - $15
3. Should show only:
   - ✅ Fine Tip Gel Pen Set ($12.99)
4. Clear filters
5. Should see all products again

---

## Test Case 7: Stock Status Display

### Verify Badges
- **In Stock** (>5): Green badge
- **Low Stock** (1-5): Yellow badge with count
- **Out of Stock** (0): Red badge

### Verify Add to Cart
- ✅ In Stock product: Button says "Add to Cart" (blue, enabled)
- ✅ Out of Stock product: Button says "Out of Stock" (disabled)

---

## Test Case 8: Admin Edits Product

### Edit Product Details
1. Admin goes to Products Management
2. Click Edit on "Premium Leather Journal"
3. Change:
   - Price: 32.99
   - Discount: 15
   - Stock: 30
4. Click "Update Product"

### Verify Changes
- ✅ Admin list updates
- ✅ User Products page updates immediately
- ✅ Sale price recalculates: $27.94 (32.99 * 0.85)
- ✅ Stock badge updates: "IN STOCK (30)"

---

## Test Case 9: Admin Deletes Product

### Delete Product
1. Admin goes to Products Management
2. Click Delete on "Mechanical Pencil Set" (out of stock)
3. Confirm deletion

### Verify Deletion
- ✅ Product removed from admin list
- ✅ Product removed from user Products page
- ✅ Product count decreases
- ✅ Search no longer finds product

---

## Test Case 10: User Adds to Cart

### Add In-Stock Product
1. Go to Products page
2. Find "Fine Tip Gel Pen Set"
3. Click "Add to Cart"

### Expected
- ✅ Success toast: "Fine Tip Gel Pen Set added to cart!"
- ✅ Cart count increases in navbar
- ✅ Cart context updated
- ✅ Product added with quantity 1

### Add Out-of-Stock Product
1. Try to add "Mechanical Pencil Set"
2. Should show:
   - ✅ Error toast: "Product is out of stock"
   - ❌ NOT added to cart

---

## Test Case 11: User Wishlist

### Add to Wishlist
1. On Products page, hover over product card
2. Heart icon appears
3. Click heart icon

### Expected
- ✅ Heart fills red
- ✅ Toast: "Added to wishlist"
- ✅ Wishlist context updated

### Remove from Wishlist
1. Click heart icon again
2. Heart outline shows
3. Toast: "Removed from wishlist"

---

## Test Case 12: Form Validation

### Test Required Fields
1. Try to create product with missing name
   - ❌ Button disabled OR error shown
2. Try with missing description
   - ❌ Error message shown
3. Try with price = 0
   - ❌ "Price must be greater than 0"
4. Try with stock = -1
   - ❌ "Stock must be 0 or greater"

### Test Optional Fields
1. Create product without discount
   - ✅ Discount defaults to 0
2. Create product without image URL
   - ✅ Product created, shows placeholder

---

## Test Case 13: Responsive Design

### Test Mobile (320px)
1. Open Products page on mobile
2. Verify:
   - ✅ 1-column grid
   - ✅ Filter toggle button shows
   - ✅ Sidebar collapses
   - ✅ All text readable
   - ✅ Buttons clickable

### Test Tablet (768px)
1. Open Products page on tablet
2. Verify:
   - ✅ 2-column grid
   - ✅ Sidebar toggleable
   - ✅ Filters work

### Test Desktop (1200px)
1. Open Products page on desktop
2. Verify:
   - ✅ 3-column grid
   - ✅ Sidebar always visible
   - ✅ All features work

---

## Test Case 14: Image Handling

### Valid Image URL
1. Create product with valid Unsplash image
2. Verify:
   - ✅ Preview shows in form
   - ✅ Image displays on Products page
   - ✅ Hover zoom works

### Invalid Image URL
1. Create product with broken image URL
2. Verify:
   - ✅ Fallback placeholder shows
   - ✅ Package icon displays
   - ✅ No console errors

### Missing Image
1. Create product without image URL
2. Verify:
   - ✅ Placeholder shows
   - ✅ No errors

---

## Test Case 15: Discount Calculations

### 10% Discount
- Price: $29.99
- Discount: 10%
- Calculated: $26.99 ✅

### 15% Discount
- Price: $12.99
- Discount: 15%
- Calculated: $11.04 ✅

### No Discount
- Price: $14.99
- Discount: 0%
- Shows: $14.99 (no strikethrough) ✅

---

## Performance Tests

### Loading Many Products
1. Create 20+ products
2. Verify:
   - ✅ Page loads quickly
   - ✅ Grid renders smoothly
   - ✅ Scroll is smooth
   - ✅ Filters respond instantly

### Search Performance
1. Type quickly in search bar
2. Verify:
   - ✅ Results update in real-time
   - ✅ No lag
   - ✅ Accurate results

---

## Security Tests

### Admin Authentication
- ✅ Only logged-in admins can create products
- ✅ Only logged-in admins can edit products
- ✅ Only logged-in admins can delete products
- ✅ Users cannot access admin endpoints

### Validation
- ✅ Invalid data rejected
- ✅ SQL injection prevented
- ✅ XSS prevention (images sanitized)

---

## Bug Report Template

If issues found, use this format:

```
TEST CASE: [number and name]
SEVERITY: [High/Medium/Low]
EXPECTED: [what should happen]
ACTUAL: [what happened]
STEPS TO REPRODUCE: [step by step]
SCREENSHOT: [attach if applicable]
```

---

## Test Environment Checklist

- [ ] Backend server running on localhost:5000
- [ ] Frontend server running on localhost:5173
- [ ] Database connected
- [ ] Admin user logged in (for admin tests)
- [ ] Regular user logged in (for user tests)
- [ ] Unsplash images accessible
- [ ] No console errors
- [ ] No network errors

---

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Admin Creates Product | ⏳ | |
| 2. Admin Creates Multiple | ⏳ | |
| 3. Search Functionality | ⏳ | |
| 4. Filter by Category | ⏳ | |
| 5. Filter by Price | ⏳ | |
| 6. Multiple Filters | ⏳ | |
| 7. Stock Status | ⏳ | |
| 8. Admin Edits | ⏳ | |
| 9. Admin Deletes | ⏳ | |
| 10. User Adds to Cart | ⏳ | |
| 11. User Wishlist | ⏳ | |
| 12. Form Validation | ⏳ | |
| 13. Responsive Design | ⏳ | |
| 14. Image Handling | ⏳ | |
| 15. Discount Calculations | ⏳ | |

---

**Note:** Fill in Status with ✅ (Pass), ❌ (Fail), or ⏳ (Pending)

Good luck with testing! 🎉
