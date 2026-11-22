
const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");
const authMiddleware = require("../middleware/authmiddleware.js");
router.use(authMiddleware);
router.get("/", async (req, res) => {
  try {
    // 1. Get query parameters
    const {
      search = "",
      course = "",
      sort = "name",
      order = "asc",
      page = 1,
      limit = 5
    } = req.query;

    const filter = {};
    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    // Filter by course
    if (course.trim()) {
      filter.course = course.trim();
    }
    // 3. Validate sorting
    const allowedSortFields = [
      "name",
      "email",
      "course",
      "createdAt"
    ];
    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "name";
    const sortOrder = order === "desc" ? -1 : 1;
    // 4. Pagination
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number(limit) || 5)
    );
    // 5. Count matching students
    const totalStudents = await Student.countDocuments(filter);
    // 6. Get students
    const students = await Student.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    // 7. Send response
    res.json({
      students,
      currentPage,
      totalPages: Math.ceil(totalStudents / pageSize),
      totalStudents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );
    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
