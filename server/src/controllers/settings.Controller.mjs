import Settings from "../models/Settings.mjs";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await Settings.create({
        company: {
          name: "TomBrownBabies",
          email: "info@tombrownbabies.com",
          phone: "+233 123 456 789",
          address: "123 Business Street, Accra, Ghana",
          website: "www.tombrownbabies.com",
        },
        work: {
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          startTime: "09:00",
          endTime: "17:00",
          breakDuration: "60",
          overtimeRate: 1.5,
          lateArrivalGrace: "15",
        },
        leave: {
          annualLeave: 21,
          sickLeave: 10,
          maternityLeave: 90,
          paternityLeave: 7,
          casualLeave: 5,
        },
        payroll: {
          currency: "GHS",
          paymentCycle: "monthly",
          paymentDay: "25",
          taxRate: 15,
          socialSecurityRate: 13,
        },
        notifications: {
          emailNotifications: true,
          leaveRequests: true,
          newEmployees: true,
          payrollReminders: true,
          systemUpdates: false,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: "30",
          passwordExpiry: "90",
          loginAttempts: "3",
        },
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error loading settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    // Update all sections
    Object.assign(settings.company, req.body.company || {});
    Object.assign(settings.work, req.body.work || {});
    Object.assign(settings.leave, req.body.leave || {});
    Object.assign(settings.payroll, req.body.payroll || {});
    Object.assign(settings.notifications, req.body.notifications || {});
    Object.assign(settings.security, req.body.security || {});

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error saving settings" });
  }
};