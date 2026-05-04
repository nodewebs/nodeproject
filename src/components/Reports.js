// import React, { useState } from 'react';
// import { FileText, Shield, BarChart3, Download, Calendar, Filter } from 'lucide-react';

// const ReportsSection = ({ files }) => {
//   const [selectedReport, setSelectedReport] = useState('transcript');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });

//   const reports = [
//     { id: 'transcript', name: 'ໃບຄະແນນຈາກລະບົບ (Generated Transcript)', count: 245, icon: FileText, color: 'purple' },
//     { id: 'certificate', name: 'ໃບຄະແນນ (Transcript)', count: 189, icon: BarChart3, color: 'blue' },
//     // { id: 'summary', name: 'ສະຫຼຸບຜົນການຮຽນ', count: 67, icon: BarChart3, color: 'green' },
//   ];

//   const reportFiles = {
//     transcript: [
//       // { id: 1, name: 'ໃບຄະແນນ_2024_S1.pdf', date: '2024-03-15', size: '2.4 MB', downloads: 45 },
//       // { id: 2, name: 'ໃບຄະແນນ_2024_S2.pdf', date: '2024-03-14', size: '2.1 MB', downloads: 38 },
//       // { id: 3, name: 'ໃບຄະແນນ_2023_S1.pdf', date: '2024-03-13', size: '2.3 MB', downloads: 52 },
//       // { id: 4, name: 'ໃບຄະແນນ_2023_S2.pdf', date: '2024-03-12', size: '2.2 MB', downloads: 41 },
//     ],
//     certificate: [
//       // { id: 1, name: 'ໃບປະກາດ_IT_2024_1.pdf', date: '2024-03-15', size: '856 KB', downloads: 23 },
//       // { id: 2, name: 'ໃບປະກາດ_IT_2024_2.pdf', date: '2024-03-14', size: '912 KB', downloads: 19 },
//       // { id: 3, name: 'ໃບປະກາດ_CS_2024_1.pdf', date: '2024-03-13', size: '798 KB', downloads: 27 },
//     ],

//   };

//   const handleDownload = (file) => {
//     console.log('Downloading:', file.name);
//     alert(`ກຳລັງດາວໂຫຼດ: ${file.name}`);
//   };

//   const handleGenerateReport = () => {
//     alert('ກຳລັງສ້າງລາຍງານ...');
//   };

//   const getReportColor = (type) => {
//     const colors = {
//       transcript: 'purple',
//       certificate: 'blue',
//       summary: 'green'
//     };
//     return colors[type] || 'gray';
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">ລາຍງານ & ການດາວໂຫຼດ</h2>
//         <p className="text-gray-600">ດາວໂຫຼດລາຍງານສະຫຼຸບ ແລະ ເອກະສານຕ່າງໆ</p>
//       </div>

//       {/* Report Type Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         {reports.map((report) => {
//           const Icon = report.icon;
//           const isSelected = selectedReport === report.id;
//           const color = report.color;

//           return (
//             <button
//               key={report.id}
//               onClick={() => setSelectedReport(report.id)}
//               className={`p-6 rounded-xl border-2 transition-all ${
//                 isSelected
//                   ? `border-${color}-500 bg-${color}-50`
//                   : 'border-gray-200 bg-white hover:border-gray-300'
//               }`}
//             >
//               <Icon className={`w-8 h-8 mb-3 ${
//                 isSelected ? `text-${color}-600` : 'text-gray-400'
//               }`} />
//               <h3 className="font-medium text-gray-900 mb-1">{report.name}</h3>
//               <p className="text-2xl font-bold text-gray-900">{report.count}</p>
//               <p className="text-sm text-gray-600">ເອກະສານ</p>
//             </button>
//           );
//         })}
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ຈາກວັນທີ</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateRange.start}
//                   onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ຫາວັນທີ</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateRange.end}
//                   onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div className="flex items-end">
//               <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                 <Filter className="w-4 h-4" />
//                 <span>ກັ່ນຕອງ</span>
//               </button>
//             </div>
//           </div>
//           <button 
//             onClick={handleGenerateReport}
//             className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
//           >
//             <Download className="w-4 h-4" />
//             <span>ສ້າງລາຍງານໃໝ່</span>
//           </button>
//         </div>
//       </div>

//       {/* Report Files List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-lg font-medium text-gray-900">ລາຍການເອກະສານ</h3>
//           <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
//             <Download className="w-4 h-4" />
//             <span>ດາວໂຫຼດທັງໝົດ</span>
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">ຊື່ເອກະສານ</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">ວັນທີສ້າງ</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">ຂະໜາດ</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">ດາວໂຫຼດ</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">ການດຳເນີນການ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportFiles[selectedReport]?.map((file) => (
//                 <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center space-x-3">
//                       <FileText className={`w-5 h-5 text-${getReportColor(selectedReport)}-600`} />
//                       <span className="font-medium text-gray-900">{file.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4 text-gray-600">{file.date}</td>
//                   <td className="py-3 px-4 text-gray-600">{file.size}</td>
//                   <td className="py-3 px-4">
//                     <span className="text-gray-900 font-medium">{file.downloads}</span>
//                     <span className="text-gray-500 text-sm ml-1">ຄັ້ງ</span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <button 
//                       onClick={() => handleDownload(file)}
//                       className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>


//       </div>
//     </div>
//   );
// };

// export default ReportsSection;

//============================================================================

// import React, { useState, useEffect } from 'react';
// import { FileText, Shield, BarChart3, Download, Calendar, Filter, Edit, Save, X, User, Loader2, AlertCircle } from 'lucide-react';

// const ReportsSection = ({ files }) => {
//   const [selectedReport, setSelectedReport] = useState('transcript');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [editingGrade, setEditingGrade] = useState(null);
//   const [grades, setGrades] = useState({ transcript: [] });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);

//   // Fetch scores from API
//   const fetchScores = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('ບໍ່ພົບ Token ການເຂົ້າສູ່ລະບົບ - ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
//       }

//       const response = await fetch('/api/scores', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       // Check if response is JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         // If it's HTML, likely a 404 or server error page
//         const textResponse = await response.text();
//         console.error('Non-JSON response:', textResponse);
//         throw new Error(`API ບໍ່ສາມາດເຂົ້າເຖິງໄດ້ - Server Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       if (data.success) {
//         setGrades({
//           transcript: data.scores || []
//         });
//       } else {
//         throw new Error(data.error || 'Failed to fetch scores');
//       }
//     } catch (err) {
//       console.error('Error fetching scores:', err);
//       if (err.message.includes('fetch')) {
//         setError('ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Server ໄດ້ - ກະລຸນາກວດສອບວ່າ Server ກຳລັງເຮັດວຽກຢູ່');
//       } else {
//         setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຄະແນນ');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load scores when component mounts
//   useEffect(() => {
//     if (selectedReport === 'transcript') {
//       fetchScores();
//     }
//   }, [selectedReport]);

//   const reports = [
//     { 
//       id: 'transcript', 
//       name: 'ໃບຄະແນນຈາກລະບົບ (Generated Transcript)', 
//       count: grades.transcript.length, 
//       icon: FileText, 
//       color: 'purple' 
//     },
//     { 
//       id: 'certificate', 
//       name: 'ໃບຄະແນນ (Transcript)', 
//       count: 189, 
//       icon: BarChart3, 
//       color: 'blue' 
//     },
//   ];

//   const reportFiles = {
//     certificate: [
//       { id: 1, name: 'ໃບປະກາດ_IT_2024_1.pdf', date: '2024-03-15', size: '856 KB', downloads: 23 },
//       { id: 2, name: 'ໃບປະກາດ_IT_2024_2.pdf', date: '2024-03-14', size: '912 KB', downloads: 19 },
//       { id: 3, name: 'ໃບປະກາດ_CS_2024_1.pdf', date: '2024-03-13', size: '798 KB', downloads: 27 },
//     ],
//   };

//   const handleDownload = (file) => {
//     console.log('Downloading:', file.name);
//     alert(`ກຳລັງດາວໂຫຼດ: ${file.name}`);
//   };

//   const handleGenerateReport = () => {
//     alert('ກຳລັງສ້າງລາຍງານ...');
//   };

//   const handleEditGrade = (gradeRecord) => {
//     setEditingGrade({ ...gradeRecord });
//   };

//   const handleSaveGrade = async () => {
//     if (!editingGrade) return;

//     setSaving(true);
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('ບໍ່ພົບ Token ການເຂົ້າສູ່ລະບົບ - ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
//       }

//       // Calculate final score based on midterm and exam scores
//       const finalScore = (editingGrade.midterm_score * 0.4) + (editingGrade.exam_score * 0.6);
//       const finalGrade = calculateGrade(finalScore);

//       const updatedGrade = {
//         ...editingGrade,
//         final_score: finalScore,
//         final_grade: finalGrade,
//         midterm_grade: calculateGrade(editingGrade.midterm_score),
//         exam_grade: calculateGrade(editingGrade.exam_score)
//       };

//       const response = await fetch(`/api/scores/${updatedGrade.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           student_id: updatedGrade.student_id,
//           course_code: updatedGrade.course_code,
//           academic_year: updatedGrade.academic_year,
//           semester: updatedGrade.score_semester,
//           midterm_score: updatedGrade.midterm_score,
//           midterm_grade: updatedGrade.midterm_grade,
//           exam_score: updatedGrade.exam_score,
//           exam_grade: updatedGrade.exam_grade,
//           final_score: updatedGrade.final_score,
//           final_grade: updatedGrade.final_grade,
//           email: updatedGrade.score_email
//         })
//       });

//       // Check if response is JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const textResponse = await response.text();
//         console.error('Non-JSON response:', textResponse);
//         throw new Error(`API ບໍ່ສາມາດເຂົ້າເຖິງໄດ້ - Server Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       if (data.success) {
//         // Update local state
//         setGrades(prev => ({
//           ...prev,
//           transcript: prev.transcript.map(grade => 
//             grade.id === updatedGrade.id ? updatedGrade : grade
//           )
//         }));

//         setEditingGrade(null);
//         alert('ບັນທຶກຄະແນນສຳເລັດແລ້ວ!');
//       } else {
//         throw new Error(data.error || 'Failed to update score');
//       }
//     } catch (err) {
//       console.error('Error updating score:', err);
//       if (err.message.includes('fetch')) {
//         alert('ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Server ໄດ້');
//       } else {
//         alert(`ເກີດຂໍ້ຜິດພາດ: ${err.message}`);
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   const calculateGrade = (score) => {
//     if (score >= 90) return 'A';
//     if (score >= 85) return 'B+';
//     if (score >= 80) return 'B';
//     if (score >= 75) return 'B-';
//     if (score >= 70) return 'C+';
//     if (score >= 65) return 'C';
//     if (score >= 60) return 'C-';
//     if (score >= 55) return 'D+';
//     if (score >= 50) return 'D';
//     return 'F';
//   };

//   const handleCancelEdit = () => {
//     setEditingGrade(null);
//   };

//   const getReportColor = (type) => {
//     const colors = {
//       transcript: 'purple',
//       certificate: 'blue',
//       summary: 'green'
//     };
//     return colors[type] || 'gray';
//   };

//   const getGradeColor = (grade) => {
//     if (grade === 'A') return 'text-green-600 bg-green-100';
//     if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-100';
//     if (grade === 'B-' || grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-100';
//     if (grade === 'C-' || grade === 'D+' || grade === 'D') return 'text-orange-600 bg-orange-100';
//     return 'text-red-600 bg-red-100';
//   };

//   const handleRefresh = () => {
//     if (selectedReport === 'transcript') {
//       fetchScores();
//     }
//   };

//   const testConnection = async () => {
//     try {
//       const response = await fetch('/api/scores');
//       console.log('Connection test result:', response.status, response.statusText);

//       if (response.status === 401) {
//         alert('❌ Connection OK แต่ Token หมดอายุ - กรุณา Login ใหม่');
//       } else if (response.status === 404) {
//         alert('❌ API Endpoint ไม่พบ - กรุณาตรวจสอบ Server');
//       } else if (response.ok) {
//         alert('✅ API Connection สำเร็จ!');
//       } else {
//         alert(`⚠️ Server Response: ${response.status} ${response.statusText}`);
//       }
//     } catch (err) {
//       console.error('Connection test failed:', err);
//       alert('❌ ไม่สามารถเชื่อมต่อ Server ได้ - กรุณาตรวจสอบว่า Server เปิดอยู่');
//     }
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">ລາຍງານ & ການດາວໂຫຼດ</h2>
//         <p className="text-gray-600">ດາວໂຫຼດລາຍງານສະຫຼຸບ ແລະ ເອກະສານຕ່າງໆ</p>

//         {/* Development Notice */}
//         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//           <p className="text-sm text-blue-800">
//             💡 <strong>ການແກ້ໄຂປັນຫາ:</strong> ຖ້າເກີດຂໍ້ຜິດພາດ JSON กະລຸນາກວດສອບ:
//             <br />• Server ເປີດຢູ່ທີ່ port ທີ່ຖືກຕ້ອງ
//             <br />• Database ເຊື່ອມຕໍ່ສຳເລັດ
//             <br />• API endpoint /api/scores ສາມາດເຂົ້າເຖິງໄດ້
//             <br />• ມີ Authentication token ໃນ localStorage
//           </p>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//           <div className="flex items-start space-x-3">
//             <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-red-800 font-medium">ເກີດຂໍ້ຜິດພາດ</p>
//               <p className="text-red-700 text-sm mt-1">{error}</p>
//               <div className="mt-3 flex items-center space-x-3">
//                 <button 
//                   onClick={handleRefresh}
//                   className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                   ລອງໃໝ່
//                 </button>
//                 <button 
//                   onClick={testConnection}
//                   className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   ທດສອບ API
//                 </button>
//                 <button 
//                   onClick={() => {
//                     console.log('API Base URL:', window.location.origin);
//                     console.log('Token exists:', !!localStorage.getItem('token'));
//                     console.log('Full API URL:', `${window.location.origin}/api/scores`);
//                     alert(`Debug Info:
// API URL: ${window.location.origin}/api/scores
// Token: ${localStorage.getItem('token') ? 'มี' : 'ไม่มี'}
// Current URL: ${window.location.href}`);
//                   }}
//                   className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
//                 >
//                   Debug Info
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Report Type Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {reports.map((report) => {
//           const Icon = report.icon;
//           const isSelected = selectedReport === report.id;
//           const color = report.color;

//           return (
//             <button
//               key={report.id}
//               onClick={() => setSelectedReport(report.id)}
//               className={`p-6 rounded-xl border-2 transition-all ${
//                 isSelected
//                   ? `border-${color}-500 bg-${color}-50`
//                   : 'border-gray-200 bg-white hover:border-gray-300'
//               }`}
//               disabled={loading}
//             >
//               <Icon className={`w-8 h-8 mb-3 ${
//                 isSelected ? `text-${color}-600` : 'text-gray-400'
//               }`} />
//               <h3 className="font-medium text-gray-900 mb-1">{report.name}</h3>
//               <p className="text-2xl font-bold text-gray-900">
//                 {loading && report.id === 'transcript' ? '...' : report.count}
//               </p>
//               <p className="text-sm text-gray-600">ນັກສຶກສາ/ເອກະສານ</p>
//             </button>
//           );
//         })}
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ຈາກວັນທີ</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateRange.start}
//                   onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ຫາວັນທີ</label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="date"
//                   value={dateRange.end}
//                   onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div className="flex items-end">
//               <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                 <Filter className="w-4 h-4" />
//                 <span>ກັ່ນຕອງ</span>
//               </button>
//             </div>
//           </div>
//           <div className="flex space-x-3">
//             {selectedReport === 'transcript' && (
//               <button 
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
//                 <span>ໂຫຼດຂໍ້ມູນໃໝ່</span>
//               </button>
//             )}
//             <button 
//               onClick={handleGenerateReport}
//               className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
//             >
//               <Download className="w-4 h-4" />
//               <span>ສ້າງລາຍງານໃໝ່</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content based on selected report */}
//       {selectedReport === 'transcript' ? (
//         /* Student Grades Table */
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900">ຄະແນນນັກສຶກສາ</h3>
//               <p className="text-sm text-gray-600 mt-1">ລາຍການຄະແນນທັງໝົດຈາກລະບົບ</p>
//             </div>
//             <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all">
//               <Download className="w-4 h-4" />
//               <span>ສົ່ງອອກຄະແນນ</span>
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
//               <span className="ml-3 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b-2 border-gray-200">
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ນັກສຶກສາ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ລະຫັດ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ວິຊາ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ປີການສຶກສາ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ຄະແນນກາງພາກ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ເກຣດ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ຄະແນນສະເໜີ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ເກຣດ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ຄະແນນລວມ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ເກຣດລວມ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ການດຳເນີນການ</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {grades.transcript.length === 0 ? (
//                     <tr>
//                       <td colSpan="11" className="py-8 text-center text-gray-500">
//                         ບໍ່ມີຂໍ້ມູນຄະແນນ
//                       </td>
//                     </tr>
//                   ) : (
//                     grades.transcript.map((student) => (
//                       <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
//                         <td className="py-3 px-4">
//                           <div className="flex items-center space-x-3">
//                             <User className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-1.5" />
//                             <div>
//                               <div className="font-medium text-gray-900">
//                                 {student.first_name_lao} {student.last_name_lao}
//                               </div>
//                               <div className="text-sm text-gray-500">{student.student_email}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className="font-mono text-sm text-gray-900">{student.student_id}</span>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div>
//                             <div className="font-medium text-gray-900">{student.course_name_lao}</div>
//                             <div className="text-sm text-gray-500">{student.course_code}</div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="text-sm text-gray-900">{student.academic_year}</div>
//                           <div className="text-xs text-gray-500">ພາກ {student.score_semester}</div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className="font-medium text-gray-900">
//                             {student.midterm_score ? student.midterm_score : '-'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4">
//                           {student.midterm_grade && (
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.midterm_grade)}`}>
//                               {student.midterm_grade}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className="font-medium text-gray-900">
//                             {student.exam_score ? student.exam_score : '-'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4">
//                           {student.exam_grade && (
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.exam_grade)}`}>
//                               {student.exam_grade}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className="font-bold text-gray-900">
//                             {student.final_score ? parseFloat(student.final_score).toFixed(2) : '-'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4">
//                           {student.final_grade && (
//                             <span className={`px-2 py-1 rounded-full text-sm font-bold ${getGradeColor(student.final_grade)}`}>
//                               {student.final_grade}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-3 px-4">
//                           <button 
//                             onClick={() => handleEditGrade(student)}
//                             className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
//                             title="ແກ້ໄຂຄະແນນ"
//                           >
//                             <Edit className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Regular Report Files List */
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-lg font-medium text-gray-900">ລາຍການເອກະສານ</h3>
//             <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
//               <Download className="w-4 h-4" />
//               <span>ດາວໂຫຼດທັງໝົດ</span>
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ຊື່ເອກະສານ</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ວັນທີສ້າງ</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ຂະໜາດ</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ດາວໂຫຼດ</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">ການດຳເນີນການ</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportFiles[selectedReport]?.map((file) => (
//                   <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       <div className="flex items-center space-x-3">
//                         <FileText className={`w-5 h-5 text-${getReportColor(selectedReport)}-600`} />
//                         <span className="font-medium text-gray-900">{file.name}</span>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4 text-gray-600">{file.date}</td>
//                     <td className="py-3 px-4 text-gray-600">{file.size}</td>
//                     <td className="py-3 px-4">
//                       <span className="text-gray-900 font-medium">{file.downloads}</span>
//                       <span className="text-gray-500 text-sm ml-1">ຄັ້ງ</span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <button 
//                         onClick={() => handleDownload(file)}
//                         className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
//                       >
//                         <Download className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Edit Grade Modal */}
//       {editingGrade && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-gray-900">ແກ້ໄຂຄະແນນ</h3>
//               <button 
//                 onClick={handleCancelEdit}
//                 className="text-gray-400 hover:text-gray-600"
//                 disabled={saving}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ນັກສຶກສາ</label>
//                 <p className="text-gray-900">{editingGrade.first_name_lao} {editingGrade.last_name_lao}</p>
//                 <p className="text-sm text-gray-500">{editingGrade.student_id}</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ວິຊາ</label>
//                 <p className="text-gray-900">{editingGrade.course_name_lao}</p>
//                 <p className="text-sm text-gray-500">{editingGrade.course_code}</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ຄະແນນກາງພາກ</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   step="0.5"
//                   value={editingGrade.midterm_score || ''}
//                   onChange={(e) => setEditingGrade({...editingGrade, midterm_score: parseFloat(e.target.value) || 0})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   disabled={saving}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ຄະແນນສະເໜີ</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   step="0.5"
//                   value={editingGrade.exam_score || ''}
//                   onChange={(e) => setEditingGrade({...editingGrade, exam_score: parseFloat(e.target.value) || 0})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   disabled={saving}
//                 />
//               </div>

//               <div className="bg-gray-50 rounded-lg p-3">
//                 <div className="text-sm text-gray-600">ຄະແນນລວມຄາດຄະເນ:</div>
//                 <div className="text-lg font-bold text-gray-900">
//                   {((editingGrade.midterm_score * 0.4) + (editingGrade.exam_score * 0.6)).toFixed(2)} 
//                   <span className={`ml-2 px-2 py-1 rounded text-sm ${getGradeColor(calculateGrade((editingGrade.midterm_score * 0.4) + (editingGrade.exam_score * 0.6)))}`}>
//                     {calculateGrade((editingGrade.midterm_score * 0.4) + (editingGrade.exam_score * 0.6))}
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">ກາງພາກ 40% + ສະເໜີ 60%</div>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-6">
//               <button 
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                 disabled={saving}
//               >
//                 ຍົກເລີກ
//               </button>
//               <button 
//                 onClick={handleSaveGrade}
//                 disabled={saving}
//                 className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                 <span>{saving ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportsSection;




//=========================================================================




// import React, { useState, useEffect } from 'react';
// import { FileText, Shield, BarChart3, Download, Calendar, Filter, Edit, Save, X, User, Loader2, AlertCircle } from 'lucide-react';

// const ReportsSection = ({ files }) => {
//   const [selectedReport, setSelectedReport] = useState('transcript');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [grades, setGrades] = useState({ transcript: [], discipline: [], overview: {} });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [debugInfo, setDebugInfo] = useState(null);
//   const [editingGrade, setEditingGrade] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Token not found");
//     return { 'Authorization': `Bearer ${token}` };
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     setDebugInfo(null);

//     try {
//       const headers = getAuthHeaders();
//       const response = await fetch(`http://localhost:3001/api/reports/${selectedReport}`, { headers });
//       const contentType = response.headers.get("content-type");

//       if (!response.ok) {
//         const errorText = await response.text();
//         setDebugInfo({ status: response.status, statusText: response.statusText, body: errorText });
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       if (!contentType || !contentType.includes("application/json")) {
//         const text = await response.text();
//         setDebugInfo({ contentType, body: text });
//         throw new Error("Server did not return JSON data");
//       }

//       const data = await response.json();
//       setGrades(prev => ({ ...prev, [selectedReport]: data }));
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, [selectedReport, dateRange]);

//   const calculateGrade = (midterm, exam) => {
//     const final = (midterm * 0.4) + (exam * 0.6);
//     let grade = "F";
//     if (final >= 80) grade = "A";
//     else if (final >= 70) grade = "B";
//     else if (final >= 60) grade = "C";
//     else if (final >= 50) grade = "D";
//     return { final: final.toFixed(1), grade };
//   };

//   const handleEditGrade = (student) => setEditingGrade(student);

//   const handleSaveGrade = async () => {
//     if (!editingGrade) return;

//     // ✅ validation
//     if (
//       editingGrade.midterm_score < 0 || editingGrade.midterm_score > 100 ||
//       editingGrade.exam_score < 0 || editingGrade.exam_score > 100
//     ) {
//       alert("Scores must be between 0 - 100");
//       return;
//     }

//     setSaving(true);
//     try {
//       const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
//       const response = await fetch(
//         `http://localhost:3001/api/reports/transcript/${editingGrade.id}`,
//         { method: "PUT", headers, body: JSON.stringify(editingGrade) }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to update: ${response.status}`);
//       }

//       await fetchData();
//       setEditingGrade(null);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ export CSV function
//   const exportScoresCSV = () => {
//     const transcript = grades.transcript;
//     if (!transcript || transcript.length === 0) {
//       alert("No transcript data to export");
//       return;
//     }

//     const headers = ["Student ID", "Name", "Subject", "Midterm", "Exam", "Final", "Grade"];
//     const rows = transcript.map(s => {
//       const { final, grade } = calculateGrade(s.midterm_score, s.exam_score);
//       return [s.student_id, s.student_name, s.subject, s.midterm_score, s.exam_score, final, grade];
//     });

//     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "student_scores.csv";
//     link.click();
//   };

//   const reportTabs = [
//     { id: 'transcript', label: 'ຄະແນນຮຽນ', icon: FileText, color: "purple" },
//     { id: 'discipline', label: 'ຄວາມປະພຶດ', icon: Shield, color: "blue" },
//     { id: 'overview', label: 'ພາບລວມ', icon: BarChart3, color: "green" }
//   ];

//   const colorClasses = {
//     purple: "border-purple-500 bg-purple-50 text-purple-600",
//     blue: "border-blue-500 bg-blue-50 text-blue-600",
//     green: "border-green-500 bg-green-50 text-green-600"
//   };

//   return (
//     <div className="p-6">
//       {/* header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">ລາຍງານນັກສຶກສາ</h2>
//         <div className="flex gap-3">
//           <button onClick={exportScoresCSV} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
//             <Download className="w-5 h-5 mr-2" /> ສົ່ງອອກຄະແນນ
//           </button>
//           <button onClick={fetchData} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
//             <Loader2 className="w-5 h-5 mr-2" /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* tabs */}
//       <div className="flex gap-4 mb-6">
//         {reportTabs.map(tab => {
//           const isSelected = selectedReport === tab.id;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setSelectedReport(tab.id)}
//               className={`flex items-center px-4 py-2 rounded-lg border transition ${isSelected ? colorClasses[tab.color] : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
//             >
//               <tab.icon className="w-5 h-5 mr-2" /> {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* error */}
//       {error && (
//         <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
//           <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
//           <div>
//             <p className="font-medium">Error: {error}</p>
//             {debugInfo && (
//               <details className="mt-2">
//                 <summary className="cursor-pointer text-sm">Debug Details</summary>
//                 <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">{JSON.stringify(debugInfo, null, 2)}</pre>
//               </details>
//             )}
//           </div>
//         </div>
//       )}

//       {/* loading */}
//       {loading ? (
//         <div className="flex justify-center items-center p-8">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//           <span className="ml-3 text-gray-600">Loading {selectedReport}...</span>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {selectedReport === "transcript" && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ລະຫັດນັກສຶກສາ</th>
//                     <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ຊື່</th>
//                     <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ວິຊາ</th>
//                     <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">ຄະແນນກາງເທິງ</th>
//                     <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">ຄະແນນສອບ</th>
//                     <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">ຄະແນນລວມ</th>
//                     <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">ເກຣດ</th>
//                     <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {grades.transcript?.map(student => {
//                     const { final, grade } = calculateGrade(student.midterm_score, student.exam_score);
//                     return (
//                       <tr key={student.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm">{student.student_id}</td>
//                         <td className="px-4 py-3 text-sm">{student.student_name}</td>
//                         <td className="px-4 py-3 text-sm">{student.subject}</td>
//                         <td className="px-4 py-3 text-center text-sm">{student.midterm_score}</td>
//                         <td className="px-4 py-3 text-center text-sm">{student.exam_score}</td>
//                         <td className="px-4 py-3 text-center text-sm">{final}</td>
//                         <td className="px-4 py-3 text-center text-sm font-medium">{grade}</td>
//                         <td className="px-4 py-3 text-center text-sm">
//                           <button onClick={() => handleEditGrade(student)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
//                             <Edit className="w-4 h-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* modal */}
//       {editingGrade && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">Edit Grade - {editingGrade.student_name}</h3>
//               <button onClick={() => setEditingGrade(null)} className="p-1 text-gray-500 hover:text-gray-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Midterm Score</label>
//                 <input type="number" min="0" max="100" value={editingGrade.midterm_score}
//                   onChange={e => setEditingGrade({ ...editingGrade, midterm_score: Number(e.target.value) })}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Exam Score</label>
//                 <input type="number" min="0" max="100" value={editingGrade.exam_score}
//                   onChange={e => setEditingGrade({ ...editingGrade, exam_score: Number(e.target.value) })}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 {(() => {
//                   const predictedFinal = (editingGrade.midterm_score * 0.4) + (editingGrade.exam_score * 0.6);
//                   const { grade } = calculateGrade(editingGrade.midterm_score, editingGrade.exam_score);
//                   return (
//                     <>
//                       <p className="text-sm text-gray-600">Predicted Final: <span className="font-medium">{predictedFinal.toFixed(1)}</span></p>
//                       <p className="text-sm text-gray-600">Predicted Grade: <span className="font-medium">{grade}</span></p>
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-3">
//               <button onClick={() => setEditingGrade(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
//               <button onClick={handleSaveGrade} disabled={saving}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
//                 {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportsSection;






//=========================================================================

// import React, { useState, useEffect } from 'react';
// import {
//   FileText,
//   BarChart3,
//   Filter,
//   Edit,
//   Save,
//   X,
//   AlertCircle,
//   Loader2,
//   Search
// } from 'lucide-react';

// const API_BASE = 'http://172.28.27.50:5002'; // ✅ backend url

// const ReportsSection = () => {
//   const [selectedReport, setSelectedReport] = useState('transcript');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [grades, setGrades] = useState([]);
//   const [editingGrade, setEditingGrade] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // ================== API CALLS ==================
//   const fetchScores = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Token not found. Please login again.');

//       const response = await fetch(`${API_BASE}/api/scores`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Failed to fetch scores');

//       setGrades(data.scores || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateScore = async (updatedGrade) => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Token not found. Please login again.');

//       const response = await fetch(`${API_BASE}/api/scores/${updatedGrade.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedGrade)
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || 'Failed to update score');

//       setGrades((prev) =>
//         prev.map((g) => (g.id === updatedGrade.id ? updatedGrade : g))
//       );
//       setEditingGrade(null);
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================== UTILITIES ==================
//   const calculateGrade = (score) => {
//     if (score >= 90) return 'A';
//     if (score >= 85) return 'B+';
//     if (score >= 80) return 'B';
//     if (score >= 75) return 'B-';
//     if (score >= 70) return 'C+';
//     if (score >= 65) return 'C';
//     if (score >= 60) return 'C-';
//     if (score >= 55) return 'D+';
//     if (score >= 50) return 'D';
//     return 'F';
//   };

//   const gradeColor = (grade) => {
//     const colors = {
//       A: 'text-green-600 bg-green-100',
//       'B+': 'text-blue-600 bg-blue-100',
//       B: 'text-blue-600 bg-blue-100',
//       'B-': 'text-yellow-600 bg-yellow-100',
//       'C+': 'text-yellow-600 bg-yellow-100',
//       C: 'text-yellow-600 bg-yellow-100',
//       'C-': 'text-orange-600 bg-orange-100',
//       'D+': 'text-orange-600 bg-orange-100',
//       D: 'text-orange-600 bg-orange-100',
//       F: 'text-red-600 bg-red-100'
//     };
//     return colors[grade] || 'text-gray-600 bg-gray-100';
//   };

//   // ================== EFFECTS ==================
//   useEffect(() => {
//     if (selectedReport === 'transcript') {
//       fetchScores();
//     }
//   }, [selectedReport]);

//   // ================== HANDLERS ==================
//   const handleEdit = (grade) => setEditingGrade({ ...grade });
//   const handleCancel = () => setEditingGrade(null);

//   const handleSave = () => {
//     if (!editingGrade) return;
//     const finalScore =
//       Number(editingGrade.midterm_score) * 0.4 +
//       Number(editingGrade.exam_score) * 0.6;
//     const updated = {
//       ...editingGrade,
//       midterm_score: Number(editingGrade.midterm_score),
//       exam_score: Number(editingGrade.exam_score),
//       midterm_grade: calculateGrade(Number(editingGrade.midterm_score)),
//       exam_grade: calculateGrade(Number(editingGrade.exam_score)),
//       final_score: finalScore,
//       final_grade: calculateGrade(finalScore),
//       // ✅ ensure fields required by DB
//       email: editingGrade.email || '',
//       activity_score: editingGrade.activity_score || 0,
//       activity_grade: editingGrade.activity_grade || ''
//     };
//     updateScore(updated);
//   };

//   // ================== FILTERED DATA ==================
//   const filteredGrades = grades.filter((g) => {
//     if (!searchTerm) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       g.student_id?.toLowerCase().includes(term) ||
//       g.first_name_lao?.toLowerCase().includes(term) ||
//       g.last_name_lao?.toLowerCase().includes(term) ||
//       g.course_code?.toLowerCase().includes(term) ||
//     g.course_name_lao?.toLowerCase().includes(term) ||
//     g.course_name_eng?.toLowerCase().includes(term)
//     );
//   });

//   // ================== UI ==================
//   const reports = [
//     {
//       id: 'transcript',
//       name: 'ຄະແນນລວມນັກສືກສາ (Student Scores)',
//       count: grades.length,
//       icon: FileText,
//       color: 'purple'
//     },
//     {
//       id: 'certificate',
//       name: 'ໃບຄະແນນ (Transcript)',
//       count: 0,
//       icon: BarChart3,
//       color: 'blue'
//     }
//   ];

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">ລາຍງານ & ຄະແນນ</h2>

//       {/* Report type cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {reports.map((r) => {
//           const Icon = r.icon;
//           return (
//             <button
//               key={r.id}
//               onClick={() => setSelectedReport(r.id)}
//               className={`p-4 rounded-xl border-2 transition ${
//                 selectedReport === r.id
//                   ? `border-${r.color}-500 bg-${r.color}-50`
//                   : 'border-gray-200 bg-white hover:border-gray-300'
//               }`}
//             >
//               <Icon className="w-6 h-6 mb-2" />
//               <div className="font-medium">{r.name}</div>
//               <div className="text-xl font-bold">{r.count}</div>
//             </button>
//           );
//         })}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <label className="text-sm">ຄົ້ນຫາ</label>
//           <div className="flex items-center border rounded px-2 py-1">
//             <Search className="w-4 h-4 text-gray-500 mr-2" />
//             <input
//               type="text"
//               placeholder="student_id, ຊື່, ນາມສະກຸນ..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="flex-1 outline-none"
//             />
//           </div>
//         </div>
//         {/* <div>
//           <label className="text-sm">ຈາກວັນທີ</label>
//           <input
//             type="date"
//             value={dateRange.start}
//             onChange={(e) =>
//               setDateRange({ ...dateRange, start: e.target.value })
//             }
//             className="block border rounded px-2 py-1"
//           />
//         </div> */}
//         {/* <div>
//           <label className="text-sm">ຫາວັນທີ</label>
//           <input
//             type="date"
//             value={dateRange.end}
//             onChange={(e) =>
//               setDateRange({ ...dateRange, end: e.target.value })
//             }
//             className="block border rounded px-2 py-1"
//           />
//         </div> */}
//         {/* <button className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
//           <Filter className="w-4 h-4 mr-1" /> ກັ່ນຕອງ
//         </button> */}
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded">
//           <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
//           {error}
//         </div>
//       )}

//       {/* Scores table */}
//       {selectedReport === 'transcript' && (
//         <div className="bg-white rounded-xl shadow p-4">
//           {loading ? (
//             <div className="flex items-center">
//               <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="py-2 text-left">ລະຫັດນັກສຶກສາ</th>
//                   <th className="py-2 text-left">ວິຊາ</th>
//                   <th className="py-2 text-left">ປີຮຽນ</th>
//                   <th className="py-2 text-left">Midterm</th>
//                   <th className="py-2 text-left">Exam</th>
//                   <th className="py-2 text-left">Final</th>
//                   <th className="py-2 text-left">ຜົນສຸດທ້າຍ</th>
//                   <th className="py-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredGrades.map((g) => (
//                   <tr key={g.id} className="border-b">
//                     <td>{g.student_id}</td>
//                     <td>{g.course_code}</td>
//                     <td>
//                       {g.academic_year}/{g.score_semester}
//                     </td>

//                     {/* Midterm */}
//                     <td>
//                       {editingGrade?.id === g.id ? (
//                         <input
//                           type="number"
//                           value={editingGrade.midterm_score}
//                           onChange={(e) =>
//                             setEditingGrade({
//                               ...editingGrade,
//                               midterm_score: Number(e.target.value)
//                             })
//                           }
//                           className="w-16 border rounded px-1"
//                         />
//                       ) : (
//                         <>
//                           {g.midterm_score}{' '}
//                           <span
//                             className={`px-2 py-1 rounded ${gradeColor(
//                               g.midterm_grade
//                             )}`}
//                           >
//                             {g.midterm_grade}
//                           </span>
//                         </>
//                       )}
//                     </td>

//                     {/* Exam */}
//                     <td>
//                       {editingGrade?.id === g.id ? (
//                         <input
//                           type="number"
//                           value={editingGrade.exam_score}
//                           onChange={(e) =>
//                             setEditingGrade({
//                               ...editingGrade,
//                               exam_score: Number(e.target.value)
//                             })
//                           }
//                           className="w-16 border rounded px-1"
//                         />
//                       ) : (
//                         <>
//                           {g.exam_score}{' '}
//                           <span
//                             className={`px-2 py-1 rounded ${gradeColor(
//                               g.exam_grade
//                             )}`}
//                           >
//                             {g.exam_grade}
//                           </span>
//                         </>
//                       )}
//                     </td>

//                     {/* Final */}
//                     <td>{g.final_score}</td>
//                     <td>
//                       <span
//                         className={`px-2 py-1 rounded ${gradeColor(
//                           g.final_grade
//                         )}`}
//                       >
//                         {g.final_grade}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td>
//                       {editingGrade?.id === g.id ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={handleSave}
//                             disabled={saving}
//                             className="p-1 text-green-600 hover:bg-green-100 rounded"
//                           >
//                             <Save className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             className="p-1 text-red-600 hover:bg-red-100 rounded"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(g)}
//                           className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportsSection;


import React, { useState, useEffect } from 'react';
import {
  FileText,
  BarChart3,
  Filter,
  Edit,
  Save,
  X,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react';

const API_BASE = 'http://172.28.27.50:5002'; // ✅ backend url

const ReportsSection = () => {
  const [selectedReport, setSelectedReport] = useState('transcript');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [grades, setGrades] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ================== API CALLS ==================
  const fetchScores = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found. Please login again.');

      const response = await fetch(`${API_BASE}/api/scores`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch scores');

      setGrades(data.scores || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log(selectedReport)
  };

  const updateScore = async (updatedGrade) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found. Please login again.');

      const response = await fetch(`${API_BASE}/api/scores/${updatedGrade.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGrade)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update score');

      setGrades((prev) =>
        prev.map((g) => (g.id === updatedGrade.id ? updatedGrade : g))
      );
      setEditingGrade(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const fetchTranscript = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found. Please login again.');

      const response = await fetch(`${API_BASE}/api/scores`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch scores');

      setGrades(data.scores || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log(selectedReport)
  };


  // ================== UTILITIES ==================
  const calculateGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'B-';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'C-';
    if (score >= 55) return 'D+';
    if (score >= 50) return 'D';
    return 'F';
  };

  const gradeColor = (grade) => {
    const colors = {
      A: 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      B: 'text-blue-600 bg-blue-100',
      'B-': 'text-yellow-600 bg-yellow-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      C: 'text-yellow-600 bg-yellow-100',
      'C-': 'text-orange-600 bg-orange-100',
      'D+': 'text-orange-600 bg-orange-100',
      D: 'text-orange-600 bg-orange-100',
      F: 'text-red-600 bg-red-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  // ================== EFFECTS ==================
  useEffect(() => {
    if (selectedReport === 'transcript') {
      fetchScores();
    } else if (selectedReport === "certificate") {
      fetchScores();
    }
  }, [selectedReport]);

  // ================== HANDLERS ==================
  const handleEdit = (grade) => setEditingGrade({ ...grade });
  const handleCancel = () => setEditingGrade(null);

  const handleSave = () => {
    if (!editingGrade) return;
    const finalScore =
      Number(editingGrade.midterm_score) * 0.4 +
      Number(editingGrade.exam_score) * 0.6;
    const updated = {
      ...editingGrade,
      midterm_score: Number(editingGrade.midterm_score),
      exam_score: Number(editingGrade.exam_score),
      midterm_grade: calculateGrade(Number(editingGrade.midterm_score)),
      exam_grade: calculateGrade(Number(editingGrade.exam_score)),
      final_score: finalScore,
      final_grade: calculateGrade(finalScore),
      // ✅ ensure fields required by DB
      email: editingGrade.email || '',
      activity_score: editingGrade.activity_score || 0,
      activity_grade: editingGrade.activity_grade || ''
    };
    updateScore(updated);
  };

  // ================== FILTERED DATA ==================
  const filteredGrades = grades.filter((g) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    console.log(term)
    return (
      g.student_id?.toLowerCase().includes(term) ||
      g.first_name_lao?.toLowerCase().includes(term) ||
      g.last_name_lao?.toLowerCase().includes(term) ||
      g.course_code?.toLowerCase().includes(term) ||
      g.course_name_lao?.toLowerCase().includes(term) ||
      g.course_name_eng?.toLowerCase().includes(term)
    );
  });

  // ================== UI ==================
  const reports = [
    {
      id: 'transcript',
      name: 'ຄະແນນລວມນັກສືກສາ (Student Scores)',
      count: grades.length,
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'certificate',
      name: 'ໃບຄະແນນ (Transcript)',
      count: 0,
      icon: BarChart3,
      color: 'blue'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ລາຍງານ & ຄະແນນ</h2>

      {/* Report type cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`p-4 rounded-xl border-2 transition ${selectedReport === r.id
                ? `border-${r.color}-500 bg-${r.color}-50`
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="font-medium">{r.name}</div>
              <div className="text-xl font-bold">{r.count}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">


        {
          selectedReport === "transcript" ?
            <div className="flex-1">
              <label className="text-sm">ຄົ້ນຫາ</label>
              <div className="flex items-center border rounded px-2 py-1">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="student_id, ຊື່, ວິຊາ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none"
                />
              </div>
            </div>
            :

            selectedReport === "certificate" ?
              <div className="flex flex-col w-full">
                <div className='flex items-center flex-wrap bg-white rounded-lg px-2 py-3 border-2 '>
                  <div className='flex items-center w-full max-w-[55%]'>
                    <Search className="w-4 h-4 text-gray-500 mr-2" />

                    <input
                      type="text"
                      placeholder="student_id, ລະຫັດວິຊາ, ວິຊາ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none mr-2 p-2 rounded border min-w-3xs"
                    />

                  </div>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg inline-flex items-center mr-3"> Fetch Transcript </button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-800 py-2 px-4 rounded-lg inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span >Download PDF</span>
                  </button>

                </div>


                <div className="flex flex-col bg-white mt-5 border-2 p-3 rounded-lg">


                  <span className="font-extrabold text-gray-600"> ຂໍ້ມູນນັກສຶກສາ </span>
                  <div className="flex items-center mt-2 mr-1" >
                    <span className="font-medium text-gray-600">  ລະຫັດ: </span>
                  </div>

                  <div className="flex flex-row">

                    <span className="font-medium text-gray-600 mr-1">ຊື່:  </span>
                    <span className="font-medium text-gray-600">  ທ້າວ ບຸນເພັງ </span>
                  </div>

                </div>

              </div>


              :
              <>
              </>

        }



      </div>

      {/* Error */}
      {
        error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded">
            <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
            {error}
          </div>
        )
      }

      {/* Scores table */}
      {
        selectedReport === 'transcript' ? (
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">ລະຫັດນັກສຶກສາ</th>
                    <th className="py-2 text-left">ຊື່-ນາມສະກຸນ</th>
                    <th className="py-2 text-left">ວິຊາ</th>
                    <th className="py-2 text-left">ປີຮຽນ</th>
                    <th className="py-2 text-left">Midterm</th>
                    <th className="py-2 text-left">Exam</th>
                    <th className="py-2 text-left">Final</th>
                    <th className="py-2 text-left">ຜົນສຸດທ້າຍ</th>
                    <th className="py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((g) => (
                    <tr key={g.id} className="border-b">
                      <td>{g.student_id}</td>
                      <td>
                        {g.first_name_lao} {g.last_name_lao}
                      </td>
                      <td>
                        {g.course_code} - {g.course_name_lao || g.course_name_eng}
                      </td>
                      <td>
                        {g.academic_year}/{g.score_semester}
                      </td>

                      {/* Midterm */}
                      <td>
                        {editingGrade?.id === g.id ? (
                          <input
                            type="number"
                            value={editingGrade.midterm_score}
                            onChange={(e) =>
                              setEditingGrade({
                                ...editingGrade,
                                midterm_score: Number(e.target.value)
                              })
                            }
                            className="w-16 border rounded px-1"
                          />
                        ) : (
                          <>
                            {g.midterm_score}{' '}
                            <span
                              className={`px-2 py-1 rounded ${gradeColor(
                                g.midterm_grade
                              )}`}
                            >
                              {g.midterm_grade}
                            </span>
                          </>
                        )}
                      </td>

                      {/* Exam */}
                      <td>
                        {editingGrade?.id === g.id ? (
                          <input
                            type="number"
                            value={editingGrade.exam_score}
                            onChange={(e) =>
                              setEditingGrade({
                                ...editingGrade,
                                exam_score: Number(e.target.value)
                              })
                            }
                            className="w-16 border rounded px-1"
                          />
                        ) : (
                          <>
                            {g.exam_score}{' '}
                            <span
                              className={`px-2 py-1 rounded ${gradeColor(
                                g.exam_grade
                              )}`}
                            >
                              {g.exam_grade}
                            </span>
                          </>
                        )}
                      </td>

                      {/* Final */}
                      <td>{g.final_score}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded ${gradeColor(
                            g.final_grade
                          )}`}
                        >
                          {g.final_grade}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        {editingGrade?.id === g.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(g)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : selectedReport === "certificate" ? (

          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">ປີ/ພາກ</th>
                    <th className="py-2 text-left">ລະຫັດວິຊາ</th>
                    <th className="py-2 text-left">ວິຊາ</th>
                    <th className="py-2 text-left">ໜ່ວຍກິດ</th>
                    <th className="py-2 text-left">ຄະແນນສຸດທ້າຍ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((g) => (
                    <tr key={g.id} className="border-b">
                      <td>{g.student_id}</td>
                      <td>
                        {g.first_name_lao} {g.last_name_lao}
                      </td>
                      <td>
                        {g.course_code} - {g.course_name_lao || g.course_name_eng}
                      </td>
                      <td>
                        {g.academic_year}/{g.score_semester}
                      </td>

                      {/* Midterm */}
                      <td>
                        {editingGrade?.id === g.id ? (
                          <input
                            type="number"
                            value={editingGrade.midterm_score}
                            onChange={(e) =>
                              setEditingGrade({
                                ...editingGrade,
                                midterm_score: Number(e.target.value)
                              })
                            }
                            className="w-16 border rounded px-1"
                          />
                        ) : (
                          <>
                            {g.midterm_score}{' '}
                            <span
                              className={`px-2 py-1 rounded ${gradeColor(
                                g.midterm_grade
                              )}`}
                            >
                              {g.midterm_grade}
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        ) :
          <></>
      }
    </div >
  );
};

export default ReportsSection;


