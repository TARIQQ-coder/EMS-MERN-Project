// src/controllers/employeeController.mjs
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

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "department",
      "name"
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create employee
export const createEmployee = async (req, res) => {
  const {
    name,
    email,
    phone,
    gender,
    address,
    department,
    role,
    joinDate,
    baseSalary = 0,
    bonus = 0,
    currency = "GHS",
    payFrequency = "monthly",
    taxRate = 0,
    payrollNotes = "",
  } = req.body;

  try {
    const employee = await Employee.create({
      name,
      email,
      phone: phone || "",
      gender: gender || "",
      address: address || "",
      department,
      role,
      joinDate,
      baseSalary,
      bonus,
      currency,
      payFrequency,
      taxRate,
      payrollNotes,
    });

    await employee.populate("department", "name");

    // Increment department employee count
    if (department) {
      await Department.findByIdAndUpdate(department, {
        $inc: { employeeCount: 1 },
      });
    }

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
  const {
    name,
    email,
    phone,
    gender,
    address,
    department,
    role,
    joinDate,
    baseSalary,
    bonus,
    currency,
    payFrequency,
    taxRate,
    lastPaidDate,
    nextPayDate,
    payrollNotes,
    status,
  } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Track previous department for count adjustment
    const previousDepartment = employee.department?.toString();

    // Update fields
    employee.name = name ?? employee.name;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;
    employee.gender = gender ?? employee.gender;
    employee.address = address ?? employee.address;
    employee.role = role ?? employee.role;
    employee.joinDate = joinDate ? new Date(joinDate) : employee.joinDate;
    employee.baseSalary = baseSalary ?? employee.baseSalary;
    employee.bonus = bonus ?? employee.bonus;
    employee.currency = currency ?? employee.currency;
    employee.payFrequency = payFrequency ?? employee.payFrequency;
    employee.taxRate = taxRate ?? employee.taxRate;
    employee.lastPaidDate = lastPaidDate ? new Date(lastPaidDate) : employee.lastPaidDate;
    employee.nextPayDate = nextPayDate ? new Date(nextPayDate) : employee.nextPayDate;
    employee.payrollNotes = payrollNotes ?? employee.payrollNotes;
    employee.status = status ?? employee.status;

    // Handle department transfer
    if (department && department !== previousDepartment) {
      employee.department = department;

      // Decrement old department count
      if (previousDepartment) {
        await Department.findByIdAndUpdate(previousDepartment, {
          $inc: { employeeCount: -1 },
        });
      }

      // Increment new department count
      await Department.findByIdAndUpdate(department, {
        $inc: { employeeCount: 1 },
      });
    }

    await employee.save();
    await employee.populate("department", "name");

    res.json(employee);
  } catch (err) {
    console.error("Update employee error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Decrement department count
    if (employee.department) {
      await Department.findByIdAndUpdate(employee.department, {
        $inc: { employeeCount: -1 },
      });
    }

    await employee.deleteOne();

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ message: err.message });
  }
};