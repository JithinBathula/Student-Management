// models/Submission.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }, // still keep text-based submission
    file: { type: String },    // store filename or file URL
    grade: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Submission', submissionSchema);
