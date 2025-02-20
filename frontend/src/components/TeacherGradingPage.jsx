// src/components/TeacherGradingPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Alert, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const TeacherGradingPage = () => {
  const { token } = useAuth();
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        // Single-submission endpoint
        const res = await axios.get(
          `http://localhost:25000/api/submissions/${submissionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmission(res.data);
      } catch (err) {
        setError("Failed to fetch submission details.");
      }
    };
    fetchSubmission();
  }, [submissionId, token]);

  const handleGrade = async () => {
    try {
      await axios.put(
        `http://localhost:25000/api/submissions/grade/${submissionId}`,
        { grade, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Submission graded successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || "Submission already graded.");
      } else {
        setError("Failed to grade submission.");
      }
    }
  };

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {submission ? (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>Grade Submission</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {submission.student?.name}'s Submission
          </Typography>

          {submission.content && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Text Submission:</Typography>
              <Typography variant="body1">{submission.content}</Typography>
            </Box>
          )}

          {submission.file && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">File Submission:</Typography>
              <a
                href={`http://localhost:25000/uploads/${submission.file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {submission.file}
              </a>
            </Box>
          )}

          {/* If there's already a grade, disable the form */}
          {submission.grade != null ? (
            <Box sx={{ mt: 4 }}>
              <Alert severity="info">Already graded: {submission.grade}{submission.feedback ? ` (Feedback: ${submission.feedback})` : ""}</Alert>
            </Box>
          ) : (
            <Box sx={{ mt: 4 }}>
              <TextField
                label="Grade"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Feedback"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" onClick={handleGrade} sx={{ mt: 2 }}>
                Submit Grade
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Loading submission details...
        </Typography>
      )}
    </Container>
  );
};

export default TeacherGradingPage;
