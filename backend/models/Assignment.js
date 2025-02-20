import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
