import Attendance from "../models/Attendance.mjs";
import LeaveRequest from "../models/LeaveRequest.mjs"; // For leave integration
import Employee from "../models/Employee.mjs";

// Get attendance for a specific date (default: today)
// src/controllers/attendanceController.mjs
export const getAttendance = async (req, res) => {
  try {
    let { date } = req.query;
    // Force UTC midnight regardless of input
    const queryDate = date 
      ? new Date(Date.UTC(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]))
      : new Date();
    queryDate.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(queryDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);


    // 1. Get existing attendance records for the date
    const attendanceRecords = await Attendance.find({
      date: { $gte: queryDate, $lt: nextDay },
    }).populate("employee", "name email department role");

    // 2. Get ALL employees
    const allEmployees = await Employee.find().select("name email department role");

    // 3. Get approved leaves for this date
    const approvedLeaves = await LeaveRequest.find({
      status: "Approved",
      startDate: { $lte: queryDate },
      endDate: { $gte: queryDate },
    }).select("employee");

    const onLeaveIds = approvedLeaves.map(l => l.employee.toString());

    // 4. Build complete attendance list
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.employee._id.toString(), record);
    });

    const fullAttendance = allEmployees.map(emp => {
      const existing = attendanceMap.get(emp._id.toString());

      if (existing) return existing;

      // No record → check if on approved leave
      if (onLeaveIds.includes(emp._id.toString())) {
        return {
          employee: emp,
          date: queryDate,
          clockIn: null,
          clockOut: null,
          status: "On Leave",
          workHours: 0,
          notes: "Approved leave",
          _id: null // temporary
        };
      }

      // Truly absent
      return {
        employee: emp,
        date: queryDate,
        clockIn: null,
        clockOut: null,
        status: "Absent",
        workHours: 0,
        notes: "",
        _id: null
      };
    });

    res.json(fullAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Clock in/out (will be used by employee dashboard later)
export const clockIn = async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    let record = await Attendance.findOne({ employee: employeeId, date: today });

    if (!record) {
      record = new Attendance({
        employee: employeeId,
        date: today,
        clockIn: new Date(),
        status: "Present",
      });
    } else if (record.clockIn) {
      return res.status(400).json({ message: "Already clocked in today" });
    } else {
      record.clockIn = new Date();
      record.status = "Present";
    }

    await record.save();
    await record.populate("employee", "name");

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clockOut = async (req, res) => {
  const { employeeId } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const record = await Attendance.findOne({ employee: employeeId, date: today });

    if (!record || !record.clockIn) {
      return res.status(400).json({ message: "Not clocked in today" });
    }

    if (record.clockOut) {
      return res.status(400).json({ message: "Already clocked out" });
    }

    record.clockOut = new Date();
    await record.save();
    await record.populate("employee", "name");

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/controllers/attendanceController.mjs

// ... your existing imports and functions ...

// Update attendance record (admin manual override)
export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { clockIn, clockOut, status, notes, employeeId, date: recordDate } = req.body;

  try {
    let record;

    if (id && id !== "null") {
      record = await Attendance.findById(id);
      if (!record) return res.status(404).json({ message: "Record not found" });
    } else {
      // Create new record for generated entry
      if (!employeeId || !recordDate) {
        return res.status(400).json({ message: "employeeId and date required for new record" });
      }

      record = new Attendance({
        employee: employeeId,
        date: new Date(recordDate),
      });
    }

    // Apply updates
    if (clockIn !== undefined) record.clockIn = clockIn ? new Date(clockIn) : null;
    if (clockOut !== undefined) record.clockOut = clockOut ? new Date(clockOut) : null;
    if (status) record.status = status;
    if (notes !== undefined) record.notes = notes;

    // Recalculate hours (safe for new records)
    if (record.clockIn && record.clockOut) {
      const hours = (new Date(record.clockOut) - new Date(record.clockIn)) / (1000 * 60 * 60);
      record.workHours = parseFloat(hours.toFixed(2));
    } else {
      record.workHours = 0;
    }

    await record.save();
    await record.populate("employee", "name email department role");

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};