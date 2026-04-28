import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Search, AlertCircle, Loader, Clock, Users, Award } from 'lucide-react';

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    name_lao: '',
    name_eng: '',
    credit: '',
    theory_hours: '',
    lab_hours: '',
    practice_hours: '',
    semester: '',
    year: '',
    remark: '',
    ext1: '',
    ext2: ''
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

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/courses');
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນຫຼັກສູດ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years for filter
  const availableYears = [...new Set(courses.map(course => course.year))].sort((a, b) => b - a);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchSearch = course.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.name_lao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.name_eng?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSemester = filterSemester === 'all' || course.semester?.toString() === filterSemester;
    const matchYear = filterYear === 'all' || course.year?.toString() === filterYear;
    return matchSearch && matchSemester && matchYear;
  });

  // Validation
  const validateCourse = (courseData) => {
    const newErrors = {};
    
    if (!courseData.course_code?.trim()) newErrors.course_code = 'ຕ້ອງມີລະຫັດວິຊາ';
    if (!courseData.name_lao?.trim()) newErrors.name_lao = 'ຕ້ອງມີຊື່ວິຊາພາສາລາວ';
    if (!courseData.name_eng?.trim()) newErrors.name_eng = 'ຕ້ອງມີຊື່ວິຊາພາສາອັງກິດ';
    if (!courseData.credit || courseData.credit <= 0) newErrors.credit = 'ຕ້ອງມີຫນ່ວຍກິດ';
    if (!courseData.theory_hours || courseData.theory_hours < 0) newErrors.theory_hours = 'ຕ້ອງມີຊົ່ວໂມງທິດສະດີ';
    if (!courseData.semester) newErrors.semester = 'ຕ້ອງເລືອກພາກຮຽນ';
    if (!courseData.year) newErrors.year = 'ຕ້ອງມີປີການຮຽນ';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new course
  const handleAddCourse = async () => {
    if (!validateCourse(newCourse)) return;
    
    setSubmitLoading(true);
    try {
      const response = await apiCall('/courses', {
        method: 'POST',
        body: newCourse
      });
      
      setCourses([...courses, response.course]);
      setNewCourse({
        course_code: '', name_lao: '', name_eng: '', credit: '', 
        theory_hours: '', lab_hours: '', practice_hours: '', 
        semester: '', year: '', remark: '', ext1: '', ext2: ''
      });
      setShowAddCourse(false);
      setErrors({});
      alert('ເພີ່ມວິຊາໃໝ່ສຳເລັດ!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມວິຊາ: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Edit course
  const handleEditCourse = (course) => {
    setSelectedCourse({
      ...course,
      credit: course.credit?.toString() || '',
      theory_hours: course.theory_hours?.toString() || '',
      lab_hours: course.lab_hours?.toString() || '',
      practice_hours: course.practice_hours?.toString() || '',
      semester: course.semester?.toString() || '',
      year: course.year?.toString() || ''
    });
    setShowEditCourse(true);
    setErrors({});
  };

  // Update course
  const handleUpdateCourse = async () => {
    if (!validateCourse(selectedCourse)) return;
    
    setSubmitLoading(true);
    try {
      const response = await apiCall(`/courses/${selectedCourse.course_id}`, {
        method: 'PUT',
        body: selectedCourse
      });
      
      setCourses(courses.map(c => c.course_id === selectedCourse.course_id ? response.course : c));
      setShowEditCourse(false);
      setSelectedCourse(null);
      setErrors({});
      alert('ແກ້ໄຂຂໍ້ມູນວິຊາສຳເລັດ!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂ: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບວິຊານີ້?')) return;
    
    setLoading(true);
    try {
      await apiCall(`/courses/${courseId}`, { method: 'DELETE' });
      setCourses(courses.filter(c => c.course_id !== courseId));
      alert('ລຶບວິຊາສຳເລັດ!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('ເກີດຂໍ້ຜິດພາດໃນການລຶບ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total hours
  const getTotalHours = (course) => {
    const theory = parseInt(course.theory_hours) || 0;
    const lab = parseInt(course.lab_hours) || 0;
    const practice = parseInt(course.practice_hours) || 0;
    return theory + lab + practice;
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setSelectedCourse(prev => ({ ...prev, [field]: value }));
    } else {
      setNewCourse(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const closeModal = () => {
    setShowAddCourse(false);
    setShowEditCourse(false);
    setSelectedCourse(null);
    setNewCourse({
      course_code: '', name_lao: '', name_eng: '', credit: '', 
      theory_hours: '', lab_hours: '', practice_hours: '', 
      semester: '', year: '', remark: '', ext1: '', ext2: ''
    });
    setErrors({});
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ຈັດການຫຼັກສູດວິຊາ</h2>
          <p className="text-gray-600">ຈັດການວິຊາຮຽນແລະຫຼັກສູດການສຶກສາ</p>
        </div>
        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>ເພີ່ມວິຊາໃໝ່</span>
        </button>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ເພີ່ມວິຊາໃໝ່</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ລະຫັດວິຊາ *
                  </label>
                  <input
                    type="text"
                    placeholder="ເຊັ່ນ: ICT101"
                    value={newCourse.course_code}
                    onChange={(e) => handleInputChange('course_code', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.course_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.course_code && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.course_code}
                    </p>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຫນ່ວຍກິດ *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCourse.credit}
                    onChange={(e) => handleInputChange('credit', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.credit ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.credit && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.credit}
                    </p>
                  )}
                </div>

                {/* Course Name Lao */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊື່ວິຊາ (ພາສາລາວ) *
                  </label>
                  <input
                    type="text"
                    placeholder="ຊື່ວິຊາເປັນພາສາລາວ"
                    value={newCourse.name_lao}
                    onChange={(e) => handleInputChange('name_lao', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name_lao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name_lao && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name_lao}
                    </p>
                  )}
                </div>

                {/* Course Name English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊື່ວິຊາ (ພາສາອັງກິດ) *
                  </label>
                  <input
                    type="text"
                    placeholder="Course name in English"
                    value={newCourse.name_eng}
                    onChange={(e) => handleInputChange('name_eng', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name_eng ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name_eng && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name_eng}
                    </p>
                  )}
                </div>

                {/* Theory Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊົ່ວໂມງທິດສະດີ *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.theory_hours}
                    onChange={(e) => handleInputChange('theory_hours', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.theory_hours ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.theory_hours && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.theory_hours}
                    </p>
                  )}
                </div>

                {/* Lab Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊົ່ວໂມງແລັບ
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.lab_hours}
                    onChange={(e) => handleInputChange('lab_hours', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Practice Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ຊົ່ວໂມງປະຕິບັດ
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCourse.practice_hours}
                    onChange={(e) => handleInputChange('practice_hours', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ພາກຮຽນ *
                  </label>
                  <select
                    value={newCourse.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.semester ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">ເລືອກພາກຮຽນ</option>
                    <option value="1">ພາກຮຽນ 1</option>
                    <option value="2">ພາກຮຽນ 2</option>
                  </select>
                  {errors.semester && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.semester}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ປີການຮຽນ *
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    placeholder="2024"
                    value={newCourse.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.year}
                    </p>
                  )}
                </div>

                {/* Remark */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ໝາຍເຫດ
                  </label>
                  <textarea
                    rows="2"
                    placeholder="ໝາຍເຫດເພີ່ມເຕີມ"
                    value={newCourse.remark}
                    onChange={(e) => handleInputChange('remark', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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
                  onClick={handleAddCourse}
                  disabled={submitLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ກຳລັງບັນທຶກ...
                    </>
                  ) : (
                    'ເພີ່ມວິຊາ'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourse && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ແກ້ໄຂຂໍ້ມູນວິຊາ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Similar form fields as Add modal but with selectedCourse data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ລະຫັດວິຊາ *</label>
                  <input
                    type="text"
                    value={selectedCourse.course_code}
                    onChange={(e) => handleInputChange('course_code', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.course_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.course_code && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.course_code}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຫນ່ວຍກິດ *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedCourse.credit}
                    onChange={(e) => handleInputChange('credit', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.credit ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຊື່ວິຊາ (ພາສາລາວ) *</label>
                  <input
                    type="text"
                    value={selectedCourse.name_lao}
                    onChange={(e) => handleInputChange('name_lao', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name_lao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຊື່ວິຊາ (ພາສາອັງກິດ) *</label>
                  <input
                    type="text"
                    value={selectedCourse.name_eng}
                    onChange={(e) => handleInputChange('name_eng', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name_eng ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຊົ່ວໂມງທິດສະດີ *</label>
                  <input
                    type="number"
                    min="0"
                    value={selectedCourse.theory_hours}
                    onChange={(e) => handleInputChange('theory_hours', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.theory_hours ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຊົ່ວໂມງແລັບ</label>
                  <input
                    type="number"
                    min="0"
                    value={selectedCourse.lab_hours}
                    onChange={(e) => handleInputChange('lab_hours', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ຊົ່ວໂມງປະຕິບັດ</label>
                  <input
                    type="number"
                    min="0"
                    value={selectedCourse.practice_hours}
                    onChange={(e) => handleInputChange('practice_hours', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ພາກຮຽນ *</label>
                  <select
                    value={selectedCourse.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.semester ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">ເລືອກພາກຮຽນ</option>
                    <option value="1">ພາກຮຽນ 1</option>
                    <option value="2">ພາກຮຽນ 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ປີການຮຽນ *</label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={selectedCourse.year}
                    onChange={(e) => handleInputChange('year', e.target.value, true)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ໝາຍເຫດ</label>
                  <textarea
                    rows="2"
                    value={selectedCourse.remark || ''}
                    onChange={(e) => handleInputChange('remark', e.target.value, true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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
                  onClick={handleUpdateCourse}
                  disabled={submitLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                placeholder="ຄົ້ນຫາວິຊາ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">ທຸກພາກຮຽນ</option>
              <option value="1">ພາກຮຽນ 1</option>
              <option value="2">ພາກຮຽນ 2</option>
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">ທຸກປີການຮຽນ</option>
              {availableYears.map(year => (
                <option key={year} value={year}>ປີ {year}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            ສະແດງ {filteredCourses.length} ຈາກທັງໝົດ {courses.length} ວິຊາ
          </p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-6 h-6 animate-spin text-green-600" />
              <span className="text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">ລະຫັດວິຊາ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">ຊື່ວິຊາ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">ຫນ່ວຍກິດ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">ຊົ່ວໂມງ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">ພາກ/ປີ</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">ການດຳເນີນການ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <BookOpen className="w-12 h-12 text-gray-300" />
                        <span>
                          {courses.length === 0 ? 'ບໍ່ມີຂໍ້ມູນວິຊາ' : 'ບໍ່ພົບວິຊາທີ່ຄົ້ນຫາ'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.course_id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-blue-600">{course.course_code}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{course.name_lao}</div>
                          <div className="text-sm text-gray-600">{course.name_eng}</div>
                          {course.remark && (
                            <div className="text-xs text-gray-500 mt-1">{course.remark}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {course.credit} ໜ່ວຍ
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center justify-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="font-medium">{getTotalHours(course)} ຊົ່ວໂມງ</span>
                          </div>
                          <div className="text-xs">
                            <span>ທິດສະດີ: {course.theory_hours || 0}</span>
                            {course.lab_hours > 0 && <span> | ແລັບ: {course.lab_hours}</span>}
                            {course.practice_hours > 0 && <span> | ປະຕິບັດ: {course.practice_hours}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="text-sm text-gray-900">
                          <div>ພາກ {course.semester}</div>
                          <div className="text-xs text-gray-500">ປີ {course.year}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="ແກ້ໄຂ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.course_id)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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

      {/* Summary Stats */}
      {courses.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-3">
                <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                <div className="text-sm text-gray-600">ວິຊາທັງໝົດ</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + (parseInt(course.credit) || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">ຫນ່ວຍກິດລວມ</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-3">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + getTotalHours(course), 0)}
                </div>
                <div className="text-sm text-gray-600">ຊົ່ວໂມງລວມ</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-3">
                <div className="text-2xl font-bold text-gray-900">{availableYears.length}</div>
                <div className="text-sm text-gray-600">ປີການຮຽນ</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default CoursesSection;