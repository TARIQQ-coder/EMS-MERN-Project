// src/components/departments/DepartmentTable.jsx
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DepartmentTable({ departments }) {
  const navigate = useNavigate();

  const handleRowClick = (dept) => {
    navigate(`/admin-dashboard/departments/${dept._id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Head</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Active Employees</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Inactive Employees</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Avg. Salary</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept._id}
                  className="border-b hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => handleRowClick(dept)}
                >
                  <td className="py-4 px-6 font-medium">{dept.name}</td>
                  <td className="py-4 px-6 text-gray-600">{dept.head || "-"}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">{dept.activeEmployees || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-red-600" />
                      <span className="font-semibold">{dept.inactiveEmployees || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {dept.avgSalary > 0
                      ? new Intl.NumberFormat("en-GH", {
                          style: "currency",
                          currency: "GHS",
                          minimumFractionDigits: 0,
                        }).format(dept.avgSalary)
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}