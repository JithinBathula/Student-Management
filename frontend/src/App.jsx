import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import StudentCourses from './components/StudentCourses';
import CourseDetail from './components/CourseDetail'; // Teacher course detail page
import StudentCourseDashboard from './components/StudentCourseDashboard'; // Student split view dashboard
import StudentAssignmentSubmission from './components/StudentAssignmentSubmission';
import TeacherAssignmentDetail from './components/TeacherAssignmentDetail';
import TeacherGradingPage from './components/TeacherGradingPage';
import Profile from './components/Profile';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  const PrivateRoute = ({ children }) => (user ? children : <Navigate to="/login" />);

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={user && user.role === 'teacher' ? "/dashboard" : "/courses"} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Teacher routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {user && user.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/courses" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <PrivateRoute>
                {user && user.role === 'teacher' ? <CourseDetail /> : <StudentCourses />}
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/assignment/:assignmentId"
            element={
              <PrivateRoute>
                {user && user.role === 'teacher' ? <TeacherAssignmentDetail /> : <Navigate to="/courses" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/grade/:submissionId"
            element={
              <PrivateRoute>
                {user && user.role === 'teacher' ? <TeacherGradingPage /> : <Navigate to="/courses" />}
              </PrivateRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                {user && user.role === 'student' ? <StudentCourses /> : <TeacherDashboard />}
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/course/:courseId"
            element={
              <PrivateRoute>
                {user && user.role === 'student' ? <StudentCourseDashboard /> : <Navigate to="/dashboard" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/assignment/:assignmentId"
            element={
              <PrivateRoute>
                {user && user.role === 'student' ? <StudentAssignmentSubmission /> : <Navigate to="/dashboard" />}
              </PrivateRoute>
            }
          />

          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
