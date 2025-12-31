// src/pages/admin/PayrollDashboard.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, subMonths } from "date-fns";
import {
  DollarSign,
  Users,
  TrendingUp,
  UserCheck,
  Loader2,
  Search,
  Calendar,
  CheckCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Download,
  Archive,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";

const payrollService = {
  getAll: () => axios.get("/api/employees"),
  processPayroll: (month) => axios.post("/api/payroll/process", { month }),
};

const COLORS = [
  "#9333ea",
  "#a855f7",
  "#c084fc",
  "#e9d5ff",
  "#d8b4fe",
  "#b794f4",
];

export default function PayrollDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isGeneratingPayslip, setIsGeneratingPayslip] = useState(false);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [isEmailingPayslips, setIsEmailingPayslips] = useState(false);

  const {
    data: rawEmployees = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      payrollService.getAll().then((res) => {
        const data = res.data;
        if (Array.isArray(data)) return data;
        if (data?.employees && Array.isArray(data.employees))
          return data.employees;
        if (data?.data && Array.isArray(data.data)) return data.data;
        console.warn("Unexpected employee data format:", data);
        return [];
      }),
  });

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const activeEmployees = employees.filter((emp) => emp?.status === "Active");

  const filteredEmployees = activeEmployees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter
      ? emp.department?._id === departmentFilter
      : true;
    return matchesSearch && matchesDepartment;
  });

  const totalPayroll = filteredEmployees.reduce(
    (sum, emp) => sum + (emp.baseSalary || 0) + (emp.bonus || 0),
    0
  );

  const averageSalary =
    filteredEmployees.length > 0 ? totalPayroll / filteredEmployees.length : 0;

  const highestPaid =
    filteredEmployees.length > 0
      ? filteredEmployees.reduce((max, emp) =>
          (emp.baseSalary || 0) + (emp.bonus || 0) >
          (max.baseSalary || 0) + (max.bonus || 0)
            ? emp
            : max
        )
      : { name: "N/A", baseSalary: 0, bonus: 0 };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const departments = Array.from(
    new Set(activeEmployees.map((e) => e.department?._id).filter(Boolean))
  ).map(
    (id) => activeEmployees.find((e) => e.department?._id === id)?.department
  );

  const departmentPayrollData = departments
    .map((dept) => {
      const deptEmployees = filteredEmployees.filter(
        (e) => e.department?._id === dept._id
      );
      const total = deptEmployees.reduce(
        (sum, e) => sum + (e.baseSalary || 0) + (e.bonus || 0),
        0
      );
      return { name: dept.name, value: total };
    })
    .filter((d) => d.value > 0);

  const monthlyTrendData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    const variance = 0.8 + Math.random() * 0.4;
    return {
      month: format(date, "MMM yyyy"),
      payroll: Math.round((totalPayroll * variance) / 1000) * 1000,
    };
  });

  const displayMonth = format(parseISO(selectedMonth + "-01"), "MMMM yyyy");

  const processMutation = useMutation({
    mutationFn: () => payrollService.processPayroll(selectedMonth),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast.success(`Payroll processed for ${displayMonth}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to process payroll");
    },
  });

  // Bulk ZIP Generation
  const generateBulkPayslips = async () => {
    if (isGeneratingBulk || filteredEmployees.length === 0) return;

    setIsGeneratingBulk(true);
    toast.loading(`Generating ${filteredEmployees.length} payslips...`, {
      id: "bulk",
    });

    try {
      const zip = new JSZip();

      for (let i = 0; i < filteredEmployees.length; i++) {
        const emp = filteredEmployees[i];

        const ssnit = emp.baseSalary * 0.055;
        let taxableIncome = emp.baseSalary + (emp.bonus || 0) - ssnit;
        let paye = 0;

        if (taxableIncome > 50416.67) {
          paye += (taxableIncome - 50416.67) * 0.35;
          taxableIncome = 50416.67;
        }
        if (taxableIncome > 19896.67) {
          paye += (taxableIncome - 19896.67) * 0.3;
          taxableIncome = 19896.67;
        }
        if (taxableIncome > 3896.67) {
          paye += (taxableIncome - 3896.67) * 0.25;
          taxableIncome = 3896.67;
        }
        if (taxableIncome > 730) {
          paye += (taxableIncome - 730) * 0.175;
          taxableIncome = 730;
        }
        if (taxableIncome > 600) {
          paye += (taxableIncome - 600) * 0.1;
          taxableIncome = 600;
        }
        if (taxableIncome > 490) {
          paye += (taxableIncome - 490) * 0.05;
        }
        // First 490 GHS is tax-free

        const grossPay = (emp.baseSalary || 0) + (emp.bonus || 0);
        const netPay = grossPay - ssnit - paye;

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(147, 51, 234);
        doc.text("TomBrownBabies Ltd", 105, 20, { align: "center" });
        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text("Employee Payslip", 105, 30, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Period: ${displayMonth}`, 105, 38, { align: "center" });

        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text("Employee Details", 20, 55);
        doc.text(`Name: ${emp.name}`, 20, 65);
        doc.text(`ID: ${emp._id}`, 20, 72);
        doc.text(`Position: ${emp.role}`, 20, 79);
        doc.text(`Department: ${emp.department?.name || "N/A"}`, 20, 86);

        doc.text("Payment Details", 120, 55);
        doc.text(`Pay Period: ${displayMonth}`, 120, 65);
        doc.text(
          `Payment Date: ${format(new Date(), "MMMM d, yyyy")}`,
          120,
          72
        );
        doc.text("Currency: GHS", 120, 79);

        doc.autoTable({
          startY: 110,
          head: [["Description", "Earnings (GHS)", "Deductions (GHS)"]],
          body: [
            ["Base Salary", formatCurrency(emp.baseSalary), ""],
            ["Bonus", formatCurrency(emp.bonus || 0), ""],
            ["", "", ""],
            ["SSNIT (5.5%)", "", formatCurrency(ssnit)],
            ["PAYE (Income Tax)", "", formatCurrency(paye)],
            ["", "", ""],
            ["Gross Pay", formatCurrency(grossPay), ""],
            ["Total Deductions", "", formatCurrency(ssnit + paye)],
            ["NET PAY", "", formatCurrency(netPay)],
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

        const pdfBlob = doc.output("blob");
        zip.file(
          `Payslip_${emp.name.replace(/ /g, "_")}_${selectedMonth}.pdf`,
          pdfBlob
        );

        toast.loading(
          `Generated ${i + 1}/${filteredEmployees.length} payslips...`,
          { id: "bulk" }
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslips_${displayMonth.replace(
        " ",
        "_"
      )}_All_Employees.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`All ${filteredEmployees.length} payslips downloaded!`, {
        id: "bulk",
      });
    } catch (err) {
      console.error("Bulk payslip error:", err);
      toast.error("Failed to generate bulk payslips", { id: "bulk" });
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading payroll data: {error.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header with All Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Payroll Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Payroll Overview for {displayMonth}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Generate All (ZIP) */}
          <button
            onClick={generateBulkPayslips}
            disabled={isGeneratingBulk || filteredEmployees.length === 0}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <Archive className="w-5 h-5" />
            {isGeneratingBulk ? "Generating..." : "Generate All Payslips"}
          </button>

          {/* Email All Payslips */}
          <button
            onClick={async () => {
              if (isEmailingPayslips || filteredEmployees.length === 0) return;

              setIsEmailingPayslips(true);
              toast.loading(
                `Emailing ${filteredEmployees.length} payslips...`,
                { id: "email" }
              );

              try {
                const response = await axios.post("/api/payroll/email", {
                  month: selectedMonth,
                  employees: filteredEmployees.map((emp) => ({
                    _id: emp._id,
                    name: emp.name,
                    email: emp.email,
                    role: emp.role,
                    department: emp.department,
                    baseSalary: emp.baseSalary,
                    bonus: emp.bonus || 0,
                  })),
                });

                toast.success(
                  response.data.message || "Payslips emailed successfully!",
                  { id: "email" }
                );
              } catch (err) {
                console.error("Email payslips error:", err);
                toast.error(
                  err.response?.data?.message || "Failed to email payslips",
                  { id: "email" }
                );
              } finally {
                setIsEmailingPayslips(false);
              }
            }}
            disabled={isEmailingPayslips || filteredEmployees.length === 0}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <Mail className="w-5 h-5" />
            {isEmailingPayslips ? "Emailing..." : "Email All Payslips"}
          </button>

          {/* Process Payroll */}
          <button
            onClick={() => processMutation.mutate()}
            disabled={processMutation.isPending}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            {processMutation.isPending ? "Processing..." : "Process Payroll"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-3xl font-bold text-purple-700">
                {formatCurrency(totalPayroll)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Salary</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(averageSalary)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Highest Paid</p>
              <p className="text-xl font-bold text-blue-600 truncate max-w-[180px]">
                {highestPaid.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(
                  (highestPaid.baseSalary || 0) + (highestPaid.bonus || 0)
                )}
              </p>
            </div>
            <UserCheck className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Employees</p>
              <p className="text-3xl font-bold text-indigo-600">
                {filteredEmployees.length}
              </p>
            </div>
            <Users className="w-10 h-10 text-indigo-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Monthly Payroll Trend (Last 12 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                }}
              />
              <Line
                type="monotone"
                dataKey="payroll"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ fill: "#9333ea" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Payroll by Department ({displayMonth})
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentPayrollData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) =>
                  `${entry.name}: ${formatCurrency(entry.value)}`
                }
              >
                {departmentPayrollData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Departments</option>
          {departments.map(
            (dept) =>
              dept && (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              )
          )}
        </select>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Employee Payroll - {displayMonth}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Employee
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Department
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Base Salary
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Bonus
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Total Pay
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Last Paid
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No employees match your filters for {displayMonth}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b hover:bg-purple-50 transition cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="py-4 px-6 font-medium">{emp.name}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {emp.department?.name || "-"}
                    </td>
                    <td className="py-4 px-6">
                      {formatCurrency(emp.baseSalary)}
                    </td>
                    <td className="py-4 px-6">{formatCurrency(emp.bonus)}</td>
                    <td className="py-4 px-6 font-bold text-purple-700">
                      {formatCurrency((emp.baseSalary || 0) + (emp.bonus || 0))}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {emp.lastPaidDate
                        ? format(new Date(emp.lastPaidDate), "MMM d, yyyy")
                        : "Not paid"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                    {selectedEmployee.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-gray-600">{selectedEmployee.role}</p>
                    <p className="text-sm text-purple-600">
                      {selectedEmployee.department?.name || "No Department"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Tax Preview in Modal */}
              {(() => {
                const ssnit = selectedEmployee.baseSalary * 0.055;
                let taxableIncome =
                  selectedEmployee.baseSalary +
                  (selectedEmployee.bonus || 0) -
                  ssnit;
                let paye = 0;

                if (taxableIncome > 20000)
                  paye += (taxableIncome - 20000) * 0.3;
                if (taxableIncome > 4000) paye += (taxableIncome - 4000) * 0.25;
                if (taxableIncome > 712) paye += (taxableIncome - 712) * 0.175;
                if (taxableIncome > 572) paye += (taxableIncome - 572) * 0.1;
                if (taxableIncome > 452) paye += (taxableIncome - 452) * 0.05;

                const grossPay =
                  (selectedEmployee.baseSalary || 0) +
                  (selectedEmployee.bonus || 0);
                const netPay = grossPay - ssnit - paye;

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Payroll Details ({displayMonth})
                        </h3>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base Salary</span>
                            <span className="font-medium">
                              {formatCurrency(selectedEmployee.baseSalary)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bonus</span>
                            <span className="font-medium">
                              {formatCurrency(selectedEmployee.bonus || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="font-semibold">Gross Pay</span>
                            <span className="font-semibold">
                              {formatCurrency(grossPay)}
                            </span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>SSNIT (5.5%)</span>
                            <span>-{formatCurrency(ssnit)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>PAYE Tax</span>
                            <span>-{formatCurrency(paye)}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-gray-400">
                            <span className="font-bold text-lg">Net Pay</span>
                            <span className="font-bold text-green-600 text-xl">
                              {formatCurrency(netPay)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Paid</span>
                            <span>
                              {selectedEmployee.lastPaidDate
                                ? format(
                                    new Date(selectedEmployee.lastPaidDate),
                                    "MMMM d, yyyy"
                                  )
                                : "Not paid yet"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{selectedEmployee.email}</span>
                          </div>
                          {selectedEmployee.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <span>{selectedEmployee.phone}</span>
                            </div>
                          )}
                          {selectedEmployee.address && (
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <span>{selectedEmployee.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <span>
                              Joined:{" "}
                              {format(
                                new Date(selectedEmployee.joinDate),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Single Payslip Button */}
                    <div className="text-center mb-8">
                      <button
                        onClick={() => {
                          if (isGeneratingPayslip) return;

                          setIsGeneratingPayslip(true);
                          toast.loading("Generating payslip...", {
                            id: "payslip",
                          });

                          try {
                            const doc = new jsPDF();

                            doc.setFontSize(20);
                            doc.setTextColor(147, 51, 234);
                            doc.text("TomBrownBabies Ltd", 105, 20, {
                              align: "center",
                            });
                            doc.setFontSize(16);
                            doc.setTextColor(100);
                            doc.text("Employee Payslip", 105, 30, {
                              align: "center",
                            });
                            doc.setFontSize(12);
                            doc.text(`Period: ${displayMonth}`, 105, 38, {
                              align: "center",
                            });

                            doc.setTextColor(0);
                            doc.setFontSize(12);
                            doc.text("Employee Details", 20, 55);
                            doc.text(`Name: ${selectedEmployee.name}`, 20, 65);
                            doc.text(`ID: ${selectedEmployee._id}`, 20, 72);
                            doc.text(
                              `Position: ${selectedEmployee.role}`,
                              20,
                              79
                            );
                            doc.text(
                              `Department: ${
                                selectedEmployee.department?.name || "N/A"
                              }`,
                              20,
                              86
                            );

                            doc.text("Payment Details", 120, 55);
                            doc.text(`Pay Period: ${displayMonth}`, 120, 65);
                            doc.text(
                              `Payment Date: ${format(
                                new Date(),
                                "MMMM d, yyyy"
                              )}`,
                              120,
                              72
                            );
                            doc.text("Currency: GHS", 120, 79);

                            doc.autoTable({
                              startY: 110,
                              head: [
                                [
                                  "Description",
                                  "Earnings (GHS)",
                                  "Deductions (GHS)",
                                ],
                              ],
                              body: [
                                [
                                  "Base Salary",
                                  formatCurrency(selectedEmployee.baseSalary),
                                  "",
                                ],
                                [
                                  "Bonus",
                                  formatCurrency(selectedEmployee.bonus || 0),
                                  "",
                                ],
                                ["", "", ""],
                                ["SSNIT (5.5%)", "", formatCurrency(ssnit)],
                                ["PAYE (Income Tax)", "", formatCurrency(paye)],
                                ["", "", ""],
                                ["Gross Pay", formatCurrency(grossPay), ""],
                                [
                                  "Total Deductions",
                                  "",
                                  formatCurrency(ssnit + paye),
                                ],
                                ["NET PAY", "", formatCurrency(netPay)],
                              ],
                              theme: "grid",
                              headStyles: {
                                fillColor: [147, 51, 234],
                                textColor: 255,
                              },
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

                            const pageHeight = doc.internal.pageSize.height;
                            doc.setFontSize(10);
                            doc.setTextColor(100);
                            doc.text(
                              "This is a computer-generated payslip. No signature required.",
                              105,
                              pageHeight - 30,
                              { align: "center" }
                            );
                            doc.text(
                              `Generated on: ${format(
                                new Date(),
                                "MMMM d, yyyy 'at' HH:mm"
                              )}`,
                              105,
                              pageHeight - 20,
                              { align: "center" }
                            );

                            doc.save(
                              `Payslip_${selectedEmployee.name.replace(
                                / /g,
                                "_"
                              )}_${selectedMonth}.pdf`
                            );

                            toast.success("Payslip downloaded!", {
                              id: "payslip",
                            });
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to generate payslip", {
                              id: "payslip",
                            });
                          } finally {
                            setIsGeneratingPayslip(false);
                          }
                        }}
                        disabled={isGeneratingPayslip}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold text-lg rounded-xl transition shadow-lg"
                      >
                        {isGeneratingPayslip ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-6 h-6" />
                            Generate & Download Payslip ({displayMonth})
                          </>
                        )}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
