import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Database, Bell, Save } from 'lucide-react';

const Settings = ({ user }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoBackup: true,
    twoFactorAuth: false,
    dataRetention: '90',
    language: 'lo',
    timezone: 'Asia/Vientiane',
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+856 20 xxxx xxxx',
    department: 'IT Department',
  });

  const handleSettingChange = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('ບັນທຶກການຕັ້ງຄ່າສຳເລັດ!');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ການຕັ້ງຄ່າ</h2>
        <p className="text-gray-600">ຕັ້ງຄ່າລະບົບ ແລະ ຄວາມປອດໄພ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              ຂໍ້ມູນໂປຣໄຟລ໌
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊື່-ນາມສະກຸນ
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ອີເມວ
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ເບີໂທລະສັບ
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ພະແນກ
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                ບັນທຶກການປ່ຽນແປງ
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-600" />
              ການແຈ້ງເຕືອນ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">ຮັບການແຈ້ງເຕືອນຜ່ານອີເມວ</p>
                </div>
                <button
                  onClick={() => handleSettingChange('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              ຄວາມປອດໄພ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">ເພີ່ມຄວາມປອດໄພດ້ວຍການຢືນຢັນ 2 ຂັ້ນຕອນ</p>
                </div>
                <button
                  onClick={() => handleSettingChange('twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Lock className="w-4 h-4 mr-2" />
                  ປ່ຽນລະຫັດຜ່ານ
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              ຂໍ້ມູນ & ການສຳຮອງ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto Backup</p>
                  <p className="text-sm text-gray-600">ສຳຮອງຂໍ້ມູນອັດຕະໂນມັດທຸກມື້</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoBackup')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBackup ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention Period
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="30">30 ມື້</option>
                  <option value="60">60 ມື້</option>
                  <option value="90">90 ມື້</option>
                  <option value="180">180 ມື້</option>
                  <option value="365">1 ປີ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ຂໍ້ມູນບັນຊີ</h3>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-medium text-gray-900">{user?.name}</h4>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mt-2">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-900">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm font-medium text-gray-900">Today</span>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-gray-900">PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">45.2 / 100 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;