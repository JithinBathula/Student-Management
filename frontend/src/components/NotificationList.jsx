// src/components/NotificationList.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const NotificationList = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:25000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notifications.');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:25000/api/notifications/${notificationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      setError('Failed to update notification.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>Notifications</Typography>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {notifications.map((notif) => (
          <Grid item xs={12} sm={6} md={4} key={notif._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1">{notif.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.read ? 'Read' : 'Unread'}
                </Typography>
                {!notif.read && (
                  <Button variant="text" onClick={() => markAsRead(notif._id)} sx={{ mt: 1 }}>
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NotificationList;
