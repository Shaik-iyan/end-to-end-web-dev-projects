
const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");
const authMiddleware = require("../middleware/authmiddleware.js");
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      course = "",
      sort = "name",
      order = "asc",
      page = 1,
      limit = 5
    } = req.query;

    // Only get students belonging to the logged-in user
    const filter = {
      owner: req.user.userId
    };

    // Search by name or email
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
      filter.course = {
        $regex: `^${course.trim()}$`,
        $options: "i"
      };
    }

    // Sorting
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

    // Pagination
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number(limit) || 5)
    );

    // Count only this user's students
    const totalStudents = await Student.countDocuments(filter);

    // Fetch only this user's students
    const students = await Student.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
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
    const { name, email, course } = req.body;

    const student = await Student.create({
      name,
      email,
      course,
      owner: req.user.userId
    });

    res.status(201).json({
      message: "Student added successfully!",
      student
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    const student = await Student.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.userId
      },
      {
        name,
        email,
        course
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found or access denied."
      });
    }

    res.status(200).json({
      message: "Student updated successfully!",
      student
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found or access denied."
      });
    }

    res.status(200).json({
      message: "Student deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
