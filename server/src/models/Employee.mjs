// src/models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  role: { type: String, enum: ["Employee", "Manager", "Admin"], default: "Employee" },
  joinDate: { type: Date, required: true },
  baseSalary: { type: Number, required: true, min: 0 },
  bonus: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  status: {
  type: String,
  enum: ["Active", "Suspended", "Resigned"],
  default: "Active",
},
});

// Remove `next` parameter — just return the promise
employeeSchema.pre("save", async function () {
  if (this.isModified("department")) {
    if (this._previousDepartment) {
      await this.model("Department").findByIdAndUpdate(this._previousDepartment, { $inc: { employeeCount: -1 } });
    }
    await this.model("Department").findByIdAndUpdate(this.department, { $inc: { employeeCount: 1 } });
  }
});

// Also fix delete hook
employeeSchema.pre("deleteOne", { document: true }, async function () {
  await this.model("Department").findByIdAndUpdate(this.department, { $inc: { employeeCount: -1 } });
});

export default mongoose.model("Employee", employeeSchema);