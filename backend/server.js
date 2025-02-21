// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import assignmentRoutes from './routes/assignment.js';
import submissionRoutes from './routes/submission.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

app.use(express.json());

// by default, it is restricted for a frontend running on a different domain to access the server. 
// we use cors() we let other orgins to acess this server
// if we want to restrict mroe we can do that as well but lets leave it like this for now.
app.use(cors());


// connect to database
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Welcome to the Student Management System API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
