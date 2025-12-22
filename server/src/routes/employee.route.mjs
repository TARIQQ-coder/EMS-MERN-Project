import express from "express";
import {
  getEmployees,
  getEmployeeById,        
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.Controller.mjs"; 

const router = express.Router();

router.route("/").get(getEmployees).post(createEmployee);
router.route("/:id")
  .get(getEmployeeById)      // ← New: GET single employee
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;