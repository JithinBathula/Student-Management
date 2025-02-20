// src/components/Profile.jsx
import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user.role}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
