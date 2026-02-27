# ⚖️ Legal Tech Dashboard

A modern, full-stack MERN application designed to help law firms manage their clients, cases, tasks, and documents efficiently. This project features a beautiful dark-themed, glassmorphism UI built entirely with Vanilla CSS, complete with interactive data visualizations and comprehensive CRUD capabilities.

## ✨ Features

- **Comprehensive Dashboard:** Interactive KPI cards and charts (Pie, Bar, Area, Donut) built with `recharts` to visualize firm activity, case statuses, and task completion.
- **Full CRUD Operations:** Add, view, edit, and delete records for Clients, Cases, Documents, and Tasks with a responsive React frontend linked to a MongoDB backend.
- **Advanced Search & Filtering:** Dynamic, real-time search bars and category dropdown filters on every data table, making it easy to find specific records.
- **Premium Aesthetics:** Custom dark-mode UI utilizing glassmorphism effects, custom scrollbars, and smooth micro-animations without relying on external CSS frameworks like Tailwind.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Recharts, Lucide React (Icons), Vanilla CSS
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **HTTP Client:** Axios

## 🚀 Getting Started

To run this project locally, you will need to start both the backend API and the frontend development server. Ensure you have Node.js and MongoDB installed on your system.

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Start your local MongoDB instance if it's not already running. Then, seed the database with initial dummy data:

```bash
node seed.js
```

Start the API server (runs on `http://localhost:5000`):

```bash
node server.js
```

### 2. Frontend Setup

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Navigate to the localhost URL provided by Vite (usually `http://localhost:5173`) in your browser to view the application.

## 📁 Directory Structure

- `/backend` - Express API server, Mongoose models, and route controllers.
- `/frontend` - Vite/React frontend, layout components, pages, and CSS stylesheets.

## 🔮 Future Scope

- User Authentication & Role-based Access Control (Lawyers vs. Paralegals)
- Actual file uploads for the Documents section via AWS S3 or Cloudinary.
- Calendar integration for Task deadlines.
- Automated email notifications for case updates.

## 📄 License

This project is licensed under the MIT License.
