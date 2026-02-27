const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/students"

import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const API = "http://localhost:5000/api/students";

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
    email: "",
    phone: ""
  });

  const [editId, setEditId] = useState(null);

  // -----------------------
  // Fetch Students
  // -----------------------
  const fetchStudents = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // -----------------------
  // Handle Input Change
  // -----------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // -----------------------
  // Add or Update Student
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, age, course, email, phone } = formData;

    if (!name || !age || !course || !email || !phone) {
      return alert("All fields are required");
    }

    try {
      if (editId) {
        // UPDATE
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        setEditId(null);
      } else {
        // CREATE
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      setFormData({
        name: "",
        age: "",
        course: "",
        email: "",
        phone: ""
      });

      fetchStudents();

    } catch (error) {
      console.error("Error saving student");
    }
  };

  // -----------------------
  // Edit Student
  // -----------------------
  const handleEdit = (student) => {
    setFormData(student);
    setEditId(student._id);
  };

  // -----------------------
  // Delete Student
  // -----------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    fetchStudents();
  };

  return (
    <div className="container">
      <h1>🎓 Student Management</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button
                  className="delete"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;