import Employee from "../models/Employee.mjs";
import { endOfMonth, addMonths } from "date-fns"; 
import jsPDF from "jspdf";
import "jspdf-autotable";
import nodemailer from "nodemailer";



// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change to outlook, yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


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


// Email all payslips
export const emailPayslips = async (req, res) => {
  const { month, employees } = req.body;

  if (!employees || employees.length === 0) {
    return res.status(400).json({ message: "No employees provided" });
  }

  try {
    let successCount = 0;

    for (const emp of employees) {
      try {
        // Calculate taxes (same as frontend)
        const ssnit = emp.baseSalary * 0.055;
        let taxableIncome = (emp.baseSalary + (emp.bonus || 0)) - ssnit;
        let paye = 0;

        if (taxableIncome > 20000) paye += (taxableIncome - 20000) * 0.30;
        if (taxableIncome > 4000) paye += (taxableIncome - 4000) * 0.25;
        if (taxableIncome > 712) paye += (taxableIncome - 712) * 0.175;
        if (taxableIncome > 572) paye += (taxableIncome - 572) * 0.10;
        if (taxableIncome > 452) paye += (taxableIncome - 452) * 0.05;

        const grossPay = (emp.baseSalary || 0) + (emp.bonus || 0);
        const netPay = grossPay - ssnit - paye;

        // Generate PDF
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(147, 51, 234);
        doc.text("TomBrownBabies Ltd", 105, 20, { align: "center" });
        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text("Employee Payslip", 105, 30, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Period: ${month.replace("-", " ")}`, 105, 38, { align: "center" });

        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text("Employee Details", 20, 55);
        doc.text(`Name: ${emp.name}`, 20, 65);
        doc.text(`ID: ${emp._id}`, 20, 72);
        doc.text(`Position: ${emp.role}`, 20, 79);
        doc.text(`Department: ${emp.department?.name || "N/A"}`, 20, 86);

        doc.text("Payment Details", 120, 55);
        doc.text(`Pay Period: ${month.replace("-", " ")}`, 120, 65);
        doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 120, 72);
        doc.text("Currency: GHS", 120, 79);

        doc.autoTable({
          startY: 110,
          head: [["Description", "Earnings (GHS)", "Deductions (GHS)"]],
          body: [
            ["Base Salary", emp.baseSalary.toFixed(2), ""],
            ["Bonus", (emp.bonus || 0).toFixed(2), ""],
            ["", "", ""],
            ["SSNIT (5.5%)", "", ssnit.toFixed(2)],
            ["PAYE (Income Tax)", "", paye.toFixed(2)],
            ["", "", ""],
            ["Gross Pay", grossPay.toFixed(2), ""],
            ["Total Deductions", "", (ssnit + paye).toFixed(2)],
            ["NET PAY", "", netPay.toFixed(2)],
          ],
          theme: "grid",
          headStyles: { fillColor: [147, 51, 234], textColor: 255 },
          styles: { fontSize: 12, cellPadding: 5 },
          columnStyles: {
            1: { halign: "right" },
            2: { halign: "right", fontStyle: "bold" },
          },
          didParseCell: (data) => {
            if (data.row.raw[0] === "NET PAY") {
              data.cell.styles.fontSize = 16;
              data.cell.styles.textColor = [34, 197, 94];
              data.cell.styles.fontStyle = "bold";
            }
          },
        });

        const pdfBuffer = doc.output("arraybuffer");

        // Send email
        await transporter.sendMail({
          from: `"TomBrownBabies Payroll" <${process.env.EMAIL_USER}>`,
          to: emp.email,
          subject: `Your Payslip - ${month.replace("-", " ")}`,
          text: `Dear ${emp.name},\n\nPlease find attached your payslip for ${month.replace("-", " ")}.\n\nBest regards,\nTomBrownBabies Ltd`,
          attachments: [
            {
              filename: `Payslip_${emp.name.replace(/ /g, "_")}_${month}.pdf`,
              content: Buffer.from(pdfBuffer),
            },
          ],
        });

        successCount++;
      } catch (emailErr) {
        console.error(`Failed to email ${emp.name}:`, emailErr);
        // Continue with others even if one fails
      }
    }

    res.json({
      message: `Payslips emailed successfully! (${successCount}/${employees.length} sent)`,
    });
  } catch (err) {
    console.error("Bulk email error:", err);
    res.status(500).json({ message: "Failed to send payslips" });
  }
};