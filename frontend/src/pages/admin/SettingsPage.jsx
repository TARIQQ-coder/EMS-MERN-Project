// src/pages/admin/SettingsPage.jsx
import React, { useState } from "react";
import { User, Building2, Lock, Briefcase, DollarSign } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@tombrownbabies.com",
    phone: "+233 20 123 4567",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [company, setCompany] = useState({
    name: "TomBrownBabies",
    email: "info@tombrownbabies.com",
    phone: "+233 30 123 4567",
    address: "123 Independence Avenue, Accra, Ghana",
    website: "www.tombrownbabies.com",
  });

  const [leavePolicy, setLeavePolicy] = useState({
    sick: 10,
    casual: 12,
    annual: 21,
    maternity: 180,
  });

  const [payroll, setPayroll] = useState({
    currency: "GHS", // Default to Ghana Cedis
    defaultBonus: 10,
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
  };

  const handleCompanySave = (e) => {
    e.preventDefault();
    alert("Company information updated!");
  };

  const handleLeaveSave = (e) => {
    e.preventDefault();
    alert("Leave policy updated!");
  };

  const handlePayrollSave = (e) => {
    e.preventDefault();
    alert("Payroll settings saved!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and organization preferences</p>
      </div>

      {/* Admin Profile */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <User className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Admin Profile</h2>
        </div>

        <div className="flex items-center gap-8 mb-8">
          <div className="w-32 h-32 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <button className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Change Photo
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG/PNG, max 2MB</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <Lock className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Company Information</h2>
        </div>

        <form onSubmit={handleCompanySave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Save Company Info
            </button>
          </div>
        </form>
      </div>

      {/* Leave Policy */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <Briefcase className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Leave Policy</h2>
        </div>

        <form onSubmit={handleLeaveSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave (days/year)</label>
            <input
              type="number"
              value={leavePolicy.sick}
              onChange={(e) => setLeavePolicy({ ...leavePolicy, sick: Number(e.target.value) })}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Casual Leave (days/year)</label>
            <input
              type="number"
              value={leavePolicy.casual}
              onChange={(e) => setLeavePolicy({ ...leavePolicy, casual: Number(e.target.value) })}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Leave (days/year)</label>
            <input
              type="number"
              value={leavePolicy.annual}
              onChange={(e) => setLeavePolicy({ ...leavePolicy, annual: Number(e.target.value) })}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maternity Leave (days)</label>
            <input
              type="number"
              value={leavePolicy.maternity}
              onChange={(e) => setLeavePolicy({ ...leavePolicy, maternity: Number(e.target.value) })}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Update Leave Policy
            </button>
          </div>
        </form>
      </div>

      {/* Payroll Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <DollarSign className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Payroll Settings</h2>
        </div>

        <form onSubmit={handlePayrollSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
            <select
              value={payroll.currency}
              onChange={(e) => setPayroll({ ...payroll, currency: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="GHS">GHS (₵ Ghanaian Cedi)</option>
              <option value="USD">USD ($ US Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Bonus (% of base)</label>
            <input
              type="number"
              value={payroll.defaultBonus}
              onChange={(e) => setPayroll({ ...payroll, defaultBonus: Number(e.target.value) })}
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
              Save Payroll Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}