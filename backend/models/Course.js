// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // so which teacher made this
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // References to User documents
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
