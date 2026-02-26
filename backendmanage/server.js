import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// --------------------
// Middlewares
// --------------------
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// --------------------
// Student Schema
// --------------------
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

// --------------------
// ROUTES
// --------------------

// ✅ GET ALL STUDENTS
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ GET SINGLE STUDENT
app.get("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// ✅ CREATE STUDENT
app.post("/api/students", async (req, res) => {
    try {
        const { name, age, course, email, phone } = req.body;

        if (!name || !age || !course || !email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newStudent = await Student.create({
            name,
            age,
            course,
            email,
            phone
        });

        res.status(201).json(newStudent);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ UPDATE STUDENT
app.put("/api/students/:id", async (req, res) => {
    try {
        const { name, age, course, email, phone } = req.body;

        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        if (name) student.name = name;
        if (age) student.age = age;
        if (course) student.course = course;
        if (email) student.email = email;
        if (phone) student.phone = phone;

        await student.save();
        res.json(student);

    } catch (error) {
        res.status(400).json({ message: "Invalid ID or Data" });
    }
});

// ✅ DELETE STUDENT
app.delete("/api/students/:id", async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Student Not Found" });
        }

        res.json({ message: "Student Deleted Successfully" });

    } catch (error) {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// --------------------
// SERVER START
// --------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});