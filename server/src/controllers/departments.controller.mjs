// src/controllers/departmentController.js
import Department from "../models/Department.mjs";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private (Admin)
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
export const createDepartment = async (req, res) => {
  const { name, head } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  try {
    const department = await Department.create({
      name: name.trim(),
      head: head?.trim() || null,
    });

    res.status(201).json(department);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Department already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
export const updateDepartment = async (req, res) => {
  const { name, head } = req.body;

  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    department.name = name?.trim() || department.name;
    department.head = head?.trim() || department.head;

    await department.save();
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.deleteOne();
    res.json({ message: "Department removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};