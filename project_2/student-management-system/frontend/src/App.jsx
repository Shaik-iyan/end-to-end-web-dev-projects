
import { useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const [editId, setEditId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !course.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (editId !== null) {
      setStudents(
        students.map((student) =>
          student.id === editId
            ? { ...student, name, email, course }
            : student
        )
      );

      setEditId(null);
    } else {
      const newStudent = {
        id: Date.now(),
        name,
        email,
        course
      };

      setStudents([...students, newStudent]);
    }

    setName("");
    setEmail("");
    setCourse("");
  }

  function editStudent(student) {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setEditId(student.id);
  }

  function deleteStudent(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      setStudents(
        students.filter((student) => student.id !== id)
      );
    }
  }

  return (
    <div className="app">

      <h1>Student Management System</h1>
      <p>Manage student records</p>

      <form onSubmit={handleSubmit} className="student-form">

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? "Update Student" : "Add Student"}
        </button>

        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
              setEmail("");
              setCourse("");
            }}
          >
            Cancel
          </button>
        )}

      </form>

      <h2>Student Records ({students.length})</h2>
      <div className="student-list">
        {students.map((student) => (
          <div className="student-card" key={student.id}>
            <h3>{student.name}</h3>
            <p>{student.email}</p>
            <p>{student.course}</p>
            <div className="actions">
              <button onClick={() => editStudent(student)}>
                Edit
              </button>
              <button onClick={() => deleteStudent(student.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
