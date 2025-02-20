// src/components/StudentAssignmentSubmission.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const StudentAssignmentSubmission = () => {
  const { token } = useAuth();
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [content, setContent] = useState("");    // text-based content
  const [file, setFile] = useState(null);        // file to upload
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingSubmission, setExistingSubmission] = useState(null);

  // Fetch assignment details & existing submission on mount
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

    const fetchSubmission = async () => {
      try {
        const res = await axios.get(
          "http://localhost:25000/api/submissions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Check if any submission matches this assignment
        const sub = res.data.find((s) => {
          // If s.assignment is a string, compare directly
          if (typeof s.assignment === "string") {
            return s.assignment === assignmentId;
          }
          // If s.assignment is an object, compare s.assignment._id
          if (s.assignment && s.assignment._id) {
            return s.assignment._id === assignmentId;
          }
          return false;
        });

        if (sub) setExistingSubmission(sub);
      } catch (err) {
        // ignore error
      }
    };

    fetchAssignment();
    fetchSubmission();
  }, [assignmentId, token]);

  // Handle text-only submission
  const handleSubmitText = async () => {
    try {
      await axios.post(
        `http://localhost:25000/api/submissions/${assignmentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Text-based submission sent successfully!");
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit your work.");
      }
    }
  };

  // Handle file-based submission
  const handleSubmitFile = async () => {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("submissionFile", file);

      await axios.post(
        `http://localhost:25000/api/submissions/upload/${assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("File uploaded successfully!");
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to upload file.");
      }
    }
  };

  return (
    <Container>
      {/* Display any errors */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Check if assignment details are loaded */}
      {assignment ? (
        <>
          <Typography variant="h4" sx={{ mt: 4 }}>
            {assignment.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {assignment.description}
          </Typography>

          <Box sx={{ mt: 4 }}>
            {/* If there's already a submission, show it (prevents resubmission) */}
            {existingSubmission ? (
              <>
                <Typography variant="h6">Your Submission:</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {existingSubmission.content || "No text content (file submission)"}
                </Typography>

                {/* If there's a file, show a link or message */}
                {existingSubmission.file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    File Uploaded: 
                    <a
                      href={`http://localhost:25000/uploads/${existingSubmission.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 4 }}
                    >
                      {existingSubmission.file}
                    </a>
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {existingSubmission.grade !== undefined
                    ? `Grade: ${existingSubmission.grade}${
                        existingSubmission.feedback
                          ? ` (Feedback: ${existingSubmission.feedback})`
                          : ""
                      }`
                    : "Not graded yet"}
                </Typography>
              </>
            ) : (
              <>
                {/* Text-based submission */}
                <Typography variant="h6">Submit Text</Typography>
                <TextField
                  label="Your Work"
                  multiline
                  rows={10}
                  variant="outlined"
                  fullWidth
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  sx={{ mt: 1 }}
                />
                <Button variant="contained" onClick={handleSubmitText} sx={{ mt: 2 }}>
                  Submit Text
                </Button>

                <Typography variant="h6" sx={{ mt: 4 }}>Or Upload a File</Typography>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ marginTop: "8px" }}
                />
                <Button variant="outlined" onClick={handleSubmitFile} sx={{ mt: 2, display: "block" }}>
                  Upload File
                </Button>
              </>
            )}
          </Box>

          {/* Success message */}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Loading assignment details...
        </Typography>
      )}
    </Container>
  );
};

export default StudentAssignmentSubmission;
