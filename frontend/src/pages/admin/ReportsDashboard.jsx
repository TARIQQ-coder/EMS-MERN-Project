// src/pages/admin/ReportsDashboard.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, subMonths, parseISO } from "date-fns";
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";
import {
  FileText,
  Download,
  Users,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function ReportsDashboard() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("all");

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  // Fetch departments
  const { data: departments = [], isLoading: deptsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data || [],
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  // Current statistics
  const stats = {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    totalPayroll: employees.reduce(
      (sum, emp) => sum + (emp.baseSalary || 0),
      0
    ),
    totalBonus: employees.reduce((sum, emp) => sum + (emp.bonus || 0), 0),
    avgSalary:
      employees.length > 0
        ? employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0) /
          employees.length
        : 0,
  };

  // Historical Payroll Trend (last 12 months) - Mock data ready for real API
  const historicalPayrollTrend = React.useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, "MMM yyyy");

      // Mock realistic data
      const basePayroll = 800000 + Math.random() * 400000;
      const bonusTotal = basePayroll * 0.1 * (0.8 + Math.random() * 0.4);
      const gross = basePayroll + bonusTotal;
      const ssnit = gross * 0.055;
      const paye = gross * 0.18; // approximate average for illustration

      months.push({
        month: monthKey,
        grossPayroll: Math.round(gross),
        basePayroll: Math.round(basePayroll),
        bonusTotal: Math.round(bonusTotal),
        ssnit: Math.round(ssnit),
        paye: Math.round(paye),
        netPayroll: Math.round(gross - ssnit - paye),
      });
    }
    return months;
  }, []);

  // Department-wise distribution
  const departmentDistribution = React.useMemo(() => {
    return departments
      .map((dept) => {
        const empsInDept = employees.filter(
          (emp) => emp.department?._id === dept._id
        );
        const empCount = empsInDept.length;
        const totalSalary = empsInDept.reduce(
          (sum, emp) => sum + (emp.baseSalary || 0),
          0
        );
        return {
          name: dept.name,
          value: empCount,
          totalSalary,
        };
      })
      .filter((d) => d.value > 0);
  }, [departments, employees]);

  // Role distribution
  const roleDistribution = React.useMemo(() => {
    const roleCount = employees.reduce((acc, emp) => {
      const role = emp.role || "Employee";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCount).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // Gender distribution
  const genderDistribution = React.useMemo(() => {
    const genderCount = employees.reduce((acc, emp) => {
      const gender = emp.gender || "Not Specified";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [employees]);

  // Salary ranges
  const salaryRanges = React.useMemo(() => {
    const ranges = {
      "0-2K": 0,
      "2K-4K": 0,
      "4K-6K": 0,
      "6K-8K": 0,
      "8K-10K": 0,
      "10K+": 0,
    };

    employees.forEach((emp) => {
      const salary = emp.baseSalary || 0;
      if (salary < 2000) ranges["0-2K"]++;
      else if (salary < 4000) ranges["2K-4K"]++;
      else if (salary < 6000) ranges["4K-6K"]++;
      else if (salary < 8000) ranges["6K-8K"]++;
      else if (salary < 10000) ranges["8K-10K"]++;
      else ranges["10K+"]++;
    });

    return Object.entries(ranges).map(([name, count]) => ({
      name,
      count,
    }));
  }, [employees]);

  // Hiring trend (last 6 months)
  const hiringTrend = React.useMemo(() => {
    const monthCount = {};
    employees.forEach((emp) => {
      if (emp.joinDate) {
        const date = new Date(emp.joinDate);
        const month = format(date, "MMM yyyy");
        monthCount[month] = (monthCount[month] || 0) + 1;
      }
    });

    return Object.entries(monthCount)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));
  }, [employees]);

  const COLORS = [
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
  ];

  // Clickable Stat Card
  const StatCard = ({ icon: Icon, label, value, subtext, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:border-purple-300 transition-all duration-300 text-left w-full cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </button>
  );

  // Report selector card
  const ReportCard = ({ icon: Icon, title, description, onClick, active }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
        active
          ? "border-purple-600 bg-purple-50"
          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`${
            active ? "bg-purple-600" : "bg-gray-100"
          } p-3 rounded-lg`}
        >
          <Icon
            className={`w-6 h-6 ${active ? "text-white" : "text-gray-600"}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

  const handleExport = (type) => {
    // Placeholder - implement real export later
    alert("Export feature coming soon!");
  };

  if (employeesLoading || deptsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700 mb-4" />
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your organization
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="quarter">This Quarter</option>
            <option value="month">This Month</option>
          </select>

          <button
            onClick={() => handleExport(selectedReport)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Clickable Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalEmployees}
          subtext="Active workforce"
          color="text-purple-600"
          onClick={() => navigate("/admin-dashboard/employees")}
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value={stats.totalDepartments}
          subtext="Active departments"
          color="text-blue-600"
          onClick={() => navigate("/admin-dashboard/departments")}
        />
        <StatCard
          icon={DollarSign}
          label="Total Payroll"
          value={formatCurrency(stats.totalPayroll)}
          subtext="Monthly base salaries"
          color="text-green-600"
          onClick={() => navigate("/admin-dashboard/payroll")}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg. Salary"
          value={formatCurrency(stats.avgSalary)}
          subtext="Per employee"
          color="text-orange-600"
        />
      </div>

      {/* Report Selection & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Report Types
          </h2>

          <ReportCard
            icon={BarChart3}
            title="Overview Report"
            description="Company-wide statistics"
            onClick={() => setSelectedReport("overview")}
            active={selectedReport === "overview"}
          />

          <ReportCard
            icon={Users}
            title="Employee Report"
            description="Detailed employee data"
            onClick={() => setSelectedReport("employees")}
            active={selectedReport === "employees"}
          />

          <ReportCard
            icon={Building2}
            title="Department Report"
            description="Department analysis"
            onClick={() => setSelectedReport("departments")}
            active={selectedReport === "departments"}
          />

          <ReportCard
            icon={DollarSign}
            title="Payroll Report"
            description="Salary & compensation"
            onClick={() => setSelectedReport("payroll")}
            active={selectedReport === "payroll"}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedReport === "overview" && (
            <>
              {/* Historical Payroll Trend */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Historical Payroll Trend (Last 12 Months)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={historicalPayrollTrend}>
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="grossPayroll"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Gross Payroll"
                      dot={{ fill: "#8b5cf6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="paye"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="PAYE Withheld"
                    />
                    <Line
                      type="monotone"
                      dataKey="ssnit"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="SSNIT Contribution"
                    />
                    <Line
                      type="monotone"
                      dataKey="netPayroll"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Net Payroll"
                      dot={{ fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Department Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Department Distribution
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {departmentDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} employees`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-col justify-center space-y-3">
                    {departmentDistribution.map((dept, idx) => {
                      const total = departmentDistribution.reduce(
                        (sum, d) => sum + d.value,
                        0
                      );
                      const percentage =
                        total > 0 ? ((dept.value / total) * 100).toFixed(1) : 0;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: COLORS[idx % COLORS.length],
                              }}
                            ></div>
                            <span className="font-medium text-gray-800">
                              {dept.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              {dept.value}
                            </p>
                            <p className="text-xs text-gray-500">
                              {percentage}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Role & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Role Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Gender Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genderDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {genderDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hiring Trend */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Hiring Trend (Last 6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hiringTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Employee Report */}
          {selectedReport === "employees" && (
            <>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Salary Distribution
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salaryRanges}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                      {salaryRanges.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Top 10 Highest Paid Employees
                </h3>
                <div className="space-y-3">
                  {employees
                    .sort((a, b) => (b.baseSalary || 0) - (a.baseSalary || 0))
                    .slice(0, 10)
                    .map((emp, idx) => (
                      <div
                        key={emp._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {emp.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {emp.department?.name || "No Department"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(emp.baseSalary)}
                          </p>
                          <p className="text-xs text-gray-500">{emp.role}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Department Report */}
          {selectedReport === "departments" && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Department-wise Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="value"
                    fill="#8b5cf6"
                    name="Employees"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="totalSalary"
                    fill="#10b981"
                    name="Total Salary (GHS)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentDistribution.map((dept, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">{dept.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {dept.value} Employees
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {formatCurrency(dept.totalSalary)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payroll Report */}
          {selectedReport === "payroll" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-2">
                    Total Base Salaries
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {formatCurrency(stats.totalPayroll)}
                  </p>
                  <p className="text-xs text-green-600 mt-2">Monthly payment</p>
                </div>

                <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <p className="text-sm text-orange-700 font-medium mb-2">
                    Total Bonuses
                  </p>
                  <p className="text-3xl font-bold text-orange-700">
                    {formatCurrency(stats.totalBonus)}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    Monthly incentives
                  </p>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium mb-2">
                    Total Compensation
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    {formatCurrency(stats.totalPayroll + stats.totalBonus)}
                  </p>
                  <p className="text-xs text-purple-600 mt-2">Base + Bonuses</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Salary by Department
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalSalary"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Department Payroll Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Department
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Employees
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Total Salary
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Avg Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentDistribution.map((dept, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {dept.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 text-right">
                            {dept.value}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-green-600 text-right">
                            {formatCurrency(dept.totalSalary)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 text-right">
                            {formatCurrency(
                              dept.value > 0 ? dept.totalSalary / dept.value : 0
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
