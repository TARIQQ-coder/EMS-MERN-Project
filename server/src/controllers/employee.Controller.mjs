// src/controllers/employeeController.js
import Employee from "../models/Employee.mjs";
import Department from "../models/Department.mjs";

// Helper to update department employeeCount
const updateDepartmentCount = async (departmentId) => {
  const count = await Employee.countDocuments({ department: departmentId });
  await Department.findByIdAndUpdate(departmentId, { employeeCount: count });
};

// Get all employees (populated department)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("department", "name").sort({ joinDate: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create employee
export const createEmployee = async (req, res) => {
  const { name, email, department, role, joinDate } = req.body;

  try {
    const employee = await Employee.create({
      name,
      email,
      department,
      role,
      joinDate,
    });

    await employee.populate("department", "name");
    await updateDepartmentCount(department);

    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  const { name, email, department, role, joinDate } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const oldDept = employee.department;

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.role = role || employee.role;
    employee.joinDate = joinDate || employee.joinDate;

    await employee.save();
    await employee.populate("department", "name");

    // Update counts if department changed
    if (oldDept.toString() !== employee.department.toString()) {
      await updateDepartmentCount(oldDept);
      await updateDepartmentCount(employee.department);
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const deptId = employee.department;
    await employee.deleteOne();

    await updateDepartmentCount(deptId);

    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};