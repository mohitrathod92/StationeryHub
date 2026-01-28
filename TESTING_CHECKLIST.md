# ✅ Testing Checklist

## Pre-Testing Setup

### Backend Setup
- [ ] Navigate to `backend` folder
- [ ] Run `npm install` (if not already done)
- [ ] Verify `.env` file exists with correct values:
  - [ ] `ADMIN_EMAIL=mohitrathod740@gmail.com`
  - [ ] `DATABASE_URL` is set
  - [ ] `JWT_SECRET` is set
  - [ ] `CORS_ORIGIN=http://localhost:5173`
  - [ ] `PORT=5000`
- [ ] Run `npm start`
- [ ] Verify backend is running on `http://localhost:5000`
- [ ] Check console for "Server is running" message

### Frontend Setup
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install` (if not already done)
- [ ] Verify `.env` file exists with:
  - [ ] `VITE_API_URL=http://localhost:5000/api`
- [ ] Run `npm run dev`
- [ ] Verify frontend is running on `http://localhost:5173`
- [ ] Open browser to `http://localhost:5173`

---

## Test 1: Admin Registration

### Steps
1. [ ] Go to `http://localhost:5173/signup`
2. [ ] Fill in the form:
   - [ ] First Name: `Mohit`
   - [ ] Last Name: `Rathod`
   - [ ] Email: `mohitrathod740@gmail.com`
   - [ ] Password: `password123` (or any password ≥ 6 chars)
3. [ ] Click "Create Account"

### Expected Results
- [ ] Success toast appears: "Account created successfully!"
- [ ] Automatically redirected to `/admin`
- [ ] URL shows: `http://localhost:5173/admin`
- [ ] Page shows "Admin Dashboard"
- [ ] Header shows: "Welcome back, Mohit Rathod!"
- [ ] Navbar shows dashboard icon
- [ ] Clicking dashboard icon goes to `/admin`

### If Already Registered
- [ ] Should see error: "User already exists"
- [ ] Proceed to Test 2 (Login)

---

## Test 2: Admin Login

### Steps
1. [ ] Go to `http://localhost:5173/login`
2. [ ] Enter credentials:
   - [ ] Email: `mohitrathod740@gmail.com`
   - [ ] Password: (your password)
3. [ ] Click "Sign In"

### Expected Results
- [ ] Success toast appears: "Welcome back!"
- [ ] Automatically redirected to `/admin`
- [ ] URL shows: `http://localhost:5173/admin`
- [ ] Page shows "Admin Dashboard"
- [ ] See admin statistics (users, orders, products, revenue)
- [ ] Navbar shows "Hi, Mohit" and dashboard icon
- [ ] Dashboard icon links to `/admin`

---

## Test 3: Admin Dashboard Features

### Steps
1. [ ] Verify you're on `/admin` page
2. [ ] Check statistics cards:
   - [ ] Total Users card visible
   - [ ] Total Orders card visible
   - [ ] Total Products card visible
   - [ ] Total Revenue card visible
3. [ ] Check tabs:
   - [ ] Overview tab works
   - [ ] Users tab works
   - [ ] Orders tab works
4. [ ] Click logout button

### Expected Results
- [ ] All statistics display correctly
- [ ] Tabs switch properly
- [ ] Logout redirects to home page
- [ ] User is logged out (navbar shows login button)

---

## Test 4: Regular User Registration

### Steps
1. [ ] Go to `http://localhost:5173/signup`
2. [ ] Fill in the form:
   - [ ] First Name: `John`
   - [ ] Last Name: `Doe`
   - [ ] Email: `john@example.com` (any email except admin)
   - [ ] Password: `password123`
3. [ ] Click "Create Account"

### Expected Results
- [ ] Success toast appears: "Account created successfully!"
- [ ] Automatically redirected to `/dashboard`
- [ ] URL shows: `http://localhost:5173/dashboard`
- [ ] Page shows "Welcome, John Doe!"
- [ ] Navbar shows dashboard icon
- [ ] Clicking dashboard icon goes to `/dashboard`

---

## Test 5: Regular User Login

### Steps
1. [ ] Go to `http://localhost:5173/login`
2. [ ] Enter credentials:
   - [ ] Email: `john@example.com`
   - [ ] Password: (your password)
3. [ ] Click "Sign In"

### Expected Results
- [ ] Success toast appears: "Welcome back!"
- [ ] Automatically redirected to `/dashboard`
- [ ] URL shows: `http://localhost:5173/dashboard`
- [ ] Page shows "User Dashboard"
- [ ] See user statistics (orders, wishlist, account status)
- [ ] Navbar shows "Hi, John" and dashboard icon
- [ ] Dashboard icon links to `/dashboard`

---

## Test 6: User Dashboard Features

### Steps
1. [ ] Verify you're on `/dashboard` page
2. [ ] Check statistics cards:
   - [ ] Total Orders card visible
   - [ ] Wishlist Items card visible
   - [ ] Account Status card visible
3. [ ] Check action buttons:
   - [ ] "Continue Shopping" button works
   - [ ] "View Wishlist" button works
   - [ ] "Logout" button works

### Expected Results
- [ ] All statistics display correctly
- [ ] Buttons navigate to correct pages
- [ ] Logout works properly

---

## Test 7: Role-Based Access Control

### As Regular User (john@example.com)
1. [ ] Login as regular user
2. [ ] Try to access `/admin` directly in URL
3. [ ] Expected: Redirected to `/dashboard`
4. [ ] Try to access `/dashboard`
5. [ ] Expected: Access granted ✅

### As Admin User (mohitrathod740@gmail.com)
1. [ ] Login as admin user
2. [ ] Try to access `/dashboard` directly in URL
3. [ ] Expected: Redirected to `/admin`
4. [ ] Try to access `/admin`
5. [ ] Expected: Access granted ✅

---

## Test 8: Navbar Behavior

### When Not Logged In
- [ ] Navbar shows login button (👤 icon)
- [ ] Clicking login button goes to `/login`
- [ ] No dashboard icon visible
- [ ] No user name visible

### When Logged In as Admin
- [ ] Navbar shows dashboard icon (📊)
- [ ] Navbar shows "Hi, Mohit"
- [ ] Navbar shows "Logout" button
- [ ] Dashboard icon links to `/admin`
- [ ] Logout button works

### When Logged In as User
- [ ] Navbar shows dashboard icon (📊)
- [ ] Navbar shows "Hi, John"
- [ ] Navbar shows "Logout" button
- [ ] Dashboard icon links to `/dashboard`
- [ ] Logout button works

---

## Test 9: Authentication Persistence

### Steps
1. [ ] Login as admin
2. [ ] Refresh the page (F5)
3. [ ] Expected: Still logged in, still on `/admin`
4. [ ] Logout
5. [ ] Login as regular user
6. [ ] Refresh the page (F5)
7. [ ] Expected: Still logged in, still on `/dashboard`

---

## Test 10: Error Handling

### Invalid Login
1. [ ] Go to `/login`
2. [ ] Enter wrong password
3. [ ] Expected: Error toast appears
4. [ ] Still on login page

### Invalid Registration
1. [ ] Go to `/signup`
2. [ ] Try to register with existing email
3. [ ] Expected: Error toast "User already exists"
4. [ ] Still on signup page

### Short Password
1. [ ] Go to `/signup`
2. [ ] Enter password less than 6 characters
3. [ ] Expected: Error toast "Password must be at least 6 characters"

---

## Test 11: API Integration

### Check Network Tab
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Login as admin
4. [ ] Verify API calls:
   - [ ] POST `/api/auth/login` returns 200
   - [ ] Response includes `accessToken`
   - [ ] Response includes user data with `role: "ADMIN"`
5. [ ] Login as user
6. [ ] Verify API calls:
   - [ ] POST `/api/auth/login` returns 200
   - [ ] Response includes user data with `role: "USER"`

---

## Test 12: Database Verification

### Check MongoDB
1. [ ] Open MongoDB Compass or Atlas
2. [ ] Connect to your database
3. [ ] Find the `users` collection
4. [ ] Verify admin user:
   - [ ] Email: `mohitrathod740@gmail.com`
   - [ ] Role: `ADMIN`
   - [ ] Password is hashed
5. [ ] Verify regular user:
   - [ ] Email: `john@example.com`
   - [ ] Role: `USER`
   - [ ] Password is hashed

---

## Test 13: Mobile Responsiveness

### Steps
1. [ ] Open browser DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Test on different screen sizes:
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1920px)
4. [ ] Verify:
   - [ ] Navbar adapts to screen size
   - [ ] Dashboard cards stack properly
   - [ ] Forms are usable
   - [ ] Buttons are clickable

---

## Test 14: Security Checks

### JWT Token
1. [ ] Login as any user
2. [ ] Open DevTools → Application → Local Storage
3. [ ] Verify:
   - [ ] `accessToken` is stored
   - [ ] `refreshToken` is stored
4. [ ] Logout
5. [ ] Verify:
   - [ ] Tokens are removed from localStorage

### Protected Routes
1. [ ] Logout (clear all tokens)
2. [ ] Try to access `/admin` directly
3. [ ] Expected: Redirected to `/login`
4. [ ] Try to access `/dashboard` directly
5. [ ] Expected: Redirected to `/login`

---

## Test 15: Change Admin Email

### Steps
1. [ ] Stop backend server
2. [ ] Edit `backend/.env`
3. [ ] Change `ADMIN_EMAIL=newemail@example.com`
4. [ ] Save file
5. [ ] Restart backend server
6. [ ] Register with new email
7. [ ] Expected: New email gets ADMIN role
8. [ ] Old admin email should now be USER role (if re-registered)

---

## Final Verification

### Documentation
- [ ] `ADMIN_SETUP.md` exists and is readable
- [ ] `IMPLEMENTATION_SUMMARY.md` exists and is readable
- [ ] `QUICK_START.md` exists and is readable
- [ ] `COMPLETE.md` exists and is readable
- [ ] `FLOW_DIAGRAM.md` exists and is readable
- [ ] `TESTING_CHECKLIST.md` (this file) exists

### Code Quality
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] All imports are correct
- [ ] No TypeScript errors (if applicable)

### Functionality
- [ ] Admin email gets admin access ✅
- [ ] Other emails get user access ✅
- [ ] Role-based routing works ✅
- [ ] Protected routes work ✅
- [ ] Navbar updates based on role ✅
- [ ] Dashboards display correctly ✅
- [ ] Logout works ✅
- [ ] Authentication persists ✅

---

## 🎉 All Tests Passed?

If all checkboxes are checked, congratulations! 🎊
Your role-based access control system is fully functional!

### Summary
- ✅ Admin email: `mohitrathod740@gmail.com`
- ✅ Admin access: `/admin` dashboard
- ✅ User access: `/dashboard` only
- ✅ Role stored in: `.env` file
- ✅ Fully integrated: Frontend + Backend + Database

---

## 🐛 Troubleshooting

### If tests fail, check:
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. MongoDB is accessible
4. `.env` files are configured correctly
5. No typos in admin email
6. Browser cache is cleared
7. localStorage is cleared
8. No CORS errors in console

### Common Issues:
- **401 Unauthorized**: Check JWT token in localStorage
- **403 Forbidden**: Check user role in Redux state
- **404 Not Found**: Check API URL in frontend .env
- **CORS Error**: Check CORS_ORIGIN in backend .env
- **Connection Error**: Check MongoDB connection string

---

## 📞 Need Help?

Refer to:
- `QUICK_START.md` for setup instructions
- `ADMIN_SETUP.md` for configuration
- `FLOW_DIAGRAM.md` for system architecture
- `IMPLEMENTATION_SUMMARY.md` for technical details
