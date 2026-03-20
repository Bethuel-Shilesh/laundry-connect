# 🧺 Laundry Connect  
### 🚀 Your Laundry, Our Priority  

A **full-stack smart laundry marketplace** that connects customers with nearby laundry service providers.  
Customers can discover, book, and track laundry orders, while shop owners manage their business through a dedicated dashboard.  
Admins oversee the platform with analytics, approvals, and system-wide controls.

---

## 🚧 Project Status: Work in Progress
This project is actively being developed. Core backend functionalities are completed, and frontend + deployment are in progress.

---

## 🛠️ Tech Stack

### 👨‍💻 Core Technologies
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![bcrypt](https://img.shields.io/badge/bcrypt-grey?style=for-the-badge)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly)

---

## ✨ Features

### 👤 Customers
- 🔍 Search and browse nearby laundry shops  
- 📦 Book services with pickup & delivery scheduling  
- 📊 Track orders *(Pending → Washing → Delivered)*  
- ⭐ Leave ratings and reviews  

### 🏪 Shop Owners
- 📝 Register and manage services with pricing  
- 📥 Accept and update incoming orders  
- 📈 View revenue and order statistics  

### 👑 Admin Panel
- ✅ Approve or reject shop registrations  
- 👥 Manage platform users  
- 📊 Monitor platform analytics and insights  

---

## 🗄️ Database Schema
`users` · `laundry_shops` · `services` · `orders` · `reviews` · `payments`

---

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /auth/register`
- `POST /auth/login`

### 🏪 Shops & Services
- `GET /shops/`
- `POST /shops/`
- `PUT /shops/{id}`
- `POST /services/`

### 📦 Orders
- `POST /orders/`
- `PUT /orders/{id}/status`

### ⭐ Reviews & Payments
- `POST /reviews/`
- `POST /payments/`

### 👑 Admin
- `GET /admin/stats`
- `PUT /admin/shops/{id}/approve`

---

## 🚀 Run Locally

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary passlib python-jose python-multipart python-dotenv bcrypt "pydantic[email]"
uvicorn laundry.main:app --reload
