import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const StudentCourses = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:25000/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Your Courses
      </Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card onClick={() => navigate(`/dashboard/course/${course._id}`)} sx={{ cursor: 'pointer' }}>
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
    </Container>
  );
};

export default StudentCourses;
