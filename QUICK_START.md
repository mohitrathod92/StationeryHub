# Quick Start Guide

## Start the Application

### 1. Start Backend
```bash
cd backend
npm install
npm start
```
Backend will run on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

## Test Admin Access

### Sign Up as Admin
1. Go to: `http://localhost:5173/signup`
2. Fill in the form:
   - First Name: `Mohit`
   - Last Name: `Rathod`
   - Email: `mohitrathod740@gmail.com` ⭐ (Admin Email)
   - Password: `password123` (or any password)
3. Click "Create Account"
4. ✅ You will be redirected to `/admin` (Admin Dashboard)

### Login as Admin
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `mohitrathod740@gmail.com`
   - Password: (your password)
3. Click "Sign In"
4. ✅ You will be redirected to `/admin` (Admin Dashboard)

## Test Regular User Access

### Sign Up as Regular User
1. Go to: `http://localhost:5173/signup`
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com` (any email except admin)
   - Password: `password123`
3. Click "Create Account"
4. ✅ You will be redirected to `/dashboard` (User Dashboard)

### Login as Regular User
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `john@example.com`
   - Password: (your password)
3. Click "Sign In"
4. ✅ You will be redirected to `/dashboard` (User Dashboard)

## Verify Role-Based Access

### As Admin User
- ✅ Can access: `/admin`
- ✅ Navbar shows dashboard icon → links to `/admin`
- ✅ Can access all admin features

### As Regular User
- ✅ Can access: `/dashboard`, `/wishlist`
- ✅ Navbar shows dashboard icon → links to `/dashboard`
- ❌ Cannot access: `/admin` (will redirect to `/dashboard`)

## Change Admin Email

To use a different admin email:

1. Edit `backend/.env`:
```env
ADMIN_EMAIL=newemail@example.com
```

2. Restart backend server
3. Sign up with the new email
4. ✅ New email will have admin access

## Troubleshooting

### Backend not connecting to database
- Check `DATABASE_URL` in `backend/.env`
- Ensure MongoDB is accessible

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`
- Ensure CORS_ORIGIN in backend matches frontend URL

### User not getting admin role
- Verify email exactly matches `ADMIN_EMAIL` in `backend/.env`
- Check for typos or extra spaces
- Restart backend after changing `.env`

### Token/Authentication issues
- Clear browser localStorage
- Logout and login again
- Check browser console for errors

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get current user (requires token)

### Admin Only
- GET `/api/admin/stats` - Get admin statistics
- GET `/api/users` - Get all users
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### User Only
- GET `/api/dashboard/user` - Get user dashboard
- GET `/api/wishlist` - Get user wishlist
- POST `/api/orders` - Create order

## Environment Variables

### Backend `.env`
```env
ADMIN_EMAIL=mohitrathod740@gmail.com
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Success Indicators

✅ Admin user sees "Admin Dashboard" page at `/admin`
✅ Regular user sees "User Dashboard" page at `/dashboard`
✅ Navbar shows correct dashboard link based on role
✅ Unauthorized access attempts are redirected
✅ User's first name appears in navbar
✅ Logout works correctly
