// src/routes/employeeRoutes.js
import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.Controller.mjs";


const router = express.Router();


router.route("/").get(getEmployees).post(createEmployee);
router.route("/:id").put(updateEmployee).delete(deleteEmployee);

export default router;