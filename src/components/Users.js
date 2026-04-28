import React, { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, Search, AlertCircle, Loader } from 'lucide-react';

const UsersSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    role: 'student',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // API call function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const url = `http://172.28.27.50:5002/api${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };
    
    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/users');
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  // Validation
  const validateUser = (userData) => {
    const newErrors = {};
    
    if (!userData.name?.trim()) newErrors.name = 'ຕ້ອງມີຊື່ຜູ້ໃຊ້';
    if (!userData.email?.trim()) {
      newErrors.email = 'ຕ້ອງມີອີເມວ';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ';
    }
    if (!userData.password?.trim() && !selectedUser) {
      newErrors.password = 'ຕ້ອງມີລະຫັດຜ່ານ';
    } else if (userData.password && userData.password.length < 6) {
      newErrors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new user
  const handleAddUser = async () => {
    if (!validateUser(newUser)) return;
    
    setSubmitLoading(true);
    try {
      const response = await apiCall('/users', {
        method: 'POST',
        body: newUser
      });
      
      setUsers([...users, response.user]);
      setNewUser({ name: '', email: '', phone: '', role: 'student', password: '' });
      setShowAddUser(false);
      setErrors({});
      alert('ເພີ່ມຜູ້ໃຊ້ໃໝ່ສຳເລັດ!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຜູ້ໃຊ້: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser({
      ...user,
      password: '' // Don't show password
    });
    setShowEditUser(true);
    setErrors({});
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!validateUser(selectedUser)) return;
    
    setSubmitLoading(true);
    try {
      const updateData = { ...selectedUser };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }
      
      const response = await apiCall(`/users/${selectedUser.id}`, {
        method: 'PUT',
        body: updateData
      });
      
      setUsers(users.map(u => u.id === selectedUser.id ? response.user : u));
      setShowEditUser(false);
      setSelectedUser(null);
      setErrors({});
      alert('ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດ!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂ: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ໃຊ້ນີ້?')) return;
    
    setLoading(true);
    try {
      await apiCall(`/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
      alert('ລຶບຜູ້ໃຊ້ສຳເລັດ!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການລຶບ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'purple';
      case 'staff': return 'blue';
      case 'student': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'gray';
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Never') return 'Never';
    try {
      return new Date(dateString).toLocaleString('lo-LA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setSelectedUser(prev => ({ ...prev, [field]: value }));
    } else {
      setNewUser(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const closeModal = () => {
    setShowAddUser(false);
    setShowEditUser(false);
    setSelectedUser(null);
    setNewUser({ name: '', email: '', phone: '', role: 'student', password: '' });
    setErrors({});
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ຈັດການຜູ້ໃຊ້ງານ</h2>
          <p className="text-gray-600">ຈັດການບັນຊີຜູ້ໃຊ້ ແລະ ສິດການເຂົ້າຖຶງ</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>ເພີ່ມຜູ້ໃຊ້ໃໝ່</span>
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ເພີ່ມຜູ້ໃຊ້ໃໝ່</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊື່-ນາມສະກຸນ *
                  </label>
                  <input
                    type="text"
                    placeholder="ປ້ອນຊື່ຫູ້ໃຊ້"
                    value={newUser.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ອີເມວ *
                  </label>
                  <input
                    type="email"
                    placeholder="example@ict.la"
                    value={newUser.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ເບີໂທລະສັບ</label>
                  <input
                    type="tel"
                    placeholder="020 xxxx xxxx"
                    value={newUser.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ບົດບາດ</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ລະຫັດຜ່ານ *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ຍົກເລີກ
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={submitLoading}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ກຳລັງບັນທຶກ...
                    </>
                  ) : (
                    'ເພີ່ມຜູ້ໃຊ້'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊື່-ນາມສະກຸນ *
                  </label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => handleInputChange('name', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ອີເມວ *
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => handleInputChange('email', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ເບີໂທລະສັບ</label>
                  <input
                    type="tel"
                    value={selectedUser.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ບົດບາດ</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleInputChange('role', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ສະຖານະ</label>
                  <select
                    value={selectedUser.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ລະຫັດຜ່ານໃໝ່ (ປ່ອຍຫວ່າງຖ້າບໍ່ຕ້ອງການປ່ຽນ)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={selectedUser.password}
                    onChange={(e) => handleInputChange('password', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ຍົກເລີກ
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={submitLoading}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ກຳລັງອັບເດດ...
                    </>
                  ) : (
                    'ບັນທຶກການປ່ຽນແປງ'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ຄົ້ນຫາຜູ້ໃຊ້..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">ທັງໝົດ</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
          </div>
          <p className="text-sm text-gray-600">
            ສະແດງ {filteredUsers.length} ຈາກທັງໝົດ {users.length} ຜູ້ໃຊ້
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ຊື່ຜູ້ໃຊ້</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ອີເມວ</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ເບີໂທ</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ບົດບາດ</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ສະຖານະ</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ເຂົ້າໃຊ້ລ່າສຸດ</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      {users.length === 0 ? 'ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້' : 'ບໍ່ພົບຜູ້ໃຊ້ທີ່ຄົ້ນຫາ'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-gray-600">{user.email}</td>
                      <td className="py-3 px-6 text-gray-600">{user.phone || '-'}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded text-sm bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-700`}>
                          {user.role || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-1 rounded text-sm bg-${getStatusColor(user.status)}-100 text-${getStatusColor(user.status)}-700`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-600">
                        {formatDate(user.last_login || user.lastLogin)}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            title="ແກ້ໄຂ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                            title="ລຶບ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersSection;



