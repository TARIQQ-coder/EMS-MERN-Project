import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: "" },                // ← Added
  gender: { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "" }, // ← Added
  address: { type: String, default: "" },              // ← Added
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

employeeSchema.pre("save", async function () {
  if (this.isModified("department")) {
    if (this._previousDepartment) {
      await this.model("Department").findByIdAndUpdate(this._previousDepartment, { $inc: { employeeCount: -1 } });
    }
    await this.model("Department").findByIdAndUpdate(this.department, { $inc: { employeeCount: 1 } });
  }
});

employeeSchema.pre("deleteOne", { document: true, query: false }, async function () {
  try {
    if (this.department) {
      await this.model("Department").findByIdAndUpdate(this.department, { $inc: { employeeCount: -1 } });
    }
  } catch (error) {
    console.error("Warning: Failed to decrement department employeeCount:", error);
    // Do not throw — allow employee deletion to proceed
  }
});

export default mongoose.model("Employee", employeeSchema);