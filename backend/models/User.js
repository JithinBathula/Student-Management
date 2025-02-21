// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student'], required: true },
  },
  { timestamps: true } // creates two new properities for each document, time created and time updated i think
);

// Hash password before saving. need to yous function declaration instead of arrow as we need access to this.
// this refers to the object being saved
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  const salt = await bcrypt.genSalt(10); // salt makes sure that same passwords still hash differently so that its harder for hackers
  this.password = await bcrypt.hash(this.password, salt); // hashing
  next();
});

// Compare password for login.
// userSchema.methods. allows us to add custom methods. these methods will be available on each document
// so now you can use compare method for each document
// bcrypt.compare makes comparision much easier.
// the candidate password is just plan text password. the salt is then added to this and hashed
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
