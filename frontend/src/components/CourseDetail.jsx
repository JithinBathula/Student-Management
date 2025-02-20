import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const CourseDetail = () => {
  const { token, user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  // For adding a student
  const [studentEmail, setStudentEmail] = useState("");
  // For adding an assignment (with extra fields)
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    questions: "",
    maxPoints: "",
    dueDate: ""
  });
  // Dialog control states
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:25000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch course details.");
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`http://localhost:25000/api/assignments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch assignments.");
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchAssignments();
  }, [courseId, token]);

  const handleAddStudent = async () => {
    try {
      await axios.post(
        `http://localhost:25000/api/courses/${courseId}/add-student`,
        { email: studentEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudentEmail("");
      setOpenStudentDialog(false);
      fetchCourse();
    } catch (err) {
      setError("Failed to add student.");
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await axios.post(
        "http://localhost:25000/api/assignments",
        { ...assignmentData, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignmentData({
        title: "",
        description: "",
        questions: "",
        maxPoints: "",
        dueDate: ""
      });
      setOpenAssignmentDialog(false);
      fetchAssignments();
    } catch (err) {
      setError("Failed to create assignment.");
    }
  };

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {course ? (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>
            {course.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {course.description}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Course ID: {course._id}
          </Typography>

          {/* Enrolled Students Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Enrolled Students</Typography>
            {course.students && course.students.length > 0 ? (
              <List>
                {course.students.map((student) => (
                  <ListItem key={student._id}>
                    <ListItemText primary={student.name} secondary={student.email} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No students enrolled yet.</Typography>
            )}
            <IconButton onClick={() => setOpenStudentDialog(true)}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Assignments Section */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>Assignments</Typography>
              <IconButton onClick={() => setOpenAssignmentDialog(true)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {assignments.map((assignment) => (
                <Grid item xs={12} sm={6} md={4} key={assignment._id}>
                  <Card onClick={() => navigate(`/teacher/assignment/${assignment._id}`)} sx={{ cursor: "pointer" }}>
                    <CardContent>
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Typography variant="body2">{assignment.description}</Typography>
                      <Typography variant="body2">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Dialog for adding a student */}
          <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)}>
            <DialogTitle>Add Student</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Student Email"
                type="email"
                fullWidth
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenStudentDialog(false)}>Cancel</Button>
              <Button onClick={handleAddStudent}>Add</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for adding an assignment */}
          <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)}>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Assignment Title"
                fullWidth
                value={assignmentData.title}
                onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={assignmentData.description}
                onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Questions"
                fullWidth
                value={assignmentData.questions}
                onChange={(e) => setAssignmentData({ ...assignmentData, questions: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Max Points"
                type="number"
                fullWidth
                value={assignmentData.maxPoints}
                onChange={(e) => setAssignmentData({ ...assignmentData, maxPoints: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Due Date"
                type="date"
                fullWidth
                value={assignmentData.dueDate}
                onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAssignmentDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAssignment}>Create</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 4 }}>Loading course details...</Typography>
      )}
    </Container>
  );
};

export default CourseDetail;
