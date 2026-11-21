import { useEffect, useState } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "./services/studentServices.js";
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setError("");
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError("Could not load students. Check your backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = { name, email, course };
    try {
      if (editId) {
        await updateStudent(editId, studentData);
      } else {
        await addStudent(studentData);
      }
      setName("");
      setEmail("");
      setCourse("");
      setEditId(null);
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save student."
      );
    }
  };
  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setEditId(student._id);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await deleteStudent(id);
      await fetchStudents();
    } catch (err) {
      setError("Unable to delete student.");
    }
  };

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student Name"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Course"
          required
        />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>
        {editId && (
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
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Student List</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div className="student-card" key={student._id}>
            <h3>{student.name}</h3>
            <p>{student.email}</p>
            <p>{student.course}</p>

            <button onClick={() => handleEdit(student)}>
              Edit
            </button>

            <button onClick={() => handleDelete(student._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
export default App;
