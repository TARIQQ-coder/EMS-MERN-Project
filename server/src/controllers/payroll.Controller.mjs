import Employee from "../models/Employee.mjs";
import { endOfMonth, addMonths } from "date-fns"; // Install date-fns if not already: npm i date-fns

// Process payroll for a month
export const processPayroll = async (req, res) => {
  const { month } = req.body; // e.g., "2025-12"

  if (!month) {
    return res.status(400).json({ message: "Month required (format: YYYY-MM)" });
  }

  try {
    const [year, monthNum] = month.split("-").map(Number);
    const lastDayOfMonth = endOfMonth(new Date(year, monthNum - 1));
    const nextPayDate = endOfMonth(addMonths(lastDayOfMonth, 1));

    // Update all active employees
    const updated = await Employee.updateMany(
      { status: "Active" },
      {
        $set: {
          lastPaidDate: lastDayOfMonth,
          nextPayDate: nextPayDate,
        },
      }
    );

    res.json({
      message: `Payroll processed for ${month}`,
      updatedCount: updated.modifiedCount,
      paidDate: lastDayOfMonth.toISOString(),
      nextPay: nextPayDate.toISOString(),
    });
  } catch (err) {
    console.error("Process payroll error:", err);
    res.status(500).json({ message: err.message });
  }
};