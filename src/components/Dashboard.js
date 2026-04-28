import React, { useState ,useEffect } from 'react';
import { Upload, Download, FileText, Users, Settings, BarChart3, LogOut, Menu, X, Database, ChevronRight, User } from 'lucide-react';
import FileManager from './FileManager';
import UploadSection from './Upload';
import CoursesSection from './Courses'; // เพิ่มบรรทัดนี้
import Analytics from './Analytics';
import SettingsSection from './Settings';
import ReportsSection from './Reports';
import UsersSection from './Users';
import logo from '../assets/IICT.png';
import axios from 'axios';


const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('files');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([
    // { id: 1, name: 'ໃບຄະແນນ_2024_S1.pdf', size: '2.4 MB', type: 'PDF', uploadDate: '2024-03-15', status: 'completed' },
    // { id: 2, name: 'ຂໍ້ມູນນັກສຶກສາ.xlsx', size: '1.8 MB', type: 'Excel', uploadDate: '2024-03-14', status: 'processing' },
    // { id: 3, name: 'ໃບປະກາດ_IT_2024.pdf', size: '856 KB', type: 'PDF', uploadDate: '2024-03-13', status: 'completed' },
  ]);

  const menuItems = [
    { id: 'files', label: 'My Files', icon: FileText },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'courses', label: 'Courses', icon: Database }, // เพิ่มบรรทัดนี้
    { id: 'reports', label: 'Manage Score', icon: Download },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'files':
        return <FileManager files={files} setFiles={setFiles} />;
      case 'upload':
        return <UploadSection setFiles={setFiles} setActiveTab={setActiveTab} />;
      case 'courses': // เพิ่ม case นี้
        return <CoursesSection />;
      case 'reports':
        return <ReportsSection files={files} />;
      case 'analytics':
        return <Analytics files={files} />;
      case 'users':
        return <UsersSection />;
      case 'settings':
        return <SettingsSection user={user} />;
      default:
        return <FileManager files={files} setFiles={setFiles} />;
    }
  };


  async function fetchFiles() {
    try {
      const response = await axios.get('http://172.28.27.50:5002/api/files', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }
  useEffect(() => { fetchFiles() }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center ml-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r  flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Logo" className="w-15 h-15 object-contain" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  Certificate Management
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 pt-16 lg:pt-0`}>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isDisabled = item.id === 'users' && user?.role !== 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-l-4 border-purple-600'
                      : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;