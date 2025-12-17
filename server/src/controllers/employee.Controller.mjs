// src/controllers/employeeController.js
import Employee from "../models/Employee.mjs";
import Department from "../models/Department.mjs";

// Get all employees (populated)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .sort({ joinDate: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create employee
export const createEmployee = async (req, res) => {
  const { name, email, department, role, joinDate, baseSalary, bonus } = req.body;

  try {
    const employee = await Employee.create({
      name,
      email,
      department,
      role,
      joinDate,
      baseSalary,
      bonus,
    });

    await employee.populate("department", "name");
    await Department.findByIdAndUpdate(department, { $inc: { employeeCount: 1 } });

    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// Update employee (including salary)
export const updateEmployee = async (req, res) => {
  const { name, email, department, role, joinDate, baseSalary, bonus } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    employee.joinDate = joinDate || employee.joinDate;
    employee.baseSalary = baseSalary ?? employee.baseSalary;
    employee.bonus = bonus ?? employee.bonus;

    if (department && department !== employee.department.toString()) {
      employee._previousDepartment = employee.department; // For pre-save hook
      employee.department = department;
    }

    await employee.save();
    await employee.populate("department", "name");

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

    await employee.deleteOne();

    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};