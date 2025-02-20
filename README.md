# Student Management & Teacher-Student Platform

A comprehensive web application that enables teachers to create and manage courses, assignments, and student enrollment. Students can submit assignments (text-based or file uploads), view their grades, and manage their coursework. This project demonstrates a full-stack approach using **Node.js**, **Express**, **MongoDB**, and **React** (with Material-UI, react-chartjs-2, etc.) for a robust, real-world solution.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Key Highlights](#key-highlights)
- [Setup & Installation](#setup--installation)
- [Usage & Workflows](#usage--workflows)
  - [Student Workflow](#student-workflow)
  - [Teacher Workflow](#teacher-workflow)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

1. **User Authentication & Role-Based Access**

   - Secure login and registration flow using JWT.
   - Teachers and Students have separate functionality and dashboards.

2. **Course Management**

   - Teachers can create courses, add descriptions, and enroll students by email.
   - Students see only the courses they’re enrolled in.

3. **Assignment Management**

   - Teachers can create detailed assignments (title, description, questions, max points).
   - Students see upcoming assignments in a split dashboard view with bar charts and deadlines.

4. **Submission & Grading**

   - Students can submit assignments as text or file uploads.
   - Teachers can grade each submission once, add feedback, and lock regrading.

5. **File Upload**

   - Multer-based file handling allows PDF, images, or other formats (configurable) to be uploaded for assignment submissions.

6. **Filtering & Searching**

   - Teachers can sort and filter submissions by “graded” or “not graded.”
   - Searching by student name streamlines grading large classes.

7. **Notification & Profile**
   - Notification system and user profile page (optional) to showcase user information.

---

## Tech Stack

- **Frontend**

  - **React**: A popular library for building dynamic user interfaces.
  - **React Router**: For single-page application navigation.
  - **Material-UI (MUI)**: Offers a modern, responsive design out-of-the-box.
  - **react-chartjs-2** & **Chart.js**: Visualizing data (e.g., the number of assignments or upcoming deadlines).
  - **Axios**: For making HTTP requests to the backend.

- **Backend**

  - **Node.js** & **Express**: Building RESTful APIs for authentication, course management, and assignment handling.
  - **Mongoose**: ODM for MongoDB, handling schemas and database queries.
  - **Multer**: For handling file uploads (assignment submissions).
  - **JWT (JSON Web Tokens)**: Securing routes with role-based authorization.

- **Database**
  - **MongoDB**: A NoSQL document database, storing courses, users, and submissions.

---

## Key Highlights

- **Role-Based Flow**: The UI and API endpoints distinguish between Teacher and Student roles, ensuring each sees only relevant features.
- **One Submission, One Grade**: Students can’t resubmit once they’ve submitted, and teachers can’t re-grade once a grade is assigned.
- **Split Dashboard for Students**: Visual charts and upcoming deadlines help students manage their workload effectively.
- **Easy Extensibility**: Additional features (notifications, comment boards, etc.) can be plugged in without overhauling the core structure.

---

## Setup & Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/student-management-system.git
   cd student-management-system
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

   - Ensure you have a `.env` file with `MONGO_URI`, `JWT_SECRET`, etc.

3. **Start the Backend Server**

   ```bash
   npm start
   ```

   or (if you use Nodemon):

   ```bash
   npm run dev
   ```

4. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the Frontend (Vite, CRA, etc.)**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the port specified by Vite).

---

## Usage & Workflows

### Student Workflow

1. **Login or Register**

   - Upon registration, choose the “student” role.
   - Log in to access the student dashboard.

2. **View Your Courses**

   - “Courses” page shows all enrolled courses.
   - Clicking a course navigates to the split dashboard (bar chart overview & upcoming deadlines, plus assignment list).

3. **Submit Assignments**

   - Clicking an assignment opens a submission page where you can type text or upload a file.
   - If you already submitted, you’ll see your submission and any grade/feedback.

4. **View Grades**
   - Once the teacher grades your submission, the assignment page displays your grade and optional feedback.

### Teacher Workflow

1. **Login as Teacher**

   - After registration, choose the “teacher” role.
   - The “Dashboard” lists all courses you created.

2. **Manage Courses**

   - Clicking a course opens a page to see enrolled students and assignments.
   - Add new students (by email) or create new assignments (title, description, questions, etc.) via plus buttons and dialogs.

3. **View Submissions**

   - Clicking an assignment navigates to a detail page listing each student’s submission status.
   - Filter “graded” or “not graded,” or search by student name.

4. **Grade Submissions**
   - Click a student submission to open the grading page, view text or file, then assign a one-time grade and feedback.

---

## Future Improvements

- **Comments & Forums**: Enable students and teachers to discuss assignments, share questions, etc.
- **Bulk Enrollment**: Support CSV uploads for adding multiple students at once.
- **Email Notifications**: Automatically email students about upcoming deadlines or newly graded submissions.
- **Admin Role**: Add an admin dashboard to oversee users, courses, and advanced analytics.
- **Full File Management**: Store files in a cloud service (S3, Cloudinary) for scalable storage rather than local disk.
