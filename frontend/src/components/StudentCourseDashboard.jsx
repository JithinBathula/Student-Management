import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentCourseDashboard = () => {
  const { token } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

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
    fetchAssignments();
  }, [courseId, token]);

  const chartData = {
    labels: ["Total Assignments"],
    datasets: [
      {
        label: "Assignments Count",
        data: [assignments.length],
        backgroundColor: "rgba(25, 118, 210, 0.5)",
        borderColor: "rgba(25, 118, 210, 1)",
        borderWidth: 1,
      },
    ],
  };

  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Course Dashboard
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3}>
        {/* Left half: Dashboard Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Assignments Overview</Typography>
            <Box sx={{ mt: 2 }}>
              <Bar data={chartData} options={{ responsive: true }} />
            </Box>
          </Paper>
          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6">Upcoming Deadlines</Typography>
            <Timeline position="right">
              {sortedAssignments.slice(0, 5).map((assignment) => (
                <TimelineItem key={assignment._id}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>{assignment.title}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
        {/* Right half: List of Assignments */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Assignments</Typography>
          {assignments.map((assignment) => (
            <Paper
              key={assignment._id}
              sx={{ p: 2, mb: 2, cursor: "pointer" }}
              onClick={() => navigate(`/assignment/${assignment._id}`)}
            >
              <Typography variant="subtitle1">{assignment.title}</Typography>
              <Typography variant="body2">{assignment.description}</Typography>
              <Typography variant="caption">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentCourseDashboard;
