// src/components/leave/LeaveTable.jsx
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusBadge = (status) => {
  switch (status) {
    case "Approved":
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Approved</span>;
    case "Rejected":
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1"><XCircle className="w-4 h-4" /> Rejected</span>;
    default:
      return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Pending</span>;
  }
};

export default function LeaveTable({ leaves, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Employee</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Department</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">From - To</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Days</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-500">
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium">{leave.employee?.name || "N/A"}</td>
                  <td className="py-4 px-6 text-gray-600">{leave.department?.name || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">{leave.type}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{leave.days}</td>
                  <td className="py-4 px-6">{statusBadge(leave.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      {leave.status === "Pending" && (
                        <>
                          <button
                            onClick={() => onApprove(leave)}
                            className="text-green-600 hover:text-green-800 transition"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onReject(leave)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
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