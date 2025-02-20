// src/components/TeacherAssignmentDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const TeacherAssignmentDetail = () => {
  const { token } = useAuth();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:25000/api/assignments/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignment(res.data);
      } catch (err) {
        setError("Failed to fetch assignment details.");
      }
    };

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:25000/api/submissions/assignment/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to fetch submissions.");
      }
    };

    fetchAssignment();
    fetchSubmissions();
  }, [assignmentId, token]);

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {assignment ? (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>
            {assignment.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {assignment.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
          </Typography>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Student Submissions
          </Typography>
          {submissions.map((submission) => {
            const studentName = submission.student?.name || "Unknown Student";
            const isGraded = submission.grade != null ? `Graded: ${submission.grade}` : "Not graded";
            const hasFile = submission.file ? " — File attached" : "";

            return (
              <ListItem
                button
                key={submission._id}
                onClick={() => navigate(`/teacher/grade/${submission._id}`)}
              >
                <ListItemText
                  primary={`${studentName}${hasFile ? hasFile : ""}`}
                  secondary={isGraded}
                />
              </ListItem>
            );
          })}
          {submissions.length === 0 && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No submissions yet.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Loading assignment details...
        </Typography>
      )}
    </Container>
  );
};

export default TeacherAssignmentDetail;
