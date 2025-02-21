// src/components/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const TeacherDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  
  // State for adding a new course
  const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:25000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Compare using user._id (as stored in AuthContext)
      const teacherCourses = res.data.filter(
        (course) => course.teacher.toString() === user._id
      );
      setCourses(teacherCourses);
      setError("");
    } catch (err) {
      setError("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const handleAddCourse = async () => {
    try {
      await axios.post(
        "http://localhost:25000/api/courses",
        { title: newCourseTitle, description: newCourseDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCourseTitle("");
      setNewCourseDescription("");
      setOpenAddCourseDialog(false);
      fetchCourses();
    } catch (err) {
      setError("Failed to add course.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Teacher Dashboard
      </Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Button to open dialog to add a new course */}
      <IconButton onClick={() => setOpenAddCourseDialog(true)} sx={{ mt: 2 }}>
        <AddIcon color="primary" />
      </IconButton>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              onClick={() => navigate(`/course/${course._id}`)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2">{course.description}</Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Course ID: {course._id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for adding a new course */}
      <Dialog open={openAddCourseDialog} onClose={() => setOpenAddCourseDialog(false)}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Title"
            fullWidth
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Course Description"
            fullWidth
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCourseDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCourse}>Add Course</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard;
