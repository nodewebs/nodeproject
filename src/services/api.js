// // src/services/api.js
// import axios from 'axios';

// const API_URL = 'http://172.28.27.50:5002/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle response errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth APIs
// export const authAPI = {
//   login: async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     if (response.data.token) {
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response.data;
//   },

//   register: async (userData) => {
//     const response = await api.post('/auth/register', userData);
//     if (response.data.token) {
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//     }
//     return response.data;
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }
// };

// // User APIs
// export const userAPI = {
//   getAll: async () => {
//     const response = await api.get('/users');
//     return response.data;
//   },

//   update: async (id, userData) => {
//     const response = await api.put(`/users/${id}`, userData);
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/users/${id}`);
//     return response.data;
//   }
// };

// // File APIs
// export const fileAPI = {
//   upload: async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const response = await api.post('/files/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   getAll: async () => {
//     const response = await api.get('/files');
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/files/${id}`);
//     return response.data;
//   }
// };

// // Student APIs
// export const studentAPI = {
//   getAll: async () => {
//     const response = await api.get('/students');
//     return response.data;
//   },

//   create: async (studentData) => {
//     const response = await api.post('/students', studentData);
//     return response.data;
//   },

//   update: async (id, studentData) => {
//     const response = await api.put(`/students/${id}`, studentData);
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await api.delete(`/students/${id}`);
//     return response.data;
//   }
// };

// // Score APIs
// export const scoreAPI = {
//   create: async (scoreData) => {
//     const response = await api.post('/scores', scoreData);
//     return response.data;
//   },

//   getByStudent: async (studentId) => {
//     const response = await api.get(`/scores/${studentId}`);
//     return response.data;
//   }
// };

// // Transcript APIs
// export const transcriptAPI = {
//   generate: async (studentId) => {
//     const response = await api.post('/transcripts/generate', { student_id: studentId });
//     return response.data;
//   },

//   getAll: async () => {
//     const response = await api.get('/transcripts');
//     return response.data;
//   }
// };

// // Certificate APIs
// export const certificateAPI = {
//   generate: async (certificateData) => {
//     const response = await api.post('/certificates/generate', certificateData);
//     return response.data;
//   },

//   getAll: async () => {
//     const response = await api.get('/certificates');
//     return response.data;
//   }
// };

// // Analytics APIs
// export const analyticsAPI = {
//   getStats: async () => {
//     const response = await api.get('/analytics/stats');
//     return response.data;
//   }
// };

// // frontend/src/services/api.js

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.28.27.50:5002/api';

// // Helper function สำหรับ API calls
// const apiRequest = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(localStorage.getItem('token') && {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }),
//     },
//   };

//   const config = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...options.headers,
//     },
//   };

//   try {
//     const response = await fetch(url, config);
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/json')) {
//       return await response.json();
//     }
    
//     return response;
//   } catch (error) {
//     console.error(`API Error on ${endpoint}:`, error);
//     throw error;
//   }
// };

// // API Service Object
// const apiService = {
//   // Users API
//   users: {
//     // GET /api/users
//     getAll: () => apiRequest('/users'),
    
//     // POST /api/users
//     create: (userData) => apiRequest('/users', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     }),
    
//     // PUT /api/users/:id
//     update: (id, userData) => apiRequest(`/users/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(userData),
//     }),
    
//     // DELETE /api/users/:id
//     delete: (id) => apiRequest(`/users/${id}`, {
//       method: 'DELETE',
//     }),
    
//     // GET /api/users/:id
//     getById: (id) => apiRequest(`/users/${id}`),
//   },

//   // Auth API (ถ้ามี)
//   auth: {
//     login: (credentials) => apiRequest('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     }),
    
//     logout: () => apiRequest('/auth/logout', {
//       method: 'POST',
//     }),
    
//     register: (userData) => apiRequest('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     }),
//   },

//   // Dashboard API (ถ้ามี)
//   dashboard: {
//     getStats: () => apiRequest('/dashboard/stats'),
//   },

//   // Reports API (ถ้ามี)
//   reports: {
//     getAll: () => apiRequest('/reports'),
//     create: (reportData) => apiRequest('/reports', {
//       method: 'POST',
//       body: JSON.stringify(reportData),
//     }),
//   },

//   // File upload API (ถ้ามี)
//   upload: {
//     file: (formData) => apiRequest('/upload', {
//       method: 'POST',
//       headers: {}, // ลบ Content-Type ให้ browser จัดการเอง
//       body: formData,
//     }),
//   },
// };



// export default api;



// src/services/api.js
import axios from 'axios';

const API_URL = 'http://172.28.27.50:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// User APIs
export const userAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// File APIs (Enhanced with Preview Support)
export const fileAPI = {
  // Preview file data before upload (NEW)
  preview: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload file (existing)
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get all files (existing)
  getAll: async () => {
    const response = await api.get('/files');
    return response.data;
  },

  // Get file content by ID (NEW)
  getContent: async (id) => {
    const response = await api.get(`/files/${id}/content`);
    return response.data;
  },

  // Delete file (existing)
  delete: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  // Cleanup temporary files (NEW)
  cleanupTemp: async () => {
    const response = await api.post('/files/cleanup-temp');
    return response.data;
  }
};

// Student APIs
export const studentAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  }
};

// Score APIs
export const scoreAPI = {
  create: async (scoreData) => {
    const response = await api.post('/scores', scoreData);
    return response.data;
  },

  getByStudent: async (studentId) => {
    const response = await api.get(`/scores/${studentId}`);
    return response.data;
  }
};

// Transcript APIs
export const transcriptAPI = {
  generate: async (studentId) => {
    const response = await api.post('/transcripts/generate', { student_id: studentId });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/transcripts');
    return response.data;
  }
};

// Certificate APIs
export const certificateAPI = {
  generate: async (certificateData) => {
    const response = await api.post('/certificates/generate', certificateData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/certificates');
    return response.data;
  }
};

// Analytics APIs
export const analyticsAPI = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  }
};

// Alternative API Service (using fetch) - สำหรับกรณีที่ต้องการใช้ fetch แทน axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://172.28.27.50:5002/api';

// Helper function สำหรับ API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') && {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }),
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// Alternative API Service using fetch (Optional)
export const fetchAPI = {
  // Users API
  users: {
    getAll: () => apiRequest('/users'),
    create: (userData) => apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    update: (id, userData) => apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    delete: (id) => apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
    getById: (id) => apiRequest(`/users/${id}`),
  },

  // Files API with Preview Support
  files: {
    preview: (formData) => apiRequest('/files/preview', {
      method: 'POST',
      headers: {}, // ลบ Content-Type ให้ browser จัดการเอง
      body: formData,
    }),
    
    upload: (formData) => apiRequest('/files/upload', {
      method: 'POST',
      headers: {}, // ลบ Content-Type ให้ browser จัดการเอง
      body: formData,
    }),
    
    getAll: () => apiRequest('/files'),
    getContent: (id) => apiRequest(`/files/${id}/content`),
    delete: (id) => apiRequest(`/files/${id}`, { method: 'DELETE' }),
    cleanupTemp: () => apiRequest('/files/cleanup-temp', { method: 'POST' }),
  },

  // Auth API
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    register: (userData) => apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  },

  // Dashboard API
  dashboard: {
    getStats: () => apiRequest('/dashboard/stats'),
  },

  // Reports API
  reports: {
    getAll: () => apiRequest('/reports'),
    create: (reportData) => apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),
  },
};

// Utility functions for file handling
export const fileUtils = {
  // ตรวจสอบประเภทไฟล์ที่รองรับ
  isValidFileType: (file) => {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                         'text/csv'];
    return allowedTypes.includes(file.type);
  },

  // ตรวจสอบขนาดไฟล์
  isValidFileSize: (file, maxSizeMB = 50) => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
  },

  // แปลงขนาดไฟล์เป็น string ที่อ่านง่าย
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // ตรวจสอบไฟล์ก่อน upload
  validateFile: (file) => {
    const errors = [];
    
    if (!fileUtils.isValidFileType(file)) {
      errors.push('ກະລຸນາເລືອກໄຟລ໌ PDF, Excel ຫຼື CSV ເທົ່ານັ້ນ');
    }
    
    if (!fileUtils.isValidFileSize(file)) {
      errors.push('ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 50MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Error handling utility
export const apiError = {
  handle: (error, fallbackMessage = 'Something went wrong') => {
    console.error('API Error:', error);
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return fallbackMessage;
  }
};

export default api;