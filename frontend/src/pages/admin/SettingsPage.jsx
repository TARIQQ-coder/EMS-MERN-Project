// src/pages/admin/SettingsPage.jsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Users,
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Key,
  UserCog,
  FileText,
  Download,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { settingsService } from "../../services/settingsService.js"; // ← New import

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("company");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch real settings from backend
  const {
    data: settingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });

  // Mutation to save settings
  const updateMutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save settings");
      setIsSaving(false);
    },
  });

  // Use real data or fallback while loading
  const settings = settingsData || {
    company: {
      name: "TomBrownBabies",
      email: "info@tombrownbabies.com",
      phone: "+233 123 456 789",
      address: "123 Business Street, Accra, Ghana",
      website: "www.tombrownbabies.com",
      taxId: "TIN-123456789",
      registrationNumber: "REG-2024-001",
    },
    work: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: "60",
      overtimeRate: "1.5",
      lateArrivalGrace: "15",
    },
    leave: {
      annualLeave: "21",
      sickLeave: "10",
      maternityLeave: "90",
      paternityLeave: "7",
      casualLeave: "5",
    },
    payroll: {
      currency: "GHS",
      paymentCycle: "monthly",
      paymentDay: "25",
      taxRate: "15",
      socialSecurityRate: "13",
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
  };

  // Local state mirrors backend structure
  // With this safe version
const [companySettings, setCompanySettings] = useState(settings?.company || {});
const [workSettings, setWorkSettings] = useState({
  workingDays: settings.work?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  startTime: settings.work?.startTime || "09:00",
  endTime: settings.work?.endTime || "17:00",
  breakDuration: settings.work?.breakDuration || "60",
  overtimeRate: settings.work?.overtimeRate || "1.5",
  lateArrivalGrace: settings.work?.lateArrivalGrace || "15",
});
const [leaveSettings, setLeaveSettings] = useState(settings?.leave || {});
const [payrollSettings, setPayrollSettings] = useState(settings?.payroll || {});
const [notificationSettings, setNotificationSettings] = useState(settings?.notifications || {});
const [securitySettings, setSecuritySettings] = useState(settings?.security || {});

  // Sync local state when data loads
  useEffect(() => {
  if (settingsData) {
    setCompanySettings(settingsData.company || {});
    setWorkSettings({
      workingDays: settingsData.work?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: settingsData.work?.startTime || "09:00",
      endTime: settingsData.work?.endTime || "17:00",
      breakDuration: settingsData.work?.breakDuration || "60",
      overtimeRate: settingsData.work?.overtimeRate || "1.5",
      lateArrivalGrace: settingsData.work?.lateArrivalGrace || "15",
    });
    setLeaveSettings(settingsData.leave || {});
    setPayrollSettings(settingsData.payroll || {});
    setNotificationSettings(settingsData.notifications || {});
    setSecuritySettings(settingsData.security || {});
  }
}, [settingsData]);

  const handleSave = (section) => {
    setIsSaving(true);

    const updatedData = {
      company: companySettings,
      work: workSettings,
      leave: leaveSettings,
      payroll: payrollSettings,
      notifications: notificationSettings,
      security: securitySettings,
    };

    updateMutation.mutate(updatedData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
        <p className="ml-4 text-gray-600">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load settings: {error.message}
      </div>
    );
  }

  // Your entire UI remains 100% unchanged below — only state sources changed
  const TabButton = ({ id, icon: Icon, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
        active
          ? "bg-purple-600 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const SettingCard = ({ children, title, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
          {...props}
        />
      </div>
    </div>
  );

  const SelectField = ({ label, icon: Icon, children, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <select
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none`}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your system preferences and configurations
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <TabButton
            id="company"
            icon={Building2}
            label="Company Info"
            active={activeTab === "company"}
          />
          <TabButton
            id="work"
            icon={Clock}
            label="Work Settings"
            active={activeTab === "work"}
          />
          <TabButton
            id="leave"
            icon={Calendar}
            label="Leave Policies"
            active={activeTab === "leave"}
          />
          <TabButton
            id="payroll"
            icon={DollarSign}
            label="Payroll"
            active={activeTab === "payroll"}
          />
          <TabButton
            id="notifications"
            icon={Bell}
            label="Notifications"
            active={activeTab === "notifications"}
          />
          <TabButton
            id="security"
            icon={Shield}
            label="Security"
            active={activeTab === "security"}
          />
          <TabButton
            id="backup"
            icon={FileText}
            label="Backup & Data"
            active={activeTab === "backup"}
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Company Information */}
          {activeTab === "company" && (
            <>
              <SettingCard
                title="Company Information"
                description="Basic information about your organization"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Company Name"
                    icon={Building2}
                    value={companySettings.name}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        name: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        email: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Phone Number"
                    icon={Phone}
                    value={companySettings.phone}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        phone: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Website"
                    icon={Globe}
                    value={companySettings.website}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        website: e.target.value,
                      })
                    }
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Address"
                      icon={MapPin}
                      value={companySettings.address}
                      onChange={(e) =>
                        setCompanySettings({
                          ...companySettings,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <InputField
                    label="Tax ID"
                    value={companySettings.taxId}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        taxId: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Registration Number"
                    value={companySettings.registrationNumber}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        registrationNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Company")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* Work Settings */}
          {activeTab === "work" && (
            <>
              <SettingCard
                title="Working Hours"
                description="Configure standard working hours and policies"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Start Time"
                    icon={Clock}
                    type="time"
                    value={workSettings.startTime}
                    onChange={(e) =>
                      setWorkSettings({
                        ...workSettings,
                        startTime: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="End Time"
                    icon={Clock}
                    type="time"
                    value={workSettings.endTime}
                    onChange={(e) =>
                      setWorkSettings({
                        ...workSettings,
                        endTime: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Break Duration (minutes)"
                    type="number"
                    value={workSettings.breakDuration}
                    onChange={(e) =>
                      setWorkSettings({
                        ...workSettings,
                        breakDuration: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Late Arrival Grace Period (minutes)"
                    type="number"
                    value={workSettings.lateArrivalGrace}
                    onChange={(e) =>
                      setWorkSettings({
                        ...workSettings,
                        lateArrivalGrace: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Overtime Rate Multiplier"
                    type="number"
                    step="0.1"
                    value={workSettings.overtimeRate}
                    onChange={(e) =>
                      setWorkSettings({
                        ...workSettings,
                        overtimeRate: e.target.value,
                      })
                    }
                  />
                </div>
              </SettingCard>

              <SettingCard title="Working Days">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        if (workSettings.workingDays.includes(day)) {
                          setWorkSettings({
                            ...workSettings,
                            workingDays: workSettings.workingDays.filter(
                              (d) => d !== day
                            ),
                          });
                        } else {
                          setWorkSettings({
                            ...workSettings,
                            workingDays: [...workSettings.workingDays, day],
                          });
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        workSettings.workingDays.includes(day)
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium">{day.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Work")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* Leave Policies */}
          {activeTab === "leave" && (
            <>
              <SettingCard
                title="Leave Entitlements"
                description="Set annual leave allowances for different leave types"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Annual Leave (days)"
                    icon={Calendar}
                    type="number"
                    value={leaveSettings.annualLeave}
                    onChange={(e) =>
                      setLeaveSettings({
                        ...leaveSettings,
                        annualLeave: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Sick Leave (days)"
                    icon={Calendar}
                    type="number"
                    value={leaveSettings.sickLeave}
                    onChange={(e) =>
                      setLeaveSettings({
                        ...leaveSettings,
                        sickLeave: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Maternity Leave (days)"
                    icon={Calendar}
                    type="number"
                    value={leaveSettings.maternityLeave}
                    onChange={(e) =>
                      setLeaveSettings({
                        ...leaveSettings,
                        maternityLeave: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Paternity Leave (days)"
                    icon={Calendar}
                    type="number"
                    value={leaveSettings.paternityLeave}
                    onChange={(e) =>
                      setLeaveSettings({
                        ...leaveSettings,
                        paternityLeave: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Casual Leave (days)"
                    icon={Calendar}
                    type="number"
                    value={leaveSettings.casualLeave}
                    onChange={(e) =>
                      setLeaveSettings({
                        ...leaveSettings,
                        casualLeave: e.target.value,
                      })
                    }
                  />
                </div>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Leave")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          

          {/* Payroll Settings */}
          {activeTab === "payroll" && (
            <>
              <SettingCard
                title="Payroll Configuration"
                description="Configure payroll processing and tax settings"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField label="Currency" icon={DollarSign} value={payrollSettings.currency}>
                    <option value="GHS">GHS - Ghanaian Cedi</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </SelectField>
                  <SelectField label="Payment Cycle" value={payrollSettings.paymentCycle}>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </SelectField>
                  <InputField
                    label="Payment Day of Month"
                    type="number"
                    min="1"
                    max="31"
                    value={payrollSettings.paymentDay}
                    onChange={(e) =>
                      setPayrollSettings({
                        ...payrollSettings,
                        paymentDay: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Tax Rate (%)"
                    type="number"
                    step="0.1"
                    value={payrollSettings.taxRate}
                    onChange={(e) =>
                      setPayrollSettings({
                        ...payrollSettings,
                        taxRate: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Social Security Rate (%)"
                    type="number"
                    step="0.1"
                    value={payrollSettings.socialSecurityRate}
                    onChange={(e) =>
                      setPayrollSettings({
                        ...payrollSettings,
                        socialSecurityRate: e.target.value,
                      })
                    }
                  />
                </div>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Payroll")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          

          {/* Notifications */}
          {activeTab === "notifications" && (
            <>
              <SettingCard
                title="Notification Preferences"
                description="Choose what notifications you want to receive"
              >
                <div className="space-y-3">
                  <ToggleSwitch
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={notificationSettings.emailNotifications}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                  <ToggleSwitch
                    label="Leave Requests"
                    description="Get notified when employees submit leave requests"
                    checked={notificationSettings.leaveRequests}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        leaveRequests: checked,
                      })
                    }
                  />
                  <ToggleSwitch
                    label="New Employees"
                    description="Get notified when new employees are added"
                    checked={notificationSettings.newEmployees}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newEmployees: checked,
                      })
                    }
                  />
                  <ToggleSwitch
                    label="Payroll Reminders"
                    description="Receive reminders for payroll processing"
                    checked={notificationSettings.payrollReminders}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        payrollReminders: checked,
                      })
                    }
                  />
                  <ToggleSwitch
                    label="System Updates"
                    description="Get notified about system updates and maintenance"
                    checked={notificationSettings.systemUpdates}
                    onChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        systemUpdates: checked,
                      })
                    }
                  />
                </div>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Notification")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <>
              <SettingCard
                title="Security Settings"
                description="Manage security and access control"
              >
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Two-Factor Authentication"
                    description="Require 2FA for admin users"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <SelectField
                      label="Session Timeout (minutes)"
                      icon={Clock}
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                      }
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </SelectField>

                    <SelectField
                      label="Password Expiry (days)"
                      icon={Lock}
                      value={securitySettings.passwordExpiry}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordExpiry: e.target.value,
                        })
                      }
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="never">Never</option>
                    </SelectField>

                    <SelectField
                      label="Max Login Attempts"
                      icon={Key}
                      value={securitySettings.loginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          loginAttempts: e.target.value,
                        })
                      }
                    >
                      <option value="3">3 attempts</option>
                      <option value="5">5 attempts</option>
                      <option value="10">10 attempts</option>
                    </SelectField>
                  </div>
                </div>
              </SettingCard>

              <SettingCard title="Change Password">
                <div className="grid grid-cols-1 gap-4">
                  <InputField
                    label="Current Password"
                    icon={Lock}
                    type="password"
                    placeholder="Enter current password"
                  />
                  <InputField
                    label="New Password"
                    icon={Lock}
                    type="password"
                    placeholder="Enter new password"
                  />
                  <InputField
                    label="Confirm New Password"
                    icon={Lock}
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition">
                  Update Password
                </button>
              </SettingCard>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("Security")}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* Backup & Data */}
          {activeTab === "backup" && (
            <>
              <SettingCard
                title="Data Backup"
                description="Manage your data backups and exports"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Last Backup
                        </p>
                        <p className="text-sm text-gray-600">
                          January 5, 2026 at 2:30 PM
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition group">
                      <Download className="w-8 h-8 text-gray-600 group-hover:text-purple-600 mb-3" />
                      <p className="font-semibold text-gray-800 mb-1">
                        Export All Data
                      </p>
                      <p className="text-sm text-gray-600">
                        Download complete database backup
                      </p>
                    </button>

                    <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition group">
                      <Upload className="w-8 h-8 text-gray-600 group-hover:text-green-600 mb-3" />
                      <p className="font-semibold text-gray-800 mb-1">
                        Import Data
                      </p>
                      <p className="text-sm text-gray-600">
                        Restore from backup file
                      </p>
                    </button>
                  </div>
                </div>
              </SettingCard>

              <SettingCard title="Danger Zone">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-800 mb-1">
                          Delete All Data
                        </p>
                        <p className="text-sm text-red-700 mb-3">
                          This will permanently delete all employees, departments,
                          attendance records, and settings. This action cannot be
                          undone.
                        </p>
                        <button
                          onClick={() =>
                            toast.error(
                              "This is a demo. Data deletion is disabled."
                            )
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}