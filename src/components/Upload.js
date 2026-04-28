import React, { useState } from 'react';
import { Upload, Plus, File, X, Eye, CheckCircle, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const API_BASE_URL = 'http://172.28.27.50:5002';

const UploadSection = ({ setFiles, setActiveTab }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /** ========== API Functions ========== */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Preview file using server API
  const previewFileData = async (file) => {
    setPreviewLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending preview request for:', file.name);

      const response = await fetch(`${API_BASE_URL}/api/files/preview`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        console.log('Preview data received:', data.preview);
        setFilePreview(data.preview);
        setShowPreview(true);
      } else {
        throw new Error(data.error || 'Preview failed');
      }
    } catch (error) {
      console.error('Preview error:', error);
      
      // Fallback to local preview for CSV and Excel
      if (file.type === 'text/csv') {
        try {
          const localPreview = await readCSVFile(file);
          setFilePreview(localPreview);
          setShowPreview(true);
        } catch (localError) {
          alert('ບໍ່ສາມາດອ່ານໄຟລ໌ໄດ້: ' + error.message);
        }
      } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
        // Use mock data for Excel as fallback
        const mockPreview = await readExcelFile(file);
        setFilePreview(mockPreview);
        setShowPreview(true);
      } else {
        alert('ບໍ່ສາມາດເຊື່ອມຕໍ່ server ສຳລັບ preview: ' + error.message);
      }
    }
    setPreviewLoading(false);
  };

  /** ========== Local File Reading Functions (Fallback) ========== */
  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const preview = lines.slice(1, 6).map(line => 
            line.split(',').map(cell => cell.trim().replace(/"/g, ''))
          );
          
          resolve({
            type: 'CSV',
            headers,
            preview,
            totalRows: lines.length - 1,
            columns: headers.length
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Import XLSX library if available
          const XLSX = await import('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
          
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellStyles: true,
            cellFormulas: true,
            cellDates: true
          });
          
          console.log('Excel file loaded, sheets:', workbook.SheetNames);
          
          const sheetNames = workbook.SheetNames;
          const firstSheet = workbook.Sheets[sheetNames[0]];
          
          // แปลงเป็น JSON array
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1,
            defval: '', // ค่า default สำหรับ cell ที่ว่าง
            raw: false  // แปลงเป็น string
          });
          
          console.log('Raw Excel data:', jsonData.slice(0, 3));
          
          if (jsonData.length === 0) {
            throw new Error('ไฟล์ Excel ว่างเปล่า');
          }

          // ประมวลผล headers
          const headers = jsonData[0] ? jsonData[0].map(h => h ? h.toString().trim() : '') : [];
          
          // ประมวลผล preview data (5 แถวแรก)
          const preview = jsonData.slice(1, 6).map(row => {
            return headers.map((_, index) => {
              const cell = row[index];
              return cell !== undefined ? cell.toString().trim() : '';
            });
          });
          
          const totalRows = jsonData.length - 1; // ลบ header row

          // ตรวจหาชื่อวิชาจากชื่อไฟล์หรือเนื้อหา
          let subject = '';
          const fileName = file.name.toLowerCase();
          
          if (fileName.includes('ການສື່ສານຂໍ້ມູນ') || fileName.includes('communication')) {
            subject = 'ວິຊາ ການສື່ສານຂໍ້ມູນ 2025';
          } else if (fileName.includes('ຄະນິດສາດ') || fileName.includes('math')) {
            subject = 'ວິຊາ ຄະນິດສາດ';
          } else if (fileName.includes('ວິທະຍາສາດ') || fileName.includes('science')) {
            subject = 'ວິຊາ ວິທະຍາສາດ';
          } else if (fileName.includes('grade') || fileName.includes('score')) {
            subject = 'ໄຟລ໌ຄະແນນ';
          }

          const result = {
            type: 'EXCEL',
            headers: headers,
            preview: preview,
            totalRows: totalRows,
            columns: headers.length,
            sheets: sheetNames,
            activeSheet: sheetNames[0],
            subject: subject,
            originalName: file.name,
            fileSize: file.size
          };
          
          console.log('Processed Excel data:', result);
          resolve(result);
          
        } catch (error) {
          console.error('Excel reading error:', error);
          
          // Fallback: ลองอ่านด้วย FileReader แบบ text
          try {
            const textReader = new FileReader();
            textReader.onload = (textEvent) => {
              // ถ้าอ่านเป็น text ไม่ได้ ให้ใช้ mock data
              console.warn('Using fallback mock data for Excel file');
              const mockData = {
                type: 'EXCEL',
                headers: [
                  'ຊື່', 'ນາມສະກຸນ', 'ID number', 'Email address',
                  'ຄະແນນລວມ(ຂຶ້ນຫ້ອງ+ກິດຈະກໍາ) (Real)',
                  'Quiz: ສອບເສັງກາງພາກຮຽນ (Real)',
                  'Quiz: ສອບເສັງທ້າຍພາກຮຽນ (Real)',
                  'Course total (Real)'
                ],
                preview: [
                  ['ນາງ ລິນລີ່', 'ກິ່ງແກ້ວ', '', 'ICT24BNN008@iict24bnn.la', '-', '20', '29', '49'],
                  ['ພຮະ ຍອດທອງ', 'ຂະນານຄຳ', '', 'ICT24BNN021@iict24bnn.la', '-', '17', '29', '46'],
                  ['ທ້າວ ທະນາກອນ', 'ຂຸນມາລາ', '', 'ICT24BNN017@iict24bnn.la', '-', '20', '27', '47'],
                  ['ທ້າວ ຄົມສັນ', 'ຈັນທະລັງສີ', '', 'ICT24BNN064@iict24bnn.la', '-', '17', '20', '37'],
                  ['ທ້າວ ຕົ້ນຕານ', 'ຈັນທະວົງ', '', 'ICT24BNN024@iict24bnn.la', '-', '20', '30', '50']
                ],
                totalRows: 66,
                columns: 8,
                sheets: ['Grades'],
                subject: 'ວິຊາ ການສື່ສານຂໍ້ມູນ 2025 (Fallback Data)',
                originalName: file.name,
                note: 'ບໍ່ສາມາດອ່ານໄຟລ໌ Excel ໄດ້ ແສດງຂໍ້ມູນຕົວຢ່າງແທນ'
              };
              resolve(mockData);
            };
            textReader.readAsText(file);
          } catch (fallbackError) {
            reject(new Error('ບໍ່ສາມາດອ່ານໄຟລ໌ Excel ໄດ້: ' + error.message));
          }
        }
      };
      
      reader.onerror = () => reject(new Error('ເກີດຂໍ້ຜິດພາດໃນການອ່ານໄຟລ໌'));
      reader.readAsArrayBuffer(file);
    });
  };

  const readPDFFile = async (file) => {
    return new Promise((resolve) => {
      resolve({
        type: 'PDF',
        pages: 3,
        title: 'ໃບຄະແນນການສອບ',
        size: formatFileSize(file.size),
        info: 'ເອກະສານມີ 3 ໜ້າ ປະກອບດ້ວຍຂໍ້ມູນຄະແນນນັກສຶກສາ'
      });
    });
  };

  /** ========== File Handling ========== */
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('ກະລຸນາເລືອກໄຟລ໌ Excel ເທົ່ານັ້ນ');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 50MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (file) => {
    if (file && validateFile(file)) {
      setUploadedFile(file);
      setFilePreview(null);
      setShowPreview(false);
      // Auto preview for CSV and Excel
      if (file.type === 'text/csv' || file.type.includes('spreadsheet') || file.type.includes('excel')) {
        previewFileData(file);
      }
    }
  };

  const handleFileUpload = (e) => handleFileSelect(e.target.files[0]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (['dragenter', 'dragover'].includes(e.type)) setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  /** ========== Upload Function ========== */
  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      console.log('Uploading file:', uploadedFile.name);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
          console.log('Upload progress:', Math.round(percentComplete) + '%');
        }
      });

      // Handle response
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Upload response:', data);
            if (xhr.status === 200 && data.success) {
              resolve(data);
            } else {
              reject(new Error(data.error || `Server error: ${xhr.status}`));
            }
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error - ບໍ່ສາມາດເຊື່ອມຕໍ່ server ໄດ້'));
        xhr.ontimeout = () => reject(new Error('Upload timeout - ໃຊ້ເວລານານເກີນໄປ'));
      });

      // Configure and send request
      xhr.open('POST', `${API_BASE_URL}/api/files/upload`);
      
      // Add auth headers
      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.timeout = 60000; // 60 second timeout
      xhr.send(formData);

      // Wait for response
      const data = await uploadPromise;

      // Create file object for state
      const newFile = {
        id: data.file.id,
        name: data.file.originalName || data.file.name || uploadedFile.name,
        size: data.file.size || formatFileSize(uploadedFile.size),
        type: data.file.type || getFileType(uploadedFile.name),
        upload_date: data.file.upload_date || new Date().toISOString().split('T')[0],
        status: data.file.status || 'completed',
        path: data.file.path,
        user_name: data.file.user_name || 'You',
        created_at: data.file.created_at || new Date().toISOString()
      };

      console.log('Adding new file to list:', newFile);

      // Update files list
      setFiles((prev) => [newFile, ...prev]);

      // Success feedback
      setTimeout(() => {
        resetUpload();
        alert('ອັບໂຫຼດໄຟລ໌ສຳເລັດ!');
        setActiveTab('files');
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      let errorMessage = 'Upload ລົ້ມເຫຼວ: ' + error.message;
      
      alert(errorMessage);
      resetUpload();
    }
  };

  const resetUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadedFile(null);
    setFilePreview(null);
    setShowPreview(false);
  };

  /** ========== Utils ========== */
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileType = (filename) => filename.split('.').pop().toUpperCase();

  /** ========== Render Preview ========== */
  const renderPreview = () => {
    if (!filePreview) return null;

    return (
      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              ຂໍ້ມູນໃນໄຟລ໌
            </h4>
            {/* <div className="text-sm text-gray-600">
              {filePreview.type === 'PDF' ? (
                `${filePreview.pages} ໜ້າ`
              ) : (
                `${filePreview.totalRows} ແຖວ, ${filePreview.columns} ຄໍລໍາ`
              )}
            </div> */}
          </div>
          {filePreview.subject && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filePreview.subject}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {filePreview.type === 'PDF' ? (
            <div className="text-center py-8">
              <File className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h5 className="font-medium text-gray-900 mb-2">{filePreview.title}</h5>
              <p className="text-gray-600">{filePreview.info}</p>
            </div>
          ) : (
            <>
              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {filePreview.headers.slice(0, 13).map((header, idx) => (
                        <th key={idx} className="px-3 py-2 text-left font-medium text-gray-700 border-b text-xs">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filePreview.preview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {row.slice(0, 13).map((cell, cellIdx) => (
                          <td key={cellIdx} className={`px-3 py-2 border-b border-gray-200 ${
                            cellIdx === 6 || cellIdx === 7 ? // คะแนนกลางภาค
                              typeof cell === 'number' && cell >= 18 ? 'text-green-600 font-medium' :
                              typeof cell === 'string' && ['A', 'B+'].includes(cell) ? 'text-green-600 font-medium' :
                              'text-gray-900' : 'text-gray-900'
                          }`}>
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* {filePreview.totalRows > 5 && (
                  <div className="text-center py-3 text-gray-500 text-sm bg-gray-50 border-t">
                    <span className="inline-flex items-center">
                      ... ແລະອີກ {filePreview.totalRows - 5} ນັກສຶກສາ
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        ຄລິກອັບໂຫຼດເພື່ອເບິ່ງທັງໝົດ
                      </span>
                    </span>
                  </div>
                )} */}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  /** ========== Main Render ========== */
  return (
    <div>
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ອັບໂຫຼດໄຟລ໌</h2>
        <p className="text-gray-600">ອັບໂຫຼດໄຟລ໌ຄະແນນ ແລະ ເອກະສານທີ່ກ່ຽວຂ້ອງ</p>
      </div>

      {/* Connection Status */}
      {/* <div className="mb-4">
        <div className="flex items-center text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-gray-600">ເຊື່ອມຕໍ່ກັບ server: {API_BASE_URL}</span>
        </div>
      </div> */}

      {/* Upload Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ລາກ ແລະ ວາງໄຟລ໌ ຫຼື ຄລິກເພື່ອເລືອກ
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            ຮອງຮັບໄຟລ໌: Excel (ຂະໜາດສູງສຸດ 50MB)
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.xlsx,.xls,.csv"
            disabled={uploading}
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            ເລືອກໄຟລ໌
          </label>
        </div>

        {/* File Preview */}
        {uploadedFile && (
          <div className="mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <File className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Preview Button */}
                  {!showPreview && (uploadedFile.type === 'application/pdf' || !filePreview) && (
                    <button
                      onClick={() => previewFileData(uploadedFile)}
                      disabled={previewLoading}
                      className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {previewLoading ? 'ກຳລັງໂຫຼດ...' : 'ສະແດງຂໍ້ມູນ'}
                    </button>
                  )}
                  
                  {/* Remove Button */}
                  {!uploading && (
                    <button onClick={resetUpload} className="text-gray-500 hover:text-red-600">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Data Preview */}
              {showPreview && renderPreview()}

              {/* Upload Progress */}
              {uploading ? (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>ກຳລັງອັບໂຫຼດ...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* Upload Button */
                <div className="mt-4 flex items-center justify-between">
                  {filePreview && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      ຂໍ້ມູນພ້ອມສຳລັບອັບໂຫຼດ
                    </div>
                  )}
                  <button
                    onClick={handleUpload}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    ເລີ່ມອັບໂຫຼດ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">ຄຳແນະນຳການອັບໂຫຼດ:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {/* <li>• ໄຟລ໌ PDF ສຳລັບໃບຄະແນນ ແລະ ໃບປະກາດ</li> */}
            <li>• ໄຟລ໌ Excel ສຳລັບຂໍ້ມູນນັກສຶກສາ ແລະ ຄະແນນ</li>
            {/* <li>• ໄຟລ໌ CSV ສຳລັບການນຳເຂົ້າຂໍ້ມູນຈຳນວນຫຼາຍ</li> */}
            <li>• ກວດສອບຄວາມຖືກຕ້ອງຂອງຂໍ້ມູນກ່ອນອັບໂຫຼດ</li>
            <li>• ລະບົບຈະເຊື່ອມຕໍ່ກັບ server ເພື່ອວິເຄາະໄຟລ໌ອັດຕະໂນມັດ</li>
            {/* <li>• ຫາກ server ບໍ່ພ້ອມໃຊ້ງານ ລະບົບຈະໃຊ້ການວິເຄາະແບບ local</li> */}
            <li>• ການອັບໂຫຼດຈະມີ progress bar ສະແດງຄວາມຄືບໜ້າ</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;