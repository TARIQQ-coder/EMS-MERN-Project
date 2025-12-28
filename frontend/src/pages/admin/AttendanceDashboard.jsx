// src/pages/admin/AttendanceDashboard.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
  Edit2,
} from "lucide-react";
import toast from "react-hot-toast";
import { attendanceService } from "../../services/attendanceService";

export default function AttendanceDashboard() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Main query: Full employee list for selected date
  const {
    data: attendance = [],
    isLoading: dailyLoading,
    error: dailyError,
  } = useQuery({
    queryKey: ["attendance", formattedDate],
    queryFn: () =>
      attendanceService.getAttendance(formattedDate).then((res) => res.data),
  });

  // Historical query: Only rates for calendar coloring (last 30 days)
  const historicalDates = Array.from({ length: 31 }, (_, i) =>
    format(subDays(new Date(), 30 - i), "yyyy-MM-dd")
  );

  const {
    data: historicalRates = {},
    isLoading: historicalLoading,
  } = useQuery({
    queryKey: ["historicalRates"],
    queryFn: async () => {
      const rates = {};
      for (const date of historicalDates) {
        try {
          const res = await attendanceService.getAttendance(date);
          const data = res.data;
          const presentCount = data.filter(
            (a) => a.status === "Present" || a.status === "Late"
          ).length;
          const total = data.length;
          rates[date] = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        } catch {
          rates[date] = 0;
        }
      }
      return rates;
    },
    staleTime: 1000 * 60 * 10, // Cache 10 minutes
  });

  // Summary stats from daily data
  const present = attendance.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const onLeave = attendance.filter((a) => a.status === "On Leave").length;
  const totalEmployees = attendance.length;
  const attendanceRate =
    totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0;

  const formatTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-GH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const overrideMutation = useMutation({
    mutationFn: ({ recordId, data }) =>
      attendanceService.updateAttendance(recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["attendance", formattedDate]);
      queryClient.invalidateQueries(["historicalRates"]);
      toast.success(
        currentRecord?._id
          ? "Attendance updated successfully"
          : "New attendance record created"
      );
      setEditModalOpen(false);
      setCurrentRecord(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update attendance");
    },
  });

  const handleMarkAbsent = (record) => {
    if (
      window.confirm(
        `Mark ${record.employee.name} as Absent for ${formattedDate}?`
      )
    ) {
      toast.success("Marked as absent (manual override ready)");
    }
  };

  const openEditModal = (record) => {
    setCurrentRecord(record);
    setEditModalOpen(true);
  };

  // Calendar events from historical rates
  const calendarEvents = Object.entries(historicalRates).map(([date, rate]) => ({
    title: `${rate}% Present`,
    start: date,
    backgroundColor:
      rate >= 90 ? "#10b981" : rate >= 70 ? "#f59e0b" : "#ef4444",
    borderColor: "transparent",
    textColor: "#fff",
    display: "background",
  }));

  if (dailyLoading || historicalLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (dailyError) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading attendance: {dailyError.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")} • {attendanceRate}%
            Present
          </p>
        </div>
        <input
          type="date"
          value={formattedDate}
          onChange={(e) => setSelectedDate(parseISO(e.target.value))}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... same as before ... */}
      </div>

      {/* Calendar with Historical Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Attendance Trends
        </h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dateClick={(info) => setSelectedDate(parseISO(info.dateStr))}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          height="600px"
          dayCellContent={(arg) => (
            <div className="relative h-full flex flex-col justify-between p-1">
              <div className="text-sm font-medium text-right">
                {arg.dayNumberText.trim()}
              </div>
              {historicalRates[format(arg.date, "yyyy-MM-dd")] !== undefined && (
                <div className="text-center mt-1">
                  <span className="inline-block text-xs bg-white/90 text-gray-800 px-2 py-0.5 rounded font-bold">
                    {historicalRates[format(arg.date, "yyyy-MM-dd")]}%
                  </span>
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Daily Attendance Details
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
                  Clock In
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Clock Out
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Hours
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-500">
                    No employees or attendance data for this date
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr
                    key={
                      record._id || `generated-${record.employee._id}-${index}`
                    }
                    className={`border-b hover:bg-gray-50 ${
                      record.status === "Absent" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-medium">
                      {record.employee.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {record.employee.department?.name || "-"}
                    </td>
                    <td className="py-4 px-6">{formatTime(record.clockIn)}</td>
                    <td className="py-4 px-6">{formatTime(record.clockOut)}</td>
                    <td className="py-4 px-6">
                      {record.workHours > 0 ? `${record.workHours} hrs` : "—"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "Present" ||
                          record.status === "Late"
                            ? "bg-green-100 text-green-800"
                            : record.status === "On Leave"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                          aria-label="Edit attendance"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {record.status !== "Absent" && (
                          <button
                            onClick={() => handleMarkAbsent(record)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            aria-label="Mark as absent"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
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

      {/* Edit Modal - Real Update */}
      {editModalOpen && currentRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Edit Attendance - {currentRecord.employee.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clock In
                </label>
                <input
                  type="time"
                  id="clockInInput"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  defaultValue={
                    currentRecord.clockIn
                      ? formatTime(currentRecord.clockIn).slice(0, 5)
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clock Out
                </label>
                <input
                  type="time"
                  id="clockOutInput"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  defaultValue={
                    currentRecord.clockOut
                      ? formatTime(currentRecord.clockOut).slice(0, 5)
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="statusSelect"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  defaultValue={currentRecord.status}
                >
                  <option>Present</option>
                  <option>Late</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setCurrentRecord(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const clockInVal =
                    document.getElementById("clockInInput").value;
                  const clockOutVal =
                    document.getElementById("clockOutInput").value;
                  const statusVal =
                    document.getElementById("statusSelect").value;

                  const data = {
                    clockIn: clockInVal
                      ? `${formattedDate}T${clockInVal}:00`
                      : null,
                    clockOut: clockOutVal
                      ? `${formattedDate}T${clockOutVal}:00`
                      : null,
                    status: statusVal,
                    ...(!currentRecord._id && {
                      employeeId: currentRecord.employee._id,
                      date: formattedDate,
                    }),
                  };

                  overrideMutation.mutate({
                    recordId: currentRecord._id || "new",
                    data,
                  });
                }}
                disabled={overrideMutation.isPending}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {overrideMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}