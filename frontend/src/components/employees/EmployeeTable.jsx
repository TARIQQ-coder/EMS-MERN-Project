// src/components/employees/EmployeeTable.jsx
import { useNavigate } from "react-router-dom";

export default function EmployeeTable({ employees, onRowClick }) {
  const navigate = useNavigate();

  const handleRowClick = (empId) => {
    navigate(`/admin-dashboard/employees/${empId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Department</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Role</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Phone</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr 
                  key={emp._id} 
                  className="border-b hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => handleRowClick(emp._id)}
                >
                  <td className="py-4 px-6 font-medium">{emp.name}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.department?.name || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.role}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.phone || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(emp.joinDate).toLocaleDateString()}
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