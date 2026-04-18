# Smart Hostel Management System

## Description
A comprehensive MERN stack (MongoDB, Express, React, Node.js) application tailored for modern hostel and dorm management. This system streamlines room allocations, handles student complaints efficiently, manages hostel maintenance tasks, and provides a multi-role dashboard for students, wardens, maintenance staff, and system administrators. By automating daily hostel operations, the system guarantees a smoother and more transparent living experience for students and manageable workflows for administration.

## Essential Features
- **Role-Based Access Control (RBAC):** Distinct dashboards explicitly designed for Students, Wardens, Maintenance Staff, and Admins.
- **Complaint Automation System:** Students can log and track issues (e.g., plumbing, electrical) that can be easily categorized, assigned, and resolved.
- **Room Management & Allocation:** Wardens and Admins can seamlessly allocate rooms, monitor occupancy, and manage room statuses (available, occupied, maintenance).
- **Maintenance Task Scheduling:** Assign staff to specific complaints with scheduled dates and progress tracking.
- **Real-Time Dashboards:** Aesthetic and dynamic UI featuring analytics, progress tracking, and key overview stats.
- **Secure Authentication:** JWT-based user authentication spanning protected routes.

## Tech Stack
- **Frontend:** React.js, React Router DOM, Axios, Custom CSS (Inter Font, CSS variables, sleek UI design system)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## File Structure
```text
hostel-mern/
├── backend/                  # Server-side code (Node.js & Express)
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middlewares (e.g., JWT Auth)
│   ├── models/               # Mongoose database schemas
│   ├── routes/               # API endpoint definitions
│   ├── .env.example          # Sample environment variables
│   ├── seed.js               # Database seeding script
│   └── server.js             # Express application entry point
│
├── frontend/                 # Client-side code (React)
│   ├── public/               # Static files and root HTML
│   ├── src/
│   │   ├── components/       # Reusable UI components (NavBar, styled elements)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Distinct dashboards and Views (Login, Register, Admin, etc.)
│   │   ├── api.js            # Axios configuration & interceptors
│   │   ├── App.js            # Main React component and Route guarding
│   │   └── index.css         # Global design system & style properties
│   └── package.json          # Frontend dependencies
│
└── package.json              # Root project configs (using concurrently to run both ends)
```

## How to Start the Application

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) installed and running locally, or have access to a MongoDB Atlas cluster URI.

### 2. Environment Variables Setup
Navigate to the `backend/` directory and configure your environment variables.
```bash
cd backend
cp .env.example .env
```
Ensure your new `.env` file reflects your appropriate credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
```

### 3. Install Dependencies
You need to install packages for the root project, the backend, and the frontend.
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Running the Project Locally
**Crucial Step:** You **must** start MongoDB before running the application.

1. Open a terminal and start the MongoDB service if it doesn't start automatically:
   - **Windows:** Run `net start MongoDB` as Administrator, or start it via the Services app.
   - **Linux/macOS:** Run `sudo systemctl start mongod` or `brew services start mongodb-community`.
   
2. Once MongoDB is active, traverse back to the root folder `hostel-mern/` and run the development environment using node `concurrently` (which will spin up **both** the backend and frontend simultaneously):
```bash
# Go to root directory
cd ../

# Start the application
npm run dev
```

The React frontend will be accessible at `http://localhost:3000` and the Node backend will run on `http://localhost:5000`.

### 5. Seeding the Database (Optional)
If you want to populate the database with initial fake data to test out testing operations and layouts:
```bash
cd backend
node seed.js
```

## How to Use the Application (Roles & Capabilities)

The application provides different capabilities depending on the role of the logged-in user.

### 🧑‍🎓 Students
- **Registration:** Students register with their details and are subsequently allocated to a room.
- **Submit Complaints:** Can log varying issues (plumbing, electrical, Wi-Fi).
- **Track Status:** Monitor whether a complaint is 'Open', 'In Progress', or 'Resolved', and view staff notes and scheduled repair dates.

### 🛡️ Wardens
- **Dashboard Overview:** Monitor all active complaints across the hostel.
- **Room Allocations:** Assign new or existing students to available rooms and keep track of overall occupancy.
- **Task Assignment:** Assign 'Open' complaints to specific Maintenance Staff, set priority, and select an expected completion date.

### 🔧 Maintenance Staff
- **Assigned Tasks:** View issues that have been assigned to them by a Warden.
- **Schedule Management:** See upcoming repairs and track overdue statuses.
- **Update Progress:** Mark tasks as 'Resolved' and leave context notes about fixes performed.

### 👑 Administrators
- **System Overview:** Have a bird's-eye view of all statistics, ongoing complaints, students, and active maintenance tasks.
- **User Management:** Can view all registered accounts and have the authority to remove users.
- **Room Management:** Add new rooms to the system, update capacities, and forcefully change room statuses (e.g., locking a room down for 'maintenance').
