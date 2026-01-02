# 🌾 AgriSmart - Yield Prediction System

A comprehensive Smart Agriculture Decision Support System that leverages Machine Learning and AI to help farmers make data-driven decisions for crop recommendation, fertilizer optimization, and plant disease detection.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Models](#models)
- [Contributing](#contributing)

## 🎯 Overview

AgriSmart is an intelligent agricultural platform that provides:
- **Crop Recommendation**: AI-powered suggestions based on soil nutrients (N, P, K), climate conditions, and pH levels
- **Fertilizer Optimization**: Smart fertilizer recommendations tailored to specific crops and soil conditions
- **Disease Detection**: Real-time plant disease identification using computer vision (38+ disease classes)
- **Prediction History**: Track all past recommendations and analyses
- **Interactive Dashboard**: Visualize yield trends, crop distribution, and performance metrics

## ✨ Features

### 🌱 Core Functionality
- **Machine Learning Models**
  - XGBoost for crop and fertilizer predictions (7 input features)
  - ResNet18-based CNN for disease detection (~99% accuracy)
  - Real-time inference with sub-second response times

- **User Management**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - User-specific prediction history

- **Modern UI/UX**
  - Responsive dashboard with real-time KPIs
  - Interactive charts (yield trends, crop distribution)
  - Mobile-friendly design with Tailwind CSS
  - Collapsible sidebar with smooth animations

- **Data Visualization**
  - Live weather conditions widget
  - Recent activity timeline
  - Performance metrics with loading states
  - Gradient-styled components

### 📊 Dashboard Features
- **KPI Cards**: Total Predictions, Crops Analyzed, Diseases Detected, Avg Yield Increase
- **Yield Trends Chart**: 6-month historical data visualization
- **Crop Distribution**: Donut chart showing crop variety breakdown
- **Weather Widget**: Real-time temperature, humidity, rainfall, soil moisture
- **Activity Feed**: Recent predictions with timestamps

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: MongoDB Atlas (cloud-hosted)
- **ML Libraries**: 
  - XGBoost (crop/fertilizer prediction)
  - TensorFlow/Keras (disease detection)
  - PyTorch (model training)
- **Authentication**: JWT tokens with python-jose
- **Validation**: Pydantic models

### Frontend
- **Framework**: React 19.2 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios
- **State Management**: React Context API (AuthContext)
- **Icons**: React Icons

### DevOps
- **Version Control**: Git/GitHub
- **Environment**: .env for configuration
- **CORS**: Enabled for local development
- **Hot Reload**: Vite HMR, Uvicorn auto-reload

## 📁 Project Structure

```
yield_Prediction_Sys/
├── backend/
│   ├── main.py                    # FastAPI application entry
│   ├── requirements.txt           # Python dependencies
│   ├── models/                    # Pydantic schemas
│   │   ├── user.py
│   │   ├── prediction.py
│   │   └── disease.py
│   ├── routes/                    # API endpoints
│   │   ├── auth.py               # Login/Register
│   │   ├── predictions.py        # Crop/Fertilizer
│   │   └── disease.py            # Disease detection
│   ├── services/                  # Business logic
│   │   ├── ml_model.py           # XGBoost inference
│   │   └── disease_detection.py  # CNN inference
│   └── utils/                     # Helpers
│       ├── auth.py               # JWT handling
│       └── database.py           # MongoDB connection
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Button.jsx
│   │   │   └── ...
│   │   ├── pages/                # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CropRecommendation.jsx
│   │   │   ├── FertilizerRecommendation.jsx
│   │   │   └── DiseaseDetection.jsx
│   │   ├── services/             # API calls
│   │   │   ├── authService.js
│   │   │   ├── predictionService.js
│   │   │   └── diseaseService.js
│   │   └── context/
│   │       └── AuthContext.jsx   # Global auth state
│   ├── package.json
│   └── vite.config.js
├── models/
│   ├── plant-disease-model.pth   # PyTorch model (gitignored)
│   └── README_MODEL_GENERATION.md
├── notebooks/                     # Jupyter notebooks for training
├── Data-processed/                # Cleaned datasets
└── Data-raw/                      # Original datasets
```

## 🚀 Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/louatizine/yield_Prediction_Sys.git
cd yield_Prediction_Sys/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration**
Create `.env` file in `backend/` directory:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=agrismart
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. **Download ML Models**
Place trained models in `models/` directory:
- `plant-disease-model.pth` (PyTorch disease detection model)
- Train models using notebooks in `notebooks/` if needed

6. **Run Backend Server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL**
Update `src/services/*.js` if needed (default: `http://localhost:8000`)

4. **Run Development Server**
```bash
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## 📖 Usage

### 1. **Register/Login**
- Navigate to `http://localhost:5173`
- Create an account or login
- JWT token is stored in localStorage

### 2. **Dashboard**
- View real-time statistics
- Monitor recent activities
- Check weather conditions
- Navigate to prediction services

### 3. **Crop Recommendation**
- Input soil nutrients (N, P, K)
- Enter climate data (temperature, humidity, rainfall)
- Add soil pH
- Get AI-powered crop suggestion
- View prediction history

### 4. **Fertilizer Recommendation**
- Provide current soil NPK levels
- Select target crop
- Input climate conditions
- Receive optimized fertilizer recommendation

### 5. **Disease Detection**
- Upload plant leaf image (JPG, PNG)
- Get instant disease identification
- View confidence scores
- See top 3 predictions
- Receive treatment recommendations

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Predictions
```http
POST /api/predict/crop
POST /api/predict/fertilizer
GET  /api/predict/crop/history
GET  /api/predict/fertilizer/history
```

### Disease Detection
```http
POST /api/disease/detect
GET  /api/disease/history
```

### Request Example (Crop Prediction)
```json
POST /api/predict/crop
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.5,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 202
}
```

### Response Example
```json
{
  "success": true,
  "crop": "Rice",
  "crop_id": 11,
  "message": "Based on the provided soil and climate conditions, Rice is recommended for cultivation."
}
```

## 🤖 Models

### Crop & Fertilizer Prediction
- **Algorithm**: XGBoost
- **Features**: 7 (N, P, K, temperature, humidity, pH, rainfall)
- **Training Data**: `Data-processed/crop_recommendation.csv`
- **Classes**: 22 crops
- **Accuracy**: ~98%

### Disease Detection
- **Architecture**: ResNet18 (transfer learning)
- **Input**: 224x224 RGB images
- **Classes**: 38 plant diseases
- **Accuracy**: ~99% validation
- **Training**: See `notebooks/plant-disease-classification-resnet.ipynb`
- **Supported Plants**: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

### Model Files (Not Tracked in Git)
```
models/
├── plant-disease-model.pth        # Disease detection (large file)
└── README_MODEL_GENERATION.md     # Training instructions
```

**Note**: Model files are gitignored due to size. Train locally using provided notebooks or request models separately.

## 🎨 UI Components

- **Gradient Buttons**: Modern, animated action buttons
- **KPI Cards**: Real-time statistics with loading states
- **Interactive Charts**: Yield trends and crop distribution visualizations
- **Collapsible Sidebar**: Desktop and mobile responsive navigation
- **Notification System**: Bell icon with unread count badge
- **Form Validation**: Client and server-side error handling
- **Loading States**: Spinners and skeleton screens

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes with dependencies
- CORS configuration for production
- Environment variable management
- Input validation with Pydantic

## 🌐 Deployment

### Backend (FastAPI)
- Deploy to: Heroku, AWS EC2, DigitalOcean, Render
- Requirements: Python 3.12, MongoDB Atlas connection
- Environment variables configured in hosting platform

### Frontend (React)
- Deploy to: Vercel, Netlify, GitHub Pages
- Build command: `npm run build`
- Output directory: `dist`

### MongoDB
- Using MongoDB Atlas (cloud-hosted)
- Connection string in environment variables
- Database name: `agrismart`

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

**Zineddine Louati**
- GitHub: [@louatizine](https://github.com/louatizine)
- Email: zineedinelouati.2000@gmail.com

## 🙏 Acknowledgments

- Dataset sources: Kaggle Agriculture datasets
- Pre-trained models: PyTorch/TensorFlow model zoos
- UI inspiration: Modern SaaS dashboards
- Icons: React Icons library

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: zineedinelouati.2000@gmail.com

---

**Made with ❤️ By Zine eddine  for farmers and agricultural innovation**
