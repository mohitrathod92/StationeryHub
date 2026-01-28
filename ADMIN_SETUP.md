# Admin Access Configuration

## Overview
This application implements role-based access control where only the admin email can access the admin dashboard.

## Admin Email Configuration

The admin email is stored in the backend `.env` file:

```env
ADMIN_EMAIL=mohitrathod740@gmail.com
```

## How It Works

### Backend (Already Implemented)
1. **Registration**: When a user registers with the admin email (`mohitrathod740@gmail.com`), they are automatically assigned the `ADMIN` role in the database.
2. **Login**: The backend returns the user's role in the login response.
3. **Authorization**: Admin-only routes are protected with the `authorizeAdmin` middleware.

### Frontend (Already Implemented)
1. **Login/Signup**: Uses Redux to authenticate users and store their role.
2. **Protected Routes**: 
   - Admin users are redirected to `/admin` (AdminDashboard)
   - Regular users are redirected to `/dashboard` (UserDashboard)
3. **Navigation**: The navbar shows a dashboard link based on the user's role.

## Testing

### Admin Access
1. Sign up or login with: `mohitrathod740@gmail.com`
2. You will be redirected to `/admin` (Admin Dashboard)
3. You can access all admin features

### Regular User Access
1. Sign up or login with any other email (e.g., `user@example.com`)
2. You will be redirected to `/dashboard` (User Dashboard)
3. You cannot access `/admin` routes

## Changing the Admin Email

To change the admin email:
1. Update the `ADMIN_EMAIL` in `backend/.env`
2. Restart the backend server
3. Register a new account with the new admin email

## Security Notes
- The admin email is stored in environment variables (not hardcoded)
- Role assignment happens during registration based on email match
- All admin routes are protected with middleware
- Frontend routes are protected with role-based guards
