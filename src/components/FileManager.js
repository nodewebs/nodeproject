import React, { useState } from 'react';
import { Search, Filter, File, Eye, Download, Trash2 } from 'lucide-react';
import axios from 'axios';

const FileManager = ({ files, setFiles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ค้นหาไฟล์
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) || file.upload_date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + pageSize);

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໄຟລ໌ນີ້?')) {
      try {
        const res = await axios.delete(`http://172.28.27.50:5002/api/files/${id}`);
        if (res.status === 200) {
          setFiles(files.filter(f => f.id !== id));
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  // Download
  const handleDownload = (file) => {
    console.log('Downloading:', file.name);
    alert(`ກຳລັງດາວໂຫຼດ: ${file.name}`);
  };

  // View
  const handleView = (file) => {
    console.log('Viewing:', file.name);
    alert(`ເປີດເບິ່ງ: ${file.name}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ໄຟລ໌ທັງໝົດ</h2>
        <p className="text-gray-600">ຈັດການໄຟລ໌ຄະແນນ ແລະ ໃບປະກາດທັງໝົດ</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ຄົ້ນຫາໄຟລ໌..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset กลับหน้าแรกเวลา search
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">ຊື່ໄຟລ໌</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ປະເພດ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ຂະໜາດ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ວັນທີອັບໂຫຼດ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ສະຖານະ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ການດຳເນີນການ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    ບໍ່ພົບໄຟລ໌ທີ່ຄົ້ນຫາ
                  </td>
                </tr>
              ) : (
                paginatedFiles.map((file) => (
                  <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {file.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{file.size}</td>
                    <td className="py-3 px-4 text-gray-600">{file.upload_date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${file.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {file.status === 'completed' ? 'ສຳເລັດ' : 'ກຳລັງດຳເນີນການ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="ລຶບໄຟລ໌"
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

        {/* Pagination */}
        {filteredFiles.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              ສະແດງ {paginatedFiles.length} ຈາກ {filteredFiles.length} ໄຟລ໌
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                ກ່ອນໜ້າ
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                ຖັດໄປ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;
