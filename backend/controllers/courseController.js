import Course from '../models/Course.js';
import User from '../models/User.js';

export const createCourse = async (req, res) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ message: 'Only teachers can create courses.' });
  
  try {
    const { title, description } = req.body;
    const newCourse = new Course({
      title,
      description,
      teacher: req.user.userId, // user object got from auth middleware
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating course.' });
  }
};


export const addStudentToCourse = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can add students to courses.' });
    }
    const courseId = req.params.courseId; // comes from url
    const { email } = req.body;

    // Validate that an email is provided and is not just empty space
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Please provide a valid student email.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    if (course.teacher.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to modify this course.' });
    }
    
    // Search for the student by email (assuming emails are stored in lowercase)
    const student = await User.findOne({ email: email.toLowerCase() });
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Student not found or invalid.' });
    }

    if (course.students.includes(student._id)) {
      return res.status(400).json({ message: 'Student is already added to the course.' });
    }
    course.students.push(student._id);
    await course.save();
    res.json({ message: 'Student added successfully.', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding student to course.' });
  }

};

// to get all courses for teacher or student
export const getCourses = async (req, res) => {
  try {
    let courses;

    if (req.user.role === 'teacher') {
      courses = await Course.find({ teacher: req.user.userId }).populate('students', 'name email');
    } else {
      courses = await Course.find({ students: req.user.userId }).populate('teacher', 'name email');
    }
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
};



// to get the course info and all the students inside the course
export const getCourseById = async (req, res) => {
  try {

    // here you get the courese, then in the students array, you replace each student id into the student documents ut only containing name and email
    const course = await Course.findById(req.params.courseId)
      .populate('students', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching course.' });
  }
};