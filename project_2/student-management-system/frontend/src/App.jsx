
import { useEffect, useState } from "react";
import "./App.css";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "./services/studentServices.js";

function App() {
  // Student data
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search, filter and pagination states
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getStudents({
        search: search,
        course: courseFilter,
        sort: "name",
        order: sortOrder,
        page: page,
        limit: 5
      });

      setStudents(
        Array.isArray(data.students) ? data.students : []
      );

      setTotalPages(data.totalPages || 1);
      setTotalStudents(data.totalStudents || 0);

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load students. Check your backend.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever search, filter, sorting or page changes
  useEffect(() => {
    fetchStudents();
  }, [search, courseFilter, sortOrder, page]);

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      email,
      course
    };

    try {
      setError("");

      if (editId) {
        await updateStudent(editId, studentData);
      } else {
        await addStudent(studentData);
      }

      // Clear form
      setName("");
      setEmail("");
      setCourse("");
      setEditId(null);

      // Return to first page
      setPage(1);

      // Refresh student list
      await fetchStudents();

    } catch (err) {
      console.error("Save error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to save student."
      );
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setEditId(student._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setCourse("");
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await deleteStudent(id);

      // Refresh student list
      await fetchStudents();

    } catch (err) {
      console.error("Delete error:", err);
      setError("Unable to delete student.");
    }
  };

  return (
    <div className="container">

      <h1>Student Management System</h1>

      {/* Student Form */}
      <form onSubmit={handleSubmit}>

        <input
          type="text"
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
          type="text"
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
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}

      </form>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Student List Heading */}
      <h2>Student List</h2>

      {/* Search, Filter and Sorting */}
      <div className="student-controls">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Course Filter */}
        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Courses</option>
          <option value="BCA">BCA</option>
          <option value="BSc">BSc</option>
          <option value="BCom">BCom</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>

        {/* Sorting */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Name: A to Z</option>
          <option value="desc">Name: Z to A</option>
        </select>

      </div>

      {/* Total Students */}
      <p className="student-count">
        Total Students: {totalStudents}
      </p>

      {/* Display Students */}
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div
            className="student-card"
            key={student._id}
          >
            <h3>{student.name}</h3>

            <p>{student.email}</p>

            <p>{student.course}</p>

            <button
              onClick={() => handleEdit(student)}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(student._id)}
            >
              Delete
            </button>

          </div>
        ))
      )}

      {/* Pagination */}
      <div className="pagination">

        <button
          disabled={page <= 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages || loading}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default App;
