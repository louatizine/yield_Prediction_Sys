# 🌾 Yield Prediction System - Authentication Setup

Complete authentication system with FastAPI backend and React frontend.

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure MongoDB:**
   - Edit `backend/.env` file
   - Add your MongoDB Atlas URL:
```env
MONGODB_URL=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=yield_prediction_db
SECRET_KEY=your-secret-key-here
```

4. **Run the backend:**
```bash
python main.py
```
Backend will run on: http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies (if not already installed):**
```bash
npm install
```

3. **Run the frontend:**
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## 📁 Project Structure

```
yield_Prediction_Sys/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── .env                    # Environment variables
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── user.py            # User Pydantic models
│   ├── routes/
│   │   └── auth.py            # Authentication routes
│   └── utils/
│       ├── auth.py            # JWT & password utilities
│       └── database.py        # MongoDB connection
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main app with routing
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── services/
    │   │   └── authService.js     # API calls
    │   └── pages/
    │       ├── Login.jsx          # Login page
    │       ├── Register.jsx       # Registration page
    │       ├── Dashboard.jsx      # Protected dashboard
    │       ├── Auth.css           # Auth page styles
    │       └── Dashboard.css      # Dashboard styles
    └── package.json

```

## 🔑 Features

### Backend (FastAPI)
- ✅ User registration with email validation
- ✅ User login with JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB Atlas integration
- ✅ CORS configuration for frontend
- ✅ Protected routes with JWT verification

### Frontend (React + Vite)
- ✅ Beautiful login/register interfaces
- ✅ Form validation
- ✅ Protected routes
- ✅ JWT token management
- ✅ User state management with Context API
- ✅ Responsive design with gradients

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /` - API status
- `GET /health` - Health check

## 📝 Testing

1. **Start both servers:**
   - Backend: `python backend/main.py`
   - Frontend: `cd frontend && npm run dev`

2. **Register a new account:**
   - Go to http://localhost:5173
   - Click "Sign up"
   - Fill in the registration form

3. **Login:**
   - Use your registered credentials
   - You'll be redirected to the dashboard

4. **View API docs:**
   - http://localhost:8000/docs (Swagger UI)
   - http://localhost:8000/redoc (ReDoc)

## 🔐 Security Notes

- Change `SECRET_KEY` in `.env` for production
- Use strong passwords (min 6 characters)
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt

## 🎨 UI Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Form validation with error messages
- Responsive design
- Protected dashboard
- User profile display

## 📦 Dependencies

### Backend
- FastAPI - Web framework
- Motor - Async MongoDB driver
- PyMongo - MongoDB driver
- python-jose - JWT handling
- passlib - Password hashing
- pydantic - Data validation

### Frontend
- React - UI library
- React Router - Navigation
- Axios - HTTP client
- Vite - Build tool

## 🚧 Next Steps

Add more features to the dashboard:
- Crop recommendation
- Disease detection
- Yield prediction
- User profile management

Enjoy your authentication system! 🎉
