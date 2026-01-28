# 🎯 Role-Based Access Control Implementation

## Overview
This project implements a complete role-based access control system where the admin email (`mohitrathod740@gmail.com`) has access to the admin dashboard, while all other users only have access to the user section.

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Admin Access
- Sign up with: `mohitrathod740@gmail.com`
- You'll be redirected to `/admin` (Admin Dashboard)

### 4. Test User Access
- Sign up with any other email
- You'll be redirected to `/dashboard` (User Dashboard)

---

## 📚 Documentation

### Essential Guides
1. **[QUICK_START.md](./QUICK_START.md)** - Quick testing guide
2. **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Admin configuration
3. **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Complete testing checklist

### Technical Documentation
4. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Detailed implementation
5. **[FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md)** - System architecture diagrams
6. **[COMPLETE.md](./COMPLETE.md)** - Implementation completion summary

---

## 🎯 Key Features

### ✅ Admin Access
- Email: `mohitrathod740@gmail.com`
- Access: Admin Dashboard (`/admin`)
- Features:
  - View all users
  - Manage orders
  - View statistics
  - Manage products

### ✅ User Access
- Email: Any other email
- Access: User Dashboard (`/dashboard`)
- Features:
  - View personal orders
  - Manage wishlist
  - Shopping features

### ✅ Security
- Admin email stored in `.env` (not hardcoded)
- Role assigned during registration
- JWT authentication with role info
- Protected routes (frontend + backend)
- Password hashing with bcrypt

---

## 🔧 Configuration

### Backend Environment (`.env`)
```env
DATABASE_URL=mongodb+srv://...
ADMIN_EMAIL=mohitrathod740@gmail.com
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

### Frontend Environment (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 System Architecture

```
User Registration
       ↓
Check Email == ADMIN_EMAIL?
       ↓
   Yes → ADMIN Role
   No  → USER Role
       ↓
Save to Database
       ↓
Generate JWT Token
       ↓
Return to Frontend
       ↓
ADMIN → /admin
USER  → /dashboard
```

---

## 🧪 Testing

### Test Admin
1. Sign up: `mohitrathod740@gmail.com`
2. ✅ Redirected to `/admin`
3. ✅ See admin dashboard
4. ✅ Access admin features

### Test User
1. Sign up: `user@example.com`
2. ✅ Redirected to `/dashboard`
3. ✅ See user dashboard
4. ❌ Cannot access `/admin`

---

## 📁 Project Structure

```
stationery-haven-main/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js (Role assignment logic)
│   │   ├── middlewares/
│   │   │   └── auth.js (Route protection)
│   │   └── routes/
│   │       └── api.js (API routes)
│   ├── prisma/
│   │   └── schema.prisma (Database schema with Role enum)
│   └── .env (Admin email configuration)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx (Redux integration)
│   │   │   ├── Signup.tsx (Redux integration)
│   │   │   ├── AdminDashboard.tsx (Admin only)
│   │   │   └── UserDashboard.tsx (User only)
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Navbar.tsx (Role-based navigation)
│   │   ├── redux/
│   │   │   └── slices/
│   │   │       └── authSlice.ts (Authentication state)
│   │   └── App.tsx (Route protection)
│   └── .env (API URL)
│
└── Documentation/
    ├── ADMIN_SETUP.md
    ├── QUICK_START.md
    ├── TESTING_CHECKLIST.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── FLOW_DIAGRAM.md
    └── COMPLETE.md
```

---

## 🔐 Security Features

- ✅ Environment-based admin email
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based middleware protection
- ✅ Frontend route guards
- ✅ Token refresh mechanism
- ✅ CORS configuration
- ✅ Secure token storage

---

## 🎨 User Experience

### Admin Flow
```
Login → Admin Dashboard → Manage Users/Orders/Products
```

### User Flow
```
Login → User Dashboard → Shop/Wishlist/Orders
```

### Navigation
- Navbar shows role-based dashboard link
- User name displayed in navbar
- Logout functionality
- Mobile responsive

---

## 🛠️ Technologies Used

### Backend
- Node.js + Express
- MongoDB + Prisma ORM
- JWT for authentication
- Bcrypt for password hashing
- Express Validator

### Frontend
- React + TypeScript
- Redux Toolkit (state management)
- React Router (routing)
- Tailwind CSS (styling)
- Vite (build tool)

---

## 📝 Change Admin Email

To use a different admin email:

1. Edit `backend/.env`:
```env
ADMIN_EMAIL=newemail@example.com
```

2. Restart backend server
3. Sign up with new email
4. ✅ New email will have admin access

---

## ✅ Implementation Status

- ✅ Backend role assignment
- ✅ Frontend authentication
- ✅ Role-based routing
- ✅ Protected routes
- ✅ Admin dashboard
- ✅ User dashboard
- ✅ Navbar integration
- ✅ Database schema
- ✅ Environment configuration
- ✅ Documentation

---

## 🐛 Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify `.env` configuration
- Check port 5000 is available
- Review backend logs

### Frontend Issues
- Check API URL in `.env`
- Verify backend is running
- Clear browser cache
- Check browser console

### Authentication Issues
- Clear localStorage
- Check JWT token
- Verify admin email spelling
- Restart both servers

---

## 📞 Support

For detailed help, refer to:
- **Setup**: [QUICK_START.md](./QUICK_START.md)
- **Configuration**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Testing**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
- **Architecture**: [FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md)
- **Technical**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🎉 Success Criteria

✅ Admin email (`mohitrathod740@gmail.com`) has admin access
✅ Other emails have user access only
✅ Admin email stored in `.env` file
✅ Fully functional with frontend, backend, and database
✅ Role-based routing works correctly
✅ Protected routes prevent unauthorized access
✅ Documentation is complete

---

## 📄 License

This project is part of the Stationery Haven e-commerce application.

---

## 👨‍💻 Developer Notes

### Admin Email
- Current: `mohitrathod740@gmail.com`
- Stored in: `backend/.env`
- Can be changed anytime

### Database
- MongoDB with Prisma ORM
- User model includes `role` field
- Role enum: `ADMIN` | `USER`

### Authentication
- JWT tokens with role info
- Access token + Refresh token
- Stored in localStorage
- Auto-refresh mechanism

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2024

---

## 🚀 Next Steps

1. Read [QUICK_START.md](./QUICK_START.md)
2. Start backend and frontend
3. Test admin access
4. Test user access
5. Review [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
6. Deploy to production (optional)

---

**Happy Coding! 🎉**
