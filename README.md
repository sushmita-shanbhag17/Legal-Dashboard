# Legal Tech Dashboard - Full Stack Application

A professional, fully-functional legal tech dashboard application built with Node.js/Express backend and React frontend. The application manages legal cases, clients, tasks, and documents with an interactive dashboard featuring charts, tables, and data visualizations.

## 🚀 Features

### Dashboard
- **Comprehensive Statistics**: Real-time overview of cases, tasks, clients, and documents
- **Interactive Charts**:
  - Case Status Distribution (Pie Chart)
  - Document Status Distribution (Pie Chart)
  - Cases by Type (Bar Chart)
  - Cases by Priority (Bar Chart)
  - Task Completion Rate (Pie Chart)
- **Summary Statistics**: Detailed breakdown of all metrics
- **Recent Cases Table**: Quick view of latest cases with status badges

### Case Management
- Add, view, update, and delete legal cases
- Filter by status, priority, and case type
- Search functionality for quick access
- Detailed case information display

### Client Management
- Manage client information (name, email, phone, address)
- Grid and table view layouts
- Search and filter capabilities
- Quick contact links

### Task Tracking
- Track tasks linked to specific cases
- Real-time progress bars (0-100% completion)
- Status tracking (Pending/Completed)
- Task statistics dashboard
- Due date management

### Document Management
- Organize documents by case
- Document status workflow (Pending → Reviewed → Approved)
- Document type categorization
- Multiple view formats (grid and table)
- Audit trail with creation dates

---

## 📋 Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin requests
- **Dotenv** - Environment configuration

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **CSS3** - Professional styling

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- MongoDB (running locally or remote)

### Backend Setup

Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Create `.env` file with:
```bash
MONGO_URI=mongodb://127.0.0.1:27017/legalDashboard
PORT=5000
```
Start the server:
```bash
npm run dev
```
*(The backend will run on http://localhost:5000)*

### Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm start
```
*(The frontend will open at http://localhost:3000)*

---

## 🗄️ Database Schema

### Collections

#### Clients
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "phone": "String",
  "address": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Cases
```json
{
  "_id": "ObjectId",
  "caseTitle": "String",
  "clientId": "ObjectId",
  "caseType": "String",
  "status": "Pending|Ongoing|Closed",
  "startDate": "Date",
  "nextHearingDate": "Date",
  "priority": "Low|Medium|High",
  "description": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Tasks
```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "taskTitle": "String",
  "dueDate": "Date",
  "status": "Pending|Completed",
  "completionPercentage": "Number (0-100)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Documents
```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "documentName": "String",
  "documentType": "String",
  "status": "Pending|Reviewed|Approved",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🔌 API Endpoints

### Seed Data
- `POST /api/seed/seed` - Populate database with sample data

### Cases
- `GET /api/cases` - Retrieve all cases
- `GET /api/cases/:id` - Get specific case
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Clients
- `GET /api/clients` - Retrieve all clients
- `GET /api/clients/:id` - Get specific client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Documents
- `GET /api/documents` - Retrieve all documents
- `GET /api/documents/:id` - Get specific document
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Health Check
- `GET /api/health` - Backend health status

---

## 🎨 UI Features

### Professional Design
- Modern gradient backgrounds
- Responsive grid layouts
- Smooth animations and transitions
- Color-coded status badges
- Clean typography and spacing

### Data Visualization
- Interactive pie charts
- Bar charts for comparisons
- Progress tracking bars
- Statistics cards with icons
- Summary tables with sorting

### User Experience
- Real-time search filtering
- Multi-criteria filtering
- Empty state messaging
- Success/error notifications
- Toggle forms for data entry
- Grid and table view options
- Responsive mobile design

---

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1400px+)
- **Tablet** (768px - 1200px)
- **Mobile** (320px - 768px)

---

## 🔐 Features Implemented

✅ Database Design (3-4 collections)  
✅ RESTful Backend API  
✅ React Frontend with Routing  
✅ Dynamic Dashboard with Charts  
✅ Search & Filter Functionality  
✅ CRUD Operations  
✅ Professional UI/UX  
✅ Responsive Design  
✅ Sample Data Seeding  
✅ Status Badge System  
✅ Progress Tracking  
✅ Data Validation  
✅ Error Handling  

---

## 🚀 Getting Started Guide

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm start
```

**Seed Sample Data:**
- Go to Dashboard tab
- Sample data will automatically seed on first load
- Or manually call: `POST /api/seed/seed`

**Navigate:**
- **Dashboard:** View all statistics and charts
- **Cases:** Manage legal cases
- **Clients:** Manage client information
- **Tasks:** Track case-related tasks
- **Documents:** Manage case documents

---

## 💡 Usage Examples

### Adding a Case
- Go to Cases page
- Click "Add New Case" button
- Fill in case details
- Select status and priority
- Click "Add Case"

### Tracking Progress
- Go to Tasks page
- Create tasks linked to cases
- Update completion percentage
- Track overall completion rate

### Managing Documents
- Go to Documents page
- Add documents for specific cases
- Track document status (Pending → Reviewed → Approved)
- View document workflow progress

---

## 🎯 Assignment Completion

This project fulfills all requirements:

**Database Setup ✅**
- MongoDB with 4 collections (Clients, Cases, Tasks, Documents)
- Flexible schema for scalability

**Backend Development ✅**
- Node.js/Express REST API
- CRUD operations on all collections
- Proper error handling

**Frontend Development ✅**
- React application with routing
- Connected to backend API
- Dynamic data loading

**Dashboard Creation ✅**
- Multiple visualizations (pie, bar charts)
- Tables for data display
- Filters and search functionality
- Interactive elements

---

## 📞 Support

For issues or questions, please check:
1. Backend logs in terminal
2. Browser console for frontend errors
3. Ensure MongoDB is running
4. Verify environment variables

## 📄 License
This project is part of a Full-Stack Web Application Development assignment for Legal Tech Dashboard.
