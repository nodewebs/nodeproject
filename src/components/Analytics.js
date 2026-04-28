import React from 'react';
import { FileText, Database, Users, Download, Upload, Edit, Trash2 } from 'lucide-react';

const Analytics = ({ files }) => {
  const stats = [
    { label: 'ໄຟລ໌ທັງໝົດ', value: files.length, icon: FileText, color: 'purple' },
    { label: 'ພື້ນທີ່ໃຊ້ງານ', value: '45.2 GB', icon: Database, color: 'blue' },
    { label: 'ຜູ້ໃຊ້ງານ', value: '128', icon: Users, color: 'green' },
    { label: 'ດາວໂຫຼດ', value: '3,547', icon: Download, color: 'orange' },
  ];

  const chartData = [
    { name: 'PDF', value: 45, color: '#8b5cf6' },
    { name: 'Excel', value: 30, color: '#3b82f6' },
    { name: 'CSV', value: 15, color: '#10b981' },
    { name: 'Other', value: 10, color: '#f59e0b' },
  ];

  const activities = [
    { action: 'ອັບໂຫຼດໄຟລ໌', file: 'ໃບຄະແນນ_2024.pdf', time: '2 ນາທີກ່ອນ', icon: Upload, user: 'Admin' },
    { action: 'ດາວໂຫຼດ', file: 'ໃບປະກາດ_IT.pdf', time: '15 ນາທີກ່ອນ', icon: Download, user: 'Student' },
    { action: 'ແກ້ໄຂ', file: 'ຂໍ້ມູນນັກສຶກສາ.xlsx', time: '1 ຊົ່ວໂມງກ່ອນ', icon: Edit, user: 'Staff' },
    { action: 'ລຶບໄຟລ໌', file: 'temp_data.csv', time: '3 ຊົ່ວໂມງກ່ອນ', icon: Trash2, user: 'Admin' },
  ];

  const monthlyData = [
    { month: 'ມັງກອນ', uploads: 245, downloads: 189 },
    { month: 'ກຸມພາ', uploads: 312, downloads: 256 },
    { month: 'ມີນາ', uploads: 289, downloads: 234 },
  ];

  const colorClasses = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ສະຖິຕິ & ການວິເຄາະ</h2>
        <p className="text-gray-600">ຂໍ້ມູນສະຖິຕິການໃຊ້ງານລະບົບ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[stat.color]} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stat.label === 'ໄຟລ໌ທັງໝົດ' && '+12% ຈາກເດືອນກ່ອນ'}
                {stat.label === 'ພື້ນທີ່ໃຊ້ງານ' && '68% ຂອງທັງໝົດ'}
                {stat.label === 'ຜູ້ໃຊ້ງານ' && '24 ຜູ້ໃຊ້ໃໝ່'}
                {stat.label === 'ດາວໂຫຼດ' && '+45% ຈາກເດືອນກ່ອນ'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Types Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ປະເພດໄຟລ໌</h3>
          <div className="space-y-4">
            {chartData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ທັງໝົດ: <span className="font-medium text-gray-900">1,234 ໄຟລ໌</span>
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ກິດຈະກຳລ່າສຸດ</h3>
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{activity.file}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">ແນວໂນ້ມລາຍເດືອນ</h3>
        <div className="grid grid-cols-3 gap-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="text-center">
              <h4 className="font-medium text-gray-700 mb-3">{data.month}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-purple-50 rounded p-2">
                  <span className="text-sm text-purple-700">ອັບໂຫຼດ</span>
                  <span className="font-medium text-purple-900">{data.uploads}</span>
                </div>
                <div className="flex items-center justify-between bg-blue-50 rounded p-2">
                  <span className="text-sm text-blue-700">ດາວໂຫຼດ</span>
                  <span className="font-medium text-blue-900">{data.downloads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;