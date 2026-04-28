// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const csv = require('csv-parser');
// const XLSX = require('xlsx');
// require('dotenv').config();

// // =============================================================================
// // EXPRESS APP INITIALIZATION
// // =============================================================================
// const app = express();

// // =============================================================================
// // MIDDLEWARE CONFIGURATION
// // =============================================================================
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// // =============================================================================
// // DATABASE CONNECTION SETUP
// // =============================================================================
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // Test database connection
// pool.connect((err, client, release) => {
//   if (err) {
//     console.error('❌ Database connection error:', err.message);
//     console.log('Please check your database credentials in .env file');
//   } else {
//     console.log('✅ Connected to PostgreSQL database');
//     release();
//   }
// });

// // =============================================================================
// // FILE UPLOAD CONFIGURATION
// // =============================================================================

// // Create directories
// const uploadsDir = path.join(__dirname, 'uploads');
// const tempDir = path.join(__dirname, 'temp');

// [uploadsDir, tempDir].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log(`📁 Created ${path.basename(dir)} folder`);
//   }
// });

// // Storage configurations
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${uniqueSuffix}-${name}${ext}`);
//   }
// });

// const tempStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'temp/'),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `temp_${uniqueSuffix}_${file.originalname}`);
//   }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /pdf|xlsx|xls|csv/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
//   if (extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only PDF, Excel, and CSV files allowed'));
//   }
// };

// // Multer instances
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//   fileFilter: fileFilter
// });

// const tempUpload = multer({
//   storage: tempStorage,
//   limits: { fileSize: 50 * 1024 * 1024 },
//   fileFilter: fileFilter
// });

// // =============================================================================
// // MIDDLEWARE FUNCTIONS
// // =============================================================================

// /**
//  * JWT Token Verification Middleware
//  */
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     // For testing - remove in production
//     req.user = { id: 1 };
//     return next();
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// // =============================================================================
// // FILE PROCESSING UTILITIES
// // =============================================================================

// /**
//  * Parse and preview CSV files
//  */
// async function previewCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     let headers = [];
//     let rowCount = 0;

//     fs.createReadStream(filePath, { encoding: 'utf8' })
//       .pipe(csv())
//       .on('headers', (headerList) => {
//         headers = headerList.map(h => h.trim());
//       })
//       .on('data', (data) => {
//         rowCount++;
//         if (rowCount <= 5) {
//           results.push(Object.values(data));
//         }
//       })
//       .on('end', () => {
//         resolve({
//           type: 'CSV',
//           headers: headers,
//           preview: results,
//           totalRows: rowCount,
//           columns: headers.length
//         });
//       })
//       .on('error', (error) => {
//         reject(new Error('CSV parsing failed: ' + error.message));
//       });
//   });
// }

// /**
//  * Parse and preview Excel files
//  */
// async function previewExcel(filePath) {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetNames = workbook.SheetNames;
//     const firstSheet = workbook.Sheets[sheetNames[0]];
    
//     const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
//     if (jsonData.length === 0) {
//       throw new Error('Excel file is empty');
//     }

//     const headers = jsonData[0] || [];
//     const preview = jsonData.slice(1, 6);
//     const totalRows = jsonData.length - 1;

//     // Extract subject from filename
//     const fileName = path.basename(filePath);
//     let subject = null;
//     if (fileName.includes('ການສື່ສານຂໍ້ມູນ') || fileName.includes('Communication')) {
//       subject = 'ວິຊາ ການສື່ສານຂໍ້ມູນ 2025';
//     }

//     return {
//       type: 'Excel',
//       headers: headers.map(h => h ? h.toString().trim() : ''),
//       preview: preview,
//       totalRows: totalRows,
//       columns: headers.length,
//       sheets: sheetNames,
//       activeSheet: sheetNames[0],
//       subject: subject
//     };

//   } catch (error) {
//     throw new Error('Excel parsing failed: ' + error.message);
//   }
// }

// /**
//  * Parse and preview PDF files
//  */
// async function previewPDF(filePath) {
//   try {
//     const stats = fs.statSync(filePath);
    
//     return {
//       type: 'PDF',
//       pages: 'N/A',
//       title: 'PDF Document',
//       info: `ເອກະສານ PDF ຂະໜາດ ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
//       size: stats.size
//     };

//   } catch (error) {
//     throw new Error('PDF parsing failed: ' + error.message);
//   }
// }

// // =============================================================================
// // BASIC ROUTES
// // =============================================================================

// /**
//  * Root endpoint - API health check
//  */
// app.get('/', (req, res) => {
//   res.json({ message: '🚀 Backend API is running!' });
// });

// // =============================================================================
// // AUTHENTICATION ROUTES
// // =============================================================================

// /**
//  * User Login
//  * POST /api/auth/login
//  */
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'User not found' 
//       });
//     }

//     const user = result.rows[0];
//     const validPassword = await bcrypt.compare(password, user.password);
    
//     if (!validPassword) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid password' 
//       });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//     console.log('✅ Login successful for:', email);

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // =============================================================================
// // USER MANAGEMENT ROUTES
// // =============================================================================

// /**
//  * Get All Users
//  */
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT id, name, email, phone, role, status, created_at, updated_at,
//               last_login, login_count
//        FROM users 
//        ORDER BY created_at DESC`
//     );
    
//     res.json({
//       success: true,
//       users: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting users:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// /**
//  * Get Single User by ID
//  */
// app.get('/api/users/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const result = await pool.query(
//       `SELECT id, name, email, phone, role, status, created_at, updated_at,
//               last_login, login_count
//        FROM users WHERE id = $1`,
//       [id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       user: result.rows[0]
//     });
    
//   } catch (error) {
//     console.error('Error getting user:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while getting user' 
//     });
//   }
// });

// /**
//  * Create New User
//  */
// app.post('/api/users', verifyToken, async (req, res) => {
//   try {
//     const { name, email, phone, role, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         error: 'Name, email, and password are required'
//       });
//     }

//     // Check for duplicate email
//     const existingUser = await pool.query(
//       'SELECT id FROM users WHERE email = $1',
//       [email]
//     );

//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'User with this email already exists'
//       });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const result = await pool.query(
//       `INSERT INTO users (name, email, phone, role, password, status, created_at, updated_at) 
//        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
//        RETURNING id, name, email, phone, role, status, created_at`,
//       [name, email, phone || null, role || 'student', hashedPassword, 'active']
//     );
    
//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       user: result.rows[0]
//     });
    
//     console.log('✅ User created:', email);
    
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while creating user' 
//     });
//   }
// });

// /**
//  * Update User
//  */
// app.put('/api/users/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone, role, password, status } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         error: 'Name and email are required'
//       });
//     }

//     const existingUser = await pool.query(
//       'SELECT * FROM users WHERE id = $1',
//       [id]
//     );

//     if (existingUser.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     // Check for duplicate email (excluding current user)
//     const emailCheck = await pool.query(
//       'SELECT id FROM users WHERE email = $1 AND id != $2',
//       [email, id]
//     );

//     if (emailCheck.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Email is already used by another user'
//       });
//     }

//     let updateQuery;
//     let updateValues;

//     if (password && password.trim() !== '') {
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
      
//       updateQuery = `
//         UPDATE users 
//         SET name = $1, email = $2, phone = $3, role = $4, password = $5, 
//             status = $6, updated_at = NOW()
//         WHERE id = $7 
//         RETURNING id, name, email, phone, role, status, created_at, updated_at
//       `;
//       updateValues = [name, email, phone || null, role || 'student', hashedPassword, status || 'active', id];
//     } else {
//       updateQuery = `
//         UPDATE users 
//         SET name = $1, email = $2, phone = $3, role = $4, status = $5, updated_at = NOW()
//         WHERE id = $6 
//         RETURNING id, name, email, phone, role, status, created_at, updated_at
//       `;
//       updateValues = [name, email, phone || null, role || 'student', status || 'active', id];
//     }

//     const result = await pool.query(updateQuery, updateValues);
    
//     res.json({
//       success: true,
//       message: 'User updated successfully',
//       user: result.rows[0]
//     });
    
//     console.log('✅ User updated:', email);
    
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while updating user' 
//     });
//   }
// });

// /**
//  * Delete User
//  */
// app.delete('/api/users/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const existingUser = await pool.query(
//       'SELECT email FROM users WHERE id = $1',
//       [id]
//     );

//     if (existingUser.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     const userEmail = existingUser.rows[0].email;

//     if (req.user && req.user.id === parseInt(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Cannot delete your own account'
//       });
//     }

//     await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
//     res.json({
//       success: true,
//       message: 'User deleted successfully'
//     });
    
//     console.log('✅ User deleted:', userEmail);
    
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while deleting user' 
//     });
//   }
// });

// /**
//  * Search Users
//  */
// app.get('/api/users/search/:term', verifyToken, async (req, res) => {
//   try {
//     const { term } = req.params;
    
//     const result = await pool.query(
//       `SELECT id, name, email, phone, role, status, created_at, updated_at,
//               last_login, login_count
//        FROM users 
//        WHERE LOWER(name) LIKE LOWER($1) 
//           OR LOWER(email) LIKE LOWER($1) 
//           OR LOWER(phone) LIKE LOWER($1)
//        ORDER BY name ASC`,
//       [`%${term}%`]
//     );
    
//     res.json({
//       success: true,
//       users: result.rows
//     });
    
//   } catch (error) {
//     console.error('Error searching users:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while searching users' 
//     });
//   }
// });

// /**
//  * Get User Statistics
//  */
// app.get('/api/users/stats', verifyToken, async (req, res) => {
//   try {
//     const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    
//     const roleStats = await pool.query(`
//       SELECT 
//         role,
//         COUNT(*) as count
//       FROM users
//       GROUP BY role
//       ORDER BY role
//     `);
    
//     const statusStats = await pool.query(`
//       SELECT 
//         status,
//         COUNT(*) as count
//       FROM users
//       GROUP BY status
//       ORDER BY status
//     `);
    
//     const recentUsers = await pool.query(`
//       SELECT COUNT(*) as count
//       FROM users
//       WHERE created_at >= NOW() - INTERVAL '30 days'
//     `);
    
//     const activeUsers = await pool.query(`
//       SELECT COUNT(*) as count
//       FROM users
//       WHERE last_login >= NOW() - INTERVAL '30 days'
//         AND status = 'active'
//     `);
    
//     res.json({
//       success: true,
//       stats: {
//         total_users: parseInt(totalUsers.rows[0].count),
//         role_breakdown: roleStats.rows,
//         status_breakdown: statusStats.rows,
//         recent_registrations: parseInt(recentUsers.rows[0].count),
//         active_last_30_days: parseInt(activeUsers.rows[0].count)
//       }
//     });
    
//   } catch (error) {
//     console.error('Error getting user stats:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while getting user statistics' 
//     });
//   }
// });

// // =============================================================================
// // STUDENT MANAGEMENT ROUTES
// // =============================================================================

// /**
//  * Get All Students
//  */
// app.get('/api/students', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM students');
    
//     res.json({
//       success: true,
//       students: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting students:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// /**
//  * Add New Student
//  */
// app.post('/api/students', async (req, res) => {
//   const { student_id, name, name_en, faculty, major, admission_year } = req.body;
  
//   try {
//     const result = await pool.query(
//       'INSERT INTO students (student_id, name, name_en, faculty, major, admission_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//       [student_id, name, name_en, faculty, major, admission_year]
//     );
    
//     res.json({
//       success: true,
//       student: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error adding student:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // =============================================================================
// // FILE MANAGEMENT ROUTES
// // =============================================================================

// /**
//  * Get All Files
//  */
// app.get('/api/files', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT f.*, u.name as user_name FROM files f LEFT JOIN users u ON f.user_id = u.id ORDER BY f.upload_date DESC'
//     );
    
//     res.json({
//       success: true,
//       files: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting files:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// /**
//  * Preview File Content (Temporary Upload)
//  */
// app.post('/api/files/preview', verifyToken, tempUpload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'No file uploaded for preview' 
//       });
//     }

//     const filePath = req.file.path;
//     const fileExtension = path.extname(req.file.originalname).toLowerCase();
//     const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
    
//     console.log('🔍 Previewing file:', originalName);

//     let previewData = {};

//     try {
//       switch (fileExtension) {
//         case '.csv':
//           previewData = await previewCSV(filePath);
//           break;
//         case '.xlsx':
//         case '.xls':
//           previewData = await previewExcel(filePath);
//           break;
//         case '.pdf':
//           previewData = await previewPDF(filePath);
//           break;
//         default:
//           throw new Error('Unsupported file type for preview');
//       }

//       res.json({
//         success: true,
//         preview: {
//           ...previewData,
//           originalName: originalName,
//           size: req.file.size,
//           type: fileExtension.substring(1).toUpperCase()
//         }
//       });

//     } catch (previewError) {
//       throw previewError;
//     } finally {
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//         console.log('🗑️ Temp file deleted:', filePath);
//       }
//     }

//   } catch (error) {
//     console.error('Preview error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Preview failed: ' + error.message
//     });
//   }
// });

// /**
//  * Upload File (Permanent Storage)
//  */
// app.post('/api/files/upload', verifyToken, upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'No file uploaded' 
//       });
//     }
    
//     console.log('📤 File uploaded:', req.file.originalname);
//     const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
    
//     const allowedTypes = ['.pdf', '.xlsx', '.xls', '.csv'];
//     const fileExtension = path.extname(originalName).toLowerCase();
    
//     if (!allowedTypes.includes(fileExtension)) {
//       fs.unlinkSync(req.file.path);
//       return res.status(400).json({ 
//         success: false,
//         error: 'File type not allowed. Only PDF, Excel, and CSV files are supported.' 
//       });
//     }
    
//     const fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
//     const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();
    
//     const result = await pool.query(
//       'INSERT INTO files (name, size, type, upload_date, user_id, status, file_path) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING *',
//       [
//         originalName,
//         fileSize,
//         fileType,
//         req.user.id || 1,
//         'completed',
//         req.file.path
//       ]
//     );

//     res.json({
//       success: true,
//       message: 'File uploaded successfully',
//       file: {
//         ...result.rows[0],
//         path: `/uploads/${req.file.filename}`,
//         filename: req.file.filename,
//         originalName: originalName
//       }
//     });
    
//     console.log('✅ File saved to database with ID:', result.rows[0].id);
    
//   } catch (error) {
//     console.error('Upload error:', error);
    
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
    
//     res.status(500).json({ 
//       success: false,
//       error: 'Upload failed: ' + error.message
//     });
//   }
// });

// /**
//  * Get File Content
//  */
// app.get('/api/files/:id/content', verifyToken, async (req, res) => {
//   try {
//     const fileResult = await pool.query(
//       'SELECT * FROM files WHERE id = $1',
//       [req.params.id]
//     );

//     if (fileResult.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'File not found' 
//       });
//     }

//     const file = fileResult.rows[0];
//     const filePath = file.file_path;

//     if (!filePath || !fs.existsSync(filePath)) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'File not found on disk' 
//       });
//     }

//     const fileExtension = path.extname(file.name).toLowerCase();
//     let content = {};

//     switch (fileExtension) {
//       case '.csv':
//         content = await previewCSV(filePath);
//         break;
//       case '.xlsx':
//       case '.xls':
//         content = await previewExcel(filePath);
//         break;
//       case '.pdf':
//         content = await previewPDF(filePath);
//         break;
//       default:
//         return res.status(400).json({ 
//           success: false,
//           error: 'Unsupported file type' 
//         });
//     }

//     res.json({
//       success: true,
//       file: file,
//       content: content
//     });

//   } catch (error) {
//     console.error('Read file error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to read file: ' + error.message
//     });
//   }
// });

// /**
//  * Delete File
//  */
// app.delete('/api/files/:id', verifyToken, async (req, res) => {
//   try {
//     const fileResult = await pool.query(
//       'SELECT * FROM files WHERE id = $1',
//       [req.params.id]
//     );

//     if (fileResult.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'File not found' 
//       });
//     }

//     const file = fileResult.rows[0];
    
//     if (file.file_path && fs.existsSync(file.file_path)) {
//       fs.unlinkSync(file.file_path);
//       console.log('🗑️ File deleted from disk:', file.file_path);
//     }
    
//     await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);
    
//     res.json({
//       success: true,
//       message: 'File deleted successfully'
//     });
    
//     console.log('✅ File deleted from database:', file.name);
    
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Delete failed: ' + error.message
//     });
//   }
// });

// // =============================================================================
// // COURSE MANAGEMENT ROUTES
// // =============================================================================

// /**
//  * Get All Courses
//  */
// app.get('/api/courses', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT course_id, course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark, ext1, ext2
//       FROM courses 
//       ORDER BY "year" DESC, semester ASC, course_code ASC
//     `);
    
//     res.json({
//       success: true,
//       courses: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting courses:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// /**
//  * Get Single Course by ID
//  */
// app.get('/api/courses/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(`
//       SELECT course_id, course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark, ext1, ext2
//       FROM courses 
//       WHERE course_id = $1
//     `, [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Course not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       course: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error getting course:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// /**
//  * Create New Course
//  */
// app.post('/api/courses', verifyToken, async (req, res) => {
//   try {
//     const { 
//       course_code, name_lao, name_eng, credit, theory_hours, 
//       lab_hours, practice_hours, semester, year, remark, ext1, ext2 
//     } = req.body;

//     if (!course_code || !name_lao || !name_eng || !credit || 
//         theory_hours === undefined || !semester || !year) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: course_code, name_lao, name_eng, credit, theory_hours, semester, year'
//       });
//     }

//     // Check for duplicate course code
//     const existingCourse = await pool.query(
//       'SELECT course_id FROM courses WHERE course_code = $1',
//       [course_code]
//     );

//     if (existingCourse.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)'
//       });
//     }

//     const result = await pool.query(`
//       INSERT INTO courses 
//       (course_code, name_lao, name_eng, credit, theory_hours, 
//        lab_hours, practice_hours, semester, "year", remark, ext1, ext2)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
//       RETURNING *
//     `, [
//       course_code, 
//       name_lao, 
//       name_eng, 
//       parseInt(credit), 
//       parseInt(theory_hours),
//       parseInt(lab_hours) || 0, 
//       parseInt(practice_hours) || 0, 
//       parseInt(semester), 
//       parseInt(year), 
//       remark || null, 
//       ext1 || null, 
//       ext2 || null
//     ]);
    
//     res.status(201).json({
//       success: true,
//       message: 'Course created successfully',
//       course: result.rows[0]
//     });
    
//     console.log('✅ Course created:', course_code);
    
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while creating course' 
//     });
//   }
// });

// /**
//  * Update Course
//  */
// app.put('/api/courses/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       course_code, name_lao, name_eng, credit, theory_hours, 
//       lab_hours, practice_hours, semester, year, remark, ext1, ext2 
//     } = req.body;

//     if (!course_code || !name_lao || !name_eng || !credit || 
//         theory_hours === undefined || !semester || !year) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields'
//       });
//     }

//     const existingCourse = await pool.query(
//       'SELECT course_id FROM courses WHERE course_id = $1',
//       [id]
//     );

//     if (existingCourse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Course not found'
//       });
//     }

//     // Check for duplicate course code (excluding current course)
//     const duplicateCode = await pool.query(
//       'SELECT course_id FROM courses WHERE course_code = $1 AND course_id != $2',
//       [course_code, id]
//     );

//     if (duplicateCode.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)'
//       });
//     }

//     const result = await pool.query(`
//       UPDATE courses SET 
//         course_code = $1, name_lao = $2, name_eng = $3, credit = $4, 
//         theory_hours = $5, lab_hours = $6, practice_hours = $7, 
//         semester = $8, "year" = $9, remark = $10, ext1 = $11, ext2 = $12
//       WHERE course_id = $13
//       RETURNING *
//     `, [
//       course_code, 
//       name_lao, 
//       name_eng, 
//       parseInt(credit), 
//       parseInt(theory_hours),
//       parseInt(lab_hours) || 0, 
//       parseInt(practice_hours) || 0, 
//       parseInt(semester), 
//       parseInt(year), 
//       remark || null, 
//       ext1 || null, 
//       ext2 || null, 
//       id
//     ]);
    
//     res.json({
//       success: true,
//       message: 'Course updated successfully',
//       course: result.rows[0]
//     });
    
//     console.log('✅ Course updated:', course_code);
    
//   } catch (error) {
//     console.error('Error updating course:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while updating course' 
//     });
//   }
// });

// /**
//  * Delete Course
//  */
// app.delete('/api/courses/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const existingCourse = await pool.query(
//       'SELECT course_code FROM courses WHERE course_id = $1',
//       [id]
//     );

//     if (existingCourse.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Course not found'
//       });
//     }

//     const courseCode = existingCourse.rows[0].course_code;

//     await pool.query('DELETE FROM courses WHERE course_id = $1', [id]);
    
//     res.json({
//       success: true,
//       message: 'Course deleted successfully'
//     });
    
//     console.log('✅ Course deleted:', courseCode);
    
//   } catch (error) {
//     console.error('Error deleting course:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while deleting course' 
//     });
//   }
// });

// /**
//  * Search Courses
//  */
// app.get('/api/courses/search/:term', async (req, res) => {
//   try {
//     const { term } = req.params;
//     const result = await pool.query(`
//       SELECT course_id, course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark, ext1, ext2
//       FROM courses 
//       WHERE LOWER(course_code) LIKE LOWER($1) 
//          OR LOWER(name_lao) LIKE LOWER($1) 
//          OR LOWER(name_eng) LIKE LOWER($1)
//       ORDER BY "year" DESC, semester ASC, course_code ASC
//     `, [`%${term}%`]);
    
//     res.json({
//       success: true,
//       courses: result.rows
//     });
//   } catch (error) {
//     console.error('Error searching courses:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // =============================================================================
// // SCORES MANAGEMENT ROUTES
// // =============================================================================

// /**
//  * Get All Scores with Student and Course Details
//  */
// app.get('/api/scores', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         s.id,
//         s.student_id,
//         st.first_name_lao,
//         st.last_name_lao,
//         st.email AS student_email,
//         st.dob,
//         st.entry_year,
//         st.is_active,
//         s.course_code,
//         c.name_lao AS course_name_lao,
//         c.name_eng AS course_name_eng,
//         c.credit,
//         c.theory_hours,
//         c.lab_hours,
//         c.practice_hours,
//         c.semester AS course_semester,
//         c."year" AS course_year,
//         s.academic_year,
//         s.semester AS score_semester,
//         s.midterm_score,
//         s.midterm_grade,
//         s.exam_score,
//         s.exam_grade,
//         s.final_score,
//         s.final_grade,
//         s.email AS score_email
//       FROM scores s
//       LEFT JOIN students st ON s.student_id = st.student_id
//       LEFT JOIN courses c ON s.course_code = c.course_code
//       ORDER BY s.academic_year DESC, s.semester ASC, s.student_id ASC
//     `);
    
//     res.json({
//       success: true,
//       scores: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting scores:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while getting scores' 
//     });
//   }
// });

// /**
//  * Create New Score
//  */
// app.post('/api/scores', verifyToken, async (req, res) => {
//   try {
//     const { 
//       student_id, course_code, academic_year, semester,
//       midterm_score, midterm_grade, exam_score, exam_grade,
//       final_score, final_grade, email 
//     } = req.body;

//     if (!student_id || !course_code || !academic_year || !semester) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: student_id, course_code, academic_year, semester'
//       });
//     }

//     // Check if student exists
//     const studentCheck = await pool.query(
//       'SELECT student_id FROM students WHERE student_id = $1',
//       [student_id]
//     );
//     if (studentCheck.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ບໍ່ພົບນັກສຶກສາທີ່ມີລະຫັດດັ່ງກ່າວ'
//       });
//     }

//     // Check if course exists
//     const courseCheck = await pool.query(
//       'SELECT course_code FROM courses WHERE course_code = $1',
//       [course_code]
//     );
//     if (courseCheck.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ບໍ່ພົບວິຊາທີ່ມີລະຫັດດັ່ງກ່າວ'
//       });
//     }

//     // Check for duplicate score entry
//     const duplicateCheck = await pool.query(
//       'SELECT id FROM scores WHERE student_id = $1 AND course_code = $2 AND academic_year = $3 AND semester = $4',
//       [student_id, course_code, academic_year, semester]
//     );
//     if (duplicateCheck.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ'
//       });
//     }

//     const result = await pool.query(`
//       INSERT INTO scores 
//       (student_id, course_code, academic_year, semester, midterm_score, midterm_grade, 
//        exam_score, exam_grade, final_score, final_grade, email, created_at, updated_at)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
//       RETURNING *
//     `, [
//       student_id, 
//       course_code, 
//       parseInt(academic_year), 
//       parseInt(semester),
//       midterm_score ? parseFloat(midterm_score) : null,
//       midterm_grade || null,
//       exam_score ? parseFloat(exam_score) : null,
//       exam_grade || null,
//       final_score ? parseFloat(final_score) : null,
//       final_grade || null,
//       email || null
//     ]);
    
//     res.status(201).json({
//       success: true,
//       message: 'Score created successfully',
//       score: result.rows[0]
//     });
    
//     console.log('✅ Score created for student:', student_id);
    
//   } catch (error) {
//     console.error('Error creating score:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while creating score' 
//     });
//   }
// });

// /**
//  * Update Score
//  */
// // app.put('/api/scores/:id', verifyToken, async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { 
// //       student_id, course_code, academic_year, semester,
// //       midterm_score, midterm_grade, exam_score, exam_grade,
// //       final_score, final_grade, email 
// //     } = req.body;

// //     if (!student_id || !course_code || !academic_year || !semester) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Missing required fields'
// //       });
// //     }

// //     const existingScore = await pool.query(
// //       'SELECT id FROM scores WHERE id = $1',
// //       [id]
// //     );
// //     if (existingScore.rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Score not found'
// //       });
// //     }


// app.put('/api/scores/:id', async (req, res) => {
// const { id } = req.params;
// const {
// midterm_score,
// midterm_grade,
// exam_score,
// exam_grade,
// final_score,
// final_grade
// } = req.body;


// try {
// const result = await pool.query(
// `UPDATE scores
// SET midterm_score=$1, midterm_grade=$2,
// exam_score=$3, exam_grade=$4,
// final_score=$5, final_grade=$6
// WHERE id=$7
// RETURNING *`,
// [
// midterm_score,
// midterm_grade,
// exam_score,
// exam_grade,
// final_score,
// final_grade,
// id
// ]
// );


// if (result.rows.length === 0) {
// return res.status(404).json({ error: 'Score not found' });
// }


// res.json({ score: result.rows[0] });
// } catch (err) {
// console.error('Error updating score:', err);
// res.status(500).json({ error: 'Server error while updating score' });
// }
// });app.put('/api/scores/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;  

//     // Check for duplicate score entry (excluding current record)
//     const duplicateCheck = await pool.query(
//       'SELECT id FROM scores WHERE student_id = $1 AND course_code = $2 AND academic_year = $3 AND semester = $4 AND id != $5',
//       [student_id, course_code, academic_year, semester, id]
//     );
//     if (duplicateCheck.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ'
//       });
//     }

//     const result = await pool.query(`
//       UPDATE scores SET 
//         student_id = $1, course_code = $2, academic_year = $3, semester = $4,
//         midterm_score = $5, midterm_grade = $6, exam_score = $7, exam_grade = $8,
//         final_score = $9, final_grade = $10, email = $11, updated_at = NOW()
//       WHERE id = $12
//       RETURNING *
//     `, [
//       student_id, 
//       course_code, 
//       parseInt(academic_year), 
//       parseInt(semester),
//       midterm_score ? parseFloat(midterm_score) : null,
//       midterm_grade || null,
//       exam_score ? parseFloat(exam_score) : null,
//       exam_grade || null,
//       final_score ? parseFloat(final_score) : null,
//       final_grade || null,
//       email || null,
//       id
//     ]);
    
//     res.json({
//       success: true,
//       message: 'Score updated successfully',
//       score: result.rows[0]
//     });
    
//     console.log('✅ Score updated for student:', student_id);
    
//   } catch (error) {
//     console.error('Error updating score:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while updating score' 
//     });
//   }
// });

// /**
//  * Delete Score
//  */
// app.delete('/api/scores/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const existingScore = await pool.query(
//       'SELECT student_id, course_code FROM scores WHERE id = $1',
//       [id]
//     );
//     if (existingScore.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Score not found'
//       });
//     }

//     const { student_id, course_code } = existingScore.rows[0];

//     await pool.query('DELETE FROM scores WHERE id = $1', [id]);
    
//     res.json({
//       success: true,
//       message: 'Score deleted successfully'
//     });
    
//     console.log('✅ Score deleted for student:', student_id, 'course:', course_code);
    
//   } catch (error) {
//     console.error('Error deleting score:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while deleting score' 
//     });
//   }
// });

// /**
//  * Get Scores by Student ID
//  */
// app.get('/api/scores/student/:student_id', async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const result = await pool.query(`
//       SELECT 
//         s.id,
//         s.student_id,
//         st.first_name_lao,
//         st.last_name_lao,
//         s.course_code,
//         c.name_lao AS course_name_lao,
//         c.name_eng AS course_name_eng,
//         c.credit,
//         s.academic_year,
//         s.semester,
//         s.midterm_score,
//         s.midterm_grade,
//         s.exam_score,
//         s.exam_grade,
//         s.final_score,
//         s.final_grade
//       FROM scores s
//       LEFT JOIN students st ON s.student_id = st.student_id
//       LEFT JOIN courses c ON s.course_code = c.course_code
//       WHERE s.student_id = $1
//       ORDER BY s.academic_year DESC, s.semester ASC
//     `, [student_id]);
    
//     res.json({
//       success: true,
//       scores: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting scores by student:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while getting student scores' 
//     });
//   }
// });

// /**
//  * Generate Transcript for Student
//  */
// app.get('/api/scores/transcript/:student_id', async (req, res) => {
//   try {
//     const { student_id } = req.params;
    
//     // Get student info
//     const studentInfo = await pool.query(
//       'SELECT * FROM students WHERE student_id = $1',
//       [student_id]
//     );
    
//     if (studentInfo.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Student not found'
//       });
//     }
    
//     // Get all scores for the student
//     const scores = await pool.query(`
//       SELECT 
//         s.*,
//         c.name_lao AS course_name_lao,
//         c.name_eng AS course_name_eng,
//         c.credit,
//         c.theory_hours,
//         c.lab_hours,
//         c.practice_hours
//       FROM scores s
//       LEFT JOIN courses c ON s.course_code = c.course_code
//       WHERE s.student_id = $1
//       ORDER BY s.academic_year ASC, s.semester ASC
//     `, [student_id]);
    
//     // Calculate GPA
//     const totalCredits = scores.rows.reduce((sum, score) => sum + (score.credit || 0), 0);
//     const gradePoints = {
//       'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
//     };
    
//     let totalGradePoints = 0;
//     let totalCreditHours = 0;
    
//     scores.rows.forEach(score => {
//       if (score.final_grade && score.credit && gradePoints[score.final_grade] !== undefined) {
//         totalGradePoints += gradePoints[score.final_grade] * score.credit;
//         totalCreditHours += score.credit;
//       }
//     });
    
//     const gpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : 0;
    
//     res.json({
//       success: true,
//       transcript: {
//         student: studentInfo.rows[0],
//         scores: scores.rows,
//         summary: {
//           total_credits: totalCredits,
//           completed_credits: totalCreditHours,
//           gpa: parseFloat(gpa),
//           total_courses: scores.rows.length
//         }
//       }
//     });
    
//   } catch (error) {
//     console.error('Error generating transcript:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while generating transcript' 
//     });
//   }
// });

// // =============================================================================
// // certificate 
// // ================== Certificate Summary JSON ==================
// app.get("/api/v1/reports/summary-json/:year/:semester", verifyToken, async (req, res) => {
//   const { year, semester } = req.params;

//   try {
//     // ดึงข้อมูล course
//     const coursesResult = await pool.query(
//       `SELECT course_code, name_lao AS course_name_lao, name_eng AS course_name_eng
//        FROM courses
//        WHERE "year" = $1 AND semester = $2
//        ORDER BY course_code`,
//       [year, semester]
//     );

//     const courses = coursesResult.rows;

//     // ดึงข้อมูลนักศึกษา + คะแนน
//     const studentsResult = await pool.query(
//       `SELECT s.student_id, s.first_name_lao, s.last_name_lao,
//               sc.course_code, sc.final_grade
//        FROM students s
//        LEFT JOIN scores sc ON s.student_id = sc.student_id
//        WHERE sc.academic_year = $1 AND sc.semester = $2
//        ORDER BY s.student_id`,
//       [year, semester]
//     );

//     // จัดรูปแบบข้อมูล
//     const studentsMap = {};
//     studentsResult.rows.forEach((row) => {
//       if (!studentsMap[row.student_id]) {
//         studentsMap[row.student_id] = {
//           student_id: row.student_id,
//           first_name_lao: row.first_name_lao,
//           last_name_lao: row.last_name_lao,
//           scores: {}
//         };
//       }
//       studentsMap[row.student_id].scores[row.course_code] = row.final_grade;
//     });

//     const students = Object.values(studentsMap);

//     res.json({
//       courses,
//       students
//     });
//   } catch (err) {
//     console.error("Error fetching certificate summary:", err);
//     res.status(500).json({ error: "Failed to fetch certificate summary" });
//   }
// });


// //==============================================================================



// // =============================================================================
// // SERVER STARTUP
// // =============================================================================

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`
//   ====================================
//   🚀 Education Management System API
//   📍 Server URL: http://localhost:${PORT}
//   📍 Health Check: http://localhost:${PORT}
//   📍 API Base: http://localhost:${PORT}/api
  
//   📂 Available Endpoints:
//   ┌─ Authentication ────────────────────
//   │ POST /api/auth/login
//   ├─ User Management ──────────────────
//   │ GET    /api/users
//   │ POST   /api/users
//   │ GET    /api/users/:id
//   │ PUT    /api/users/:id
//   │ DELETE /api/users/:id
//   │ GET    /api/users/search/:term
//   │ GET    /api/users/stats
//   ├─ Student Management ───────────────
//   │ GET    /api/students
//   │ POST   /api/students
//   ├─ Course Management ────────────────
//   │ GET    /api/courses
//   │ POST   /api/courses
//   │ GET    /api/courses/:id
//   │ PUT    /api/courses/:id
//   │ DELETE /api/courses/:id
//   │ GET    /api/courses/search/:term
//   ├─ File Management ──────────────────
//   │ GET    /api/files
//   │ POST   /api/files/preview
//   │ POST   /api/files/upload
//   │ GET    /api/files/:id/content
//   │ DELETE /api/files/:id
//   ├─ Scores Management ────────────────
//   │ GET    /api/scores
//   │ POST   /api/scores
//   │ PUT    /api/scores/:id
//   │ DELETE /api/scores/:id
//   │ GET    /api/scores/student/:student_id
//   │ GET    /api/scores/transcript/:student_id
//   └─────────────────────────────────────
  
//   🔑 Test Accounts:
//   • admin@ict.la / password123
//   • staff@ict.la / password123
//   • student@ict.la / password123
  
//   📁 File Support: PDF, Excel (.xlsx/.xls), CSV
//   🗄️  Database: PostgreSQL
//   🔒 Authentication: JWT Tokens
//   ====================================
//   `);
// });


// Server.js (cleaned + documented)
// ----------------------------------------------------------------------------
// Key improvements:
// - Consolidated, consistent error handling & responses
// - Safer CORS with exposed headers for downloads
// - Fixed duplicate PUT /api/scores/:id routes
// - Added /api/v1/reports/summary-excel/:year/:semester endpoint
// - Normalized inputs (parseInt/parseFloat) before DB writes
// - Extracted small helpers (wrap, ok, fail) to reduce boilerplate
// - Better logging with emojis for quick scanning
// ----------------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");
// ถ้า Node เวอร์ชัน < 18 ให้ใช้ node-fetch (ถ้า Node 18+ ข้ามส่วนนี้ได้)
// const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const { Readable } = require('stream'); // สำหรับแปลง web stream -> Node stream



// =============================================================================
// APP & CORE MIDDLEWARE
// =============================================================================
const app = express();

app.use(
  cors({
    origin: true, // allow all origins in dev; replace with specific origin in prod
    credentials: true,
    exposedHeaders: ["Content-Disposition"], // allow frontend to read filename header
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health
app.get(["/", "/health"], (req, res) => res.json({ message: "🚀 Backend API is running!" }));

// =============================================================================
// DATABASE
// =============================================================================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
    console.log("Please check your database credentials in .env file");
  } else {
    console.log("✅ Connected to PostgreSQL database");
    release();
  }
});

// =============================================================================
// HELPERS
// =============================================================================
const ok = (res, data = {}) => res.json({ success: true, ...data });
const fail = (res, code, error) => res.status(code).json({ success: false, error });

// Wrap async route handlers
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    // WARNING: dev fallback only; remove in production
    req.user = { id: 1, role: "admin", devBypass: true };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, decoded) => {
    if (err) return fail(res, 403, "Invalid token");
    req.user = decoded;
    next();
  });
};

// =============================================================================
// FILE STORAGE (multer)
// =============================================================================
const uploadsDir = path.join(__dirname, "uploads");
const tempDir = path.join(__dirname, "temp");
[uploadsDir, tempDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created ${path.basename(dir)} folder`);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  },
});

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "temp/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `temp_${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|xlsx|xls|csv/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) return cb(null, true);
  cb(new Error("Only PDF, Excel, and CSV files allowed"));
};

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });
const tempUpload = multer({ storage: tempStorage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });

// =============================================================================
// FILE PREVIEW UTILITIES
// =============================================================================
const previewCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const results = [];
    let headers = [];
    let rowCount = 0;

    fs.createReadStream(filePath, { encoding: "utf8" })
      .pipe(csv())
      .on("headers", (headerList) => (headers = headerList.map((h) => h.trim())))
      .on("data", (data) => {
        rowCount++;
        if (rowCount <= 5) results.push(Object.values(data));
      })
      .on("end", () =>
        resolve({ type: "CSV", headers, preview: results, totalRows: rowCount, columns: headers.length })
      )
      .on("error", (err) => reject(new Error("CSV parsing failed: " + err.message)));
  });

const previewExcel = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const firstSheet = workbook.Sheets[sheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  if (jsonData.length === 0) throw new Error("Excel file is empty");

  const headers = jsonData[0] || [];
  const preview = jsonData.slice(1, 6);
  const totalRows = jsonData.length - 1;

  const fileName = path.basename(filePath);
  let subject = null;
  if (fileName.includes("ການສື່ສານຂໍ້ມູນ") || fileName.includes("Communication")) {
    subject = "ວິຊາ ການສື່ສານຂໍ້ມູນ 2025";
  }

  return {
    type: "Excel",
    headers: headers.map((h) => (h ? h.toString().trim() : "")),
    preview,
    totalRows,
    columns: headers.length,
    sheets: sheetNames,
    activeSheet: sheetNames[0],
    subject,
  };
};

const previewPDF = async (filePath) => {
  const stats = fs.statSync(filePath);
  return {
    type: "PDF",
    pages: "N/A",
    title: "PDF Document",
    info: `ເອກະສານ PDF ຂະໜາດ ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
    size: stats.size,
  };
};

// =============================================================================
// AUTH
// =============================================================================
app.post(
  "/api/auth/login",
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return fail(res, 401, "User not found");
    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return fail(res, 401, "Invalid password");

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("✅ Login:", email);
    return ok(res, {
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  })
);

// =============================================================================
// USERS
// =============================================================================
app.get(
  "/api/users",
  wrap(async (req, res) => {
    const q = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at, last_login, login_count
       FROM users ORDER BY created_at DESC`
    );
    return ok(res, { users: q.rows });
  })
);

app.get(
  "/api/users/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const q = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at, last_login, login_count
       FROM users WHERE id = $1`,
      [id]
    );
    if (q.rows.length === 0) return fail(res, 404, "User not found");
    return ok(res, { user: q.rows[0] });
  })
);

app.post(
  "/api/users",
  verifyToken,
  wrap(async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !password) return fail(res, 400, "Name, email, and password are required");

    const exist = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exist.rows.length > 0) return fail(res, 400, "User with this email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const r = await pool.query(
      `INSERT INTO users (name, email, phone, role, password, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING id, name, email, phone, role, status, created_at`,
      [name, email, phone || null, role || "student", hashed, "active"]
    );

    console.log("✅ User created:", email);
    return ok(res, { message: "User created successfully", user: r.rows[0] });
  })
);

app.put(
  "/api/users/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, password, status } = req.body;
    if (!name || !email) return fail(res, 400, "Name and email are required");

    const existing = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (existing.rows.length === 0) return fail(res, 404, "User not found");

    const dup = await pool.query("SELECT id FROM users WHERE email = $1 AND id != $2", [email, id]);
    if (dup.rows.length > 0) return fail(res, 400, "Email is already used by another user");

    let r;
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      r = await pool.query(
        `UPDATE users SET name=$1, email=$2, phone=$3, role=$4, password=$5, status=$6, updated_at=NOW()
         WHERE id=$7 RETURNING id, name, email, phone, role, status, created_at, updated_at`,
        [name, email, phone || null, role || "student", hashed, status || "active", id]
      );
    } else {
      r = await pool.query(
        `UPDATE users SET name=$1, email=$2, phone=$3, role=$4, status=$5, updated_at=NOW()
         WHERE id=$6 RETURNING id, name, email, phone, role, status, created_at, updated_at`,
        [name, email, phone || null, role || "student", status || "active", id]
      );
    }

    console.log("✅ User updated:", email);
    return ok(res, { message: "User updated successfully", user: r.rows[0] });
  })
);

app.delete(
  "/api/users/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const existing = await pool.query("SELECT email FROM users WHERE id = $1", [id]);
    if (existing.rows.length === 0) return fail(res, 404, "User not found");

    if (req.user && Number(req.user.id) === Number(id)) return fail(res, 400, "Cannot delete your own account");
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    console.log("✅ User deleted:", existing.rows[0].email);
    return ok(res, { message: "User deleted successfully" });
  })
);

app.get(
  "/api/users/search/:term",
  verifyToken,
  wrap(async (req, res) => {
    const { term } = req.params;
    const r = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at, last_login, login_count
       FROM users
       WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1) OR LOWER(phone) LIKE LOWER($1)
       ORDER BY name ASC`,
      ["%" + term + "%"]
    );
    return ok(res, { users: r.rows });
  })
);

app.get(
  "/api/users/stats",
  verifyToken,
  wrap(async (req, res) => {
    const totalUsers = await pool.query("SELECT COUNT(*) as count FROM users");
    const roleStats = await pool.query("SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role");
    const statusStats = await pool.query("SELECT status, COUNT(*) as count FROM users GROUP BY status ORDER BY status");
    const recentUsers = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '30 days'`
    );
    const activeUsers = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE last_login >= NOW() - INTERVAL '30 days' AND status = 'active'`
    );

    return ok(res, {
      stats: {
        total_users: parseInt(totalUsers.rows[0].count),
        role_breakdown: roleStats.rows,
        status_breakdown: statusStats.rows,
        recent_registrations: parseInt(recentUsers.rows[0].count),
        active_last_30_days: parseInt(activeUsers.rows[0].count),
      },
    });
  })
);

// =============================================================================
// STUDENTS
// =============================================================================
app.get(
  "/api/students",
  wrap(async (req, res) => {
    const r = await pool.query("SELECT * FROM students");
    return ok(res, { students: r.rows });
  })
);

app.post(
  "/api/students",
  wrap(async (req, res) => {
    const { student_id, name, name_en, faculty, major, admission_year } = req.body;
    const r = await pool.query(
      `INSERT INTO students (student_id, name, name_en, faculty, major, admission_year)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [student_id, name, name_en, faculty, major, admission_year]
    );
    return ok(res, { student: r.rows[0] });
  })
);

// =============================================================================
// FILES
// =============================================================================
app.get(
  "/api/files",
  wrap(async (req, res) => {
    const r = await pool.query(
      `SELECT f.*, u.name as user_name FROM files f LEFT JOIN users u ON f.user_id = u.id ORDER BY f.upload_date DESC`
    );
    return ok(res, { files: r.rows });
  })
);

app.post(
  "/api/files/preview",
  verifyToken,
  tempUpload.single("file"),
  wrap(async (req, res) => {
    if (!req.file) return fail(res, 400, "No file uploaded for preview");

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const originalName = Buffer.from(req.file.originalname, "latin1").toString("utf-8");

    console.log("🔍 Previewing file:", originalName);

    try {
      let previewData;
      if (ext === ".csv") previewData = await previewCSV(filePath);
      else if (ext === ".xlsx" || ext === ".xls") previewData = await previewExcel(filePath);
      else if (ext === ".pdf") previewData = await previewPDF(filePath);
      else return fail(res, 400, "Unsupported file type for preview");

      ok(res, {
        preview: { ...previewData, originalName, size: req.file.size, type: ext.substring(1).toUpperCase() },
      });
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑️ Temp file deleted:", filePath);
      }
    }
  })
);

app.post(
  "/api/files/upload",
  verifyToken,
  upload.single("file"),
  wrap(async (req, res) => {
    if (!req.file) return fail(res, 400, "No file uploaded");

    console.log("📤 File uploaded:", req.file.originalname);
    const originalName = Buffer.from(req.file.originalname, "latin1").toString("utf-8");

    const allowed = [".pdf", ".xlsx", ".xls", ".csv"];
    const ext = path.extname(originalName).toLowerCase();
    if (!allowed.includes(ext)) {
      fs.unlinkSync(req.file.path);
      return fail(res, 400, "File type not allowed. Only PDF, Excel, and CSV files are supported.");
    }

    const fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
    const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();

    const r = await pool.query(
      `INSERT INTO files (name, size, type, upload_date, user_id, status, file_path)
       VALUES ($1,$2,$3,NOW(),$4,$5,$6) RETURNING *`,
      [originalName, fileSize, fileType, req.user.id || 1, "completed", req.file.path]
    );

    console.log("✅ File saved to database with ID:", r.rows[0].id);
    return ok(res, {
      message: "File uploaded successfully",
      file: { ...r.rows[0], path: `/uploads/${req.file.filename}`, filename: req.file.filename, originalName },
    });
  })
);

app.get(
  "/api/files/:id/content",
  verifyToken,
  wrap(async (req, res) => {
    const fr = await pool.query("SELECT * FROM files WHERE id = $1", [req.params.id]);
    if (fr.rows.length === 0) return fail(res, 404, "File not found");

    const file = fr.rows[0];
    const filePath = file.file_path;
    if (!filePath || !fs.existsSync(filePath)) return fail(res, 404, "File not found on disk");

    const ext = path.extname(file.name).toLowerCase();
    let content;
    if (ext === ".csv") content = await previewCSV(filePath);
    else if (ext === ".xlsx" || ext === ".xls") content = await previewExcel(filePath);
    else if (ext === ".pdf") content = await previewPDF(filePath);
    else return fail(res, 400, "Unsupported file type");

    return ok(res, { file, content });
  })
);

app.delete(
  "/api/files/:id",
  verifyToken,
  wrap(async (req, res) => {
    const fr = await pool.query("SELECT * FROM files WHERE id = $1", [req.params.id]);
    if (fr.rows.length === 0) return fail(res, 404, "File not found");

    const file = fr.rows[0];
    if (file.file_path && fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
      console.log("🗑️ File deleted from disk:", file.file_path);
    }
    await pool.query("DELETE FROM files WHERE id = $1", [req.params.id]);
    console.log("✅ File deleted from database:", file.name);
    return ok(res, { message: "File deleted successfully" });
  })
);

// =============================================================================
// COURSES
// =============================================================================
app.get(
  "/api/courses",
  wrap(async (req, res) => {
    const r = await pool.query(
      `SELECT course_id, course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, "year", remark, ext1, ext2
       FROM courses ORDER BY "year" DESC, semester ASC, course_code ASC`
    );
    return ok(res, { courses: r.rows });
  })
);

app.get(
  "/api/courses/:id",
  wrap(async (req, res) => {
    const { id } = req.params;
    const r = await pool.query(
      `SELECT course_id, course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, "year", remark, ext1, ext2
       FROM courses WHERE course_id = $1`,
      [id]
    );
    if (r.rows.length === 0) return fail(res, 404, "Course not found");
    return ok(res, { course: r.rows[0] });
  })
);

app.post(
  "/api/courses",
  verifyToken,
  wrap(async (req, res) => {
    const { course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, year, remark, ext1, ext2 } = req.body;
    if (!course_code || !name_lao || !name_eng || !credit || theory_hours === undefined || !semester || !year)
      return fail(res, 400, "Missing required fields: course_code, name_lao, name_eng, credit, theory_hours, semester, year");

    const exist = await pool.query("SELECT course_id FROM courses WHERE course_code = $1", [course_code]);
    if (exist.rows.length > 0) return fail(res, 400, "ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)");

    const r = await pool.query(
      `INSERT INTO courses (course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, "year", remark, ext1, ext2)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        course_code,
        name_lao,
        name_eng,
        parseInt(credit),
        parseInt(theory_hours),
        parseInt(lab_hours) || 0,
        parseInt(practice_hours) || 0,
        parseInt(semester),
        parseInt(year),
        remark || null,
        ext1 || null,
        ext2 || null,
      ]
    );

    console.log("✅ Course created:", course_code);
    return ok(res, { message: "Course created successfully", course: r.rows[0] });
  })
);

app.put(
  "/api/courses/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const { course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, year, remark, ext1, ext2 } = req.body;
    if (!course_code || !name_lao || !name_eng || !credit || theory_hours === undefined || !semester || !year)
      return fail(res, 400, "Missing required fields");

    const exist = await pool.query("SELECT course_id FROM courses WHERE course_id = $1", [id]);
    if (exist.rows.length === 0) return fail(res, 404, "Course not found");

    const dup = await pool.query("SELECT course_id FROM courses WHERE course_code = $1 AND course_id != $2", [course_code, id]);
    if (dup.rows.length > 0) return fail(res, 400, "ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)");

    const r = await pool.query(
      `UPDATE courses SET course_code=$1, name_lao=$2, name_eng=$3, credit=$4, theory_hours=$5, lab_hours=$6, practice_hours=$7, semester=$8, "year"=$9, remark=$10, ext1=$11, ext2=$12
       WHERE course_id=$13 RETURNING *`,
      [
        course_code,
        name_lao,
        name_eng,
        parseInt(credit),
        parseInt(theory_hours),
        parseInt(lab_hours) || 0,
        parseInt(practice_hours) || 0,
        parseInt(semester),
        parseInt(year),
        remark || null,
        ext1 || null,
        ext2 || null,
        id,
      ]
    );

    console.log("✅ Course updated:", course_code);
    return ok(res, { message: "Course updated successfully", course: r.rows[0] });
  })
);

app.delete(
  "/api/courses/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const exist = await pool.query("SELECT course_code FROM courses WHERE course_id = $1", [id]);
    if (exist.rows.length === 0) return fail(res, 404, "Course not found");
    await pool.query("DELETE FROM courses WHERE course_id = $1", [id]);
    console.log("✅ Course deleted:", exist.rows[0].course_code);
    return ok(res, { message: "Course deleted successfully" });
  })
);

app.get(
  "/api/courses/search/:term",
  wrap(async (req, res) => {
    const { term } = req.params;
    const r = await pool.query(
      `SELECT course_id, course_code, name_lao, name_eng, credit, theory_hours, lab_hours, practice_hours, semester, "year", remark, ext1, ext2
       FROM courses WHERE LOWER(course_code) LIKE LOWER($1) OR LOWER(name_lao) LIKE LOWER($1) OR LOWER(name_eng) LIKE LOWER($1)
       ORDER BY "year" DESC, semester ASC, course_code ASC`,
      ["%" + term + "%"]
    );
    return ok(res, { courses: r.rows });
  })
);

// =============================================================================
// SCORES
// =============================================================================
app.get(
  "/api/scores",
  wrap(async (req, res) => {
    const r = await pool.query(
      `SELECT s.id, s.student_id, st.first_name_lao, st.last_name_lao, st.email AS student_email, st.dob, st.entry_year, st.is_active,
              s.course_code, c.name_lao AS course_name_lao, c.name_eng AS course_name_eng, c.credit, c.theory_hours, c.lab_hours, c.practice_hours,
              c.semester AS course_semester, c."year" AS course_year,
              s.academic_year, s.semester AS score_semester, s.midterm_score, s.midterm_grade, s.exam_score, s.exam_grade, s.final_score, s.final_grade, s.email AS score_email
       FROM scores s
       LEFT JOIN students st ON s.student_id = st.student_id
       LEFT JOIN courses c ON s.course_code = c.course_code
       ORDER BY s.academic_year DESC, s.semester ASC, s.student_id ASC`
    );
    return ok(res, { scores: r.rows });
  })
);

app.post(
  "/api/scores",
  verifyToken,
  wrap(async (req, res) => {
    const { student_id, course_code, academic_year, semester, midterm_score, midterm_grade, exam_score, exam_grade, final_score, final_grade, email } = req.body;
    if (!student_id || !course_code || !academic_year || !semester)
      return fail(res, 400, "Missing required fields: student_id, course_code, academic_year, semester");

    const st = await pool.query("SELECT student_id FROM students WHERE student_id = $1", [student_id]);
    if (st.rows.length === 0) return fail(res, 400, "ບໍ່ພົບນັກສຶກສາທີ່ມີລະຫັດດັ່ງກ່າວ");

    const cr = await pool.query("SELECT course_code FROM courses WHERE course_code = $1", [course_code]);
    if (cr.rows.length === 0) return fail(res, 400, "ບໍ່ພົບວິຊາທີ່ມີລະຫັດດັ່ງກ່າວ");

    const dup = await pool.query(
      "SELECT id FROM scores WHERE student_id=$1 AND course_code=$2 AND academic_year=$3 AND semester=$4",
      [student_id, course_code, academic_year, semester]
    );
    if (dup.rows.length > 0) return fail(res, 400, "ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ");

    const r = await pool.query(
      `INSERT INTO scores (student_id, course_code, academic_year, semester, midterm_score, midterm_grade, exam_score, exam_grade, final_score, final_grade, email, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW()) RETURNING *`,
      [
        student_id,
        course_code,
        parseInt(academic_year),
        parseInt(semester),
        midterm_score ? parseFloat(midterm_score) : null,
        midterm_grade || null,
        exam_score ? parseFloat(exam_score) : null,
        exam_grade || null,
        final_score ? parseFloat(final_score) : null,
        final_grade || null,
        email || null,
      ]
    );

    console.log("✅ Score created for student:", student_id);
    return ok(res, { message: "Score created successfully", score: r.rows[0] });
  })
);

// Single, definitive PUT route (fixes duplicate definitions)
app.put(
  "/api/scores/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const { student_id, course_code, academic_year, semester, midterm_score, midterm_grade, exam_score, exam_grade, final_score, final_grade, email } = req.body;

    // Optional: allow partial updates; here we expect full payload for consistency
    if (!student_id || !course_code || !academic_year || !semester)
      return fail(res, 400, "Missing required fields");

    const exists = await pool.query("SELECT id FROM scores WHERE id=$1", [id]);
    if (exists.rows.length === 0) return fail(res, 404, "Score not found");

    const dup = await pool.query(
      "SELECT id FROM scores WHERE student_id=$1 AND course_code=$2 AND academic_year=$3 AND semester=$4 AND id != $5",
      [student_id, course_code, academic_year, semester, id]
    );
    if (dup.rows.length > 0) return fail(res, 400, "ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ");

    const r = await pool.query(
      `UPDATE scores SET student_id=$1, course_code=$2, academic_year=$3, semester=$4, midterm_score=$5, midterm_grade=$6, exam_score=$7, exam_grade=$8, final_score=$9, final_grade=$10, email=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [
        student_id,
        course_code,
        parseInt(academic_year),
        parseInt(semester),
        midterm_score ? parseFloat(midterm_score) : null,
        midterm_grade || null,
        exam_score ? parseFloat(exam_score) : null,
        exam_grade || null,
        final_score ? parseFloat(final_score) : null,
        final_grade || null,
        email || null,
        id,
      ]
    );

    console.log("✅ Score updated for student:", student_id);
    return ok(res, { message: "Score updated successfully", score: r.rows[0] });
  })
);

app.delete(
  "/api/scores/:id",
  verifyToken,
  wrap(async (req, res) => {
    const { id } = req.params;
    const ex = await pool.query("SELECT student_id, course_code FROM scores WHERE id=$1", [id]);
    if (ex.rows.length === 0) return fail(res, 404, "Score not found");
    await pool.query("DELETE FROM scores WHERE id = $1", [id]);
    console.log("✅ Score deleted for student:", ex.rows[0].student_id, "course:", ex.rows[0].course_code);
    return ok(res, { message: "Score deleted successfully" });
  })
);

app.get(
  "/api/scores/student/:student_id",
  wrap(async (req, res) => {
    const { student_id } = req.params;
    const r = await pool.query(
      `SELECT s.id, s.student_id, st.first_name_lao, st.last_name_lao, s.course_code, c.name_lao AS course_name_lao, c.name_eng AS course_name_eng, c.credit,
              s.academic_year, s.semester, s.midterm_score, s.midterm_grade, s.exam_score, s.exam_grade, s.final_score, s.final_grade
       FROM scores s LEFT JOIN students st ON s.student_id = st.student_id LEFT JOIN courses c ON s.course_code = c.course_code
       WHERE s.student_id = $1 ORDER BY s.academic_year DESC, s.semester ASC`,
      [student_id]
    );
    return ok(res, { scores: r.rows });
  })
);

app.get(
  "/api/scores/transcript/:student_id",
  wrap(async (req, res) => {
    const { student_id } = req.params;
    const sInfo = await pool.query("SELECT * FROM students WHERE student_id = $1", [student_id]);
    if (sInfo.rows.length === 0) return fail(res, 404, "Student not found");

    const scores = await pool.query(
      `SELECT s.*, c.name_lao AS course_name_lao, c.name_eng AS course_name_eng, c.credit, c.theory_hours, c.lab_hours, c.practice_hours
       FROM scores s LEFT JOIN courses c ON s.course_code = c.course_code
       WHERE s.student_id = $1 ORDER BY s.academic_year ASC, s.semester ASC`,
      [student_id]
    );

    const gradePoints = { A: 4.0, "B+": 3.5, B: 3.0, "C+": 2.5, C: 2.0, "D+": 1.5, D: 1.0, F: 0.0 };
    let totalGradePoints = 0;
    let totalCreditHours = 0;
    const totalCredits = scores.rows.reduce((sum, sc) => sum + (sc.credit || 0), 0);

    scores.rows.forEach((sc) => {
      if (sc.final_grade && sc.credit && gradePoints[sc.final_grade] !== undefined) {
        totalGradePoints += gradePoints[sc.final_grade] * sc.credit;
        totalCreditHours += sc.credit;
      }
    });

    const gpa = totalCreditHours > 0 ? Number((totalGradePoints / totalCreditHours).toFixed(2)) : 0;

    return ok(res, {
      transcript: {
        student: sInfo.rows[0],
        scores: scores.rows,
        summary: {
          total_credits: totalCredits,
          completed_credits: totalCreditHours,
          gpa,
          total_courses: scores.rows.length,
        },
      },
    });
  })
);

// =============================================================================
// REPORTS (Certificate Summary JSON & Excel)
// =============================================================================
app.get(
  "/api/v1/reports/summary-json/:year/:semester",
  verifyToken,
  wrap(async (req, res) => {
    const { year, semester } = req.params;

    const coursesResult = await pool.query(
      `SELECT course_code, name_lao AS course_name_lao, name_eng AS course_name_eng
       FROM courses WHERE "year"=$1 AND semester=$2 ORDER BY course_code`,
      [year, semester]
    );
    const courses = coursesResult.rows;

    const studentsResult = await pool.query(
      `SELECT s.student_id, s.first_name_lao, s.last_name_lao, sc.course_code, sc.final_grade
       FROM students s LEFT JOIN scores sc ON s.student_id = sc.student_id
       WHERE sc.academic_year = $1 AND sc.semester = $2 ORDER BY s.student_id`,
      [year, semester]
    );

    const studentsMap = {};
    studentsResult.rows.forEach((row) => {
      if (!studentsMap[row.student_id]) {
        studentsMap[row.student_id] = {
          student_id: row.student_id,
          first_name_lao: row.first_name_lao,
          last_name_lao: row.last_name_lao,
          scores: {},
        };
      }
      studentsMap[row.student_id].scores[row.course_code] = row.final_grade;
    });

    const students = Object.values(studentsMap);
    return ok(res, { courses, students });
  })
);

// NEW: Excel download endpoint used by frontend
app.get(
  "/api/v1/reports/summary-excel/:year/:semester",
  verifyToken,
  wrap(async (req, res) => {
    const { year, semester } = req.params;

    // Reuse summary JSON data
    const coursesResult = await pool.query(
      `SELECT course_code, name_lao AS course_name_lao, name_eng AS course_name_eng
       FROM courses WHERE "year"=$1 AND semester=$2 ORDER BY course_code`,
      [year, semester]
    );
    const courses = coursesResult.rows;

    const studentsResult = await pool.query(
      `SELECT s.student_id, s.first_name_lao, s.last_name_lao, sc.course_code, sc.final_grade
       FROM students s LEFT JOIN scores sc ON s.student_id = sc.student_id
       WHERE sc.academic_year = $1 AND sc.semester = $2 ORDER BY s.student_id`,
      [year, semester]
    );

    const studentsMap = {};
    studentsResult.rows.forEach((row) => {
      if (!studentsMap[row.student_id]) {
        studentsMap[row.student_id] = {
          student_id: row.student_id,
          first_name_lao: row.first_name_lao,
          last_name_lao: row.last_name_lao,
          scores: {},
        };
      }
      studentsMap[row.student_id].scores[row.course_code] = row.final_grade;
    });
    const students = Object.values(studentsMap);

    // Build AoA for Excel
    const header = ["Student ID", "Name", ...courses.map((c) => `${c.course_name_lao} (${c.course_code})`)];
    const rows = students.map((s) => [
      s.student_id,
      `${s.first_name_lao || ""} ${s.last_name_lao || ""}`.trim(),
      ...courses.map((c) => s.scores[c.course_code] || "-"),
    ]);

    const aoa = [header, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, `Y${year}_S${semester}`);

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `summary_year${year}_sem${semester}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    return res.send(buf);
  })
);


//==============================================================================
// PROXY for external services (Transcript PDF, Summary PDF)
//==============================================================================
async function forwardResponseStream(upstream, res, fallbackName) {
  const ct = upstream.headers.get('content-type') || 'application/octet-stream';
  const cd = upstream.headers.get('content-disposition');

  res.setHeader('Content-Type', ct);
  if (cd) {
    res.setHeader('Content-Disposition', cd);
  } else if (fallbackName) {
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fallbackName)}`);
  }

  // กรณี Node >=18: upstream.body คือ WHATWG ReadableStream
  if (upstream.body && typeof upstream.body.getReader === 'function' && Readable.fromWeb) {
    return Readable.fromWeb(upstream.body).pipe(res);
  }

  // กรณี lib อื่นที่คืน Node stream
  if (upstream.body && typeof upstream.body.pipe === 'function') {
    return upstream.body.pipe(res);
  }

  // fallback: อ่านเป็น buffer แล้วส่ง
  const buf = Buffer.from(await upstream.arrayBuffer());
  return res.end(buf);
}


app.get('/api/v1/transcripts/pdf/:student_id', verifyToken, async (req, res) => {
  try {
    const { student_id } = req.params;
    const UPSTREAM = process.env.TRANSCRIPT_SERVICE_BASE || 'http://172.28.27.228:8000';
    const url = `${UPSTREAM}/api/v1/transcripts/pdf/${encodeURIComponent(student_id)}`;

    console.log('[PDF Proxy] ->', url);

    const upstream = await fetch(url, { method: 'GET', headers: { Accept: 'application/pdf' } });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(upstream.status).type('text/plain').send(text || `Upstream error (${upstream.status})`);
    }

    const ct = upstream.headers.get('content-type') || '';
    if (!ct.toLowerCase().includes('pdf')) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).type('text/plain').send('Upstream returned non-PDF content:\n' + text.slice(0, 500));
    }

    await forwardResponseStream(upstream, res, `transcript_${student_id}.pdf`);
  } catch (err) {
    console.error('[PDF Proxy] Fatal:', err);
    if (!res.headersSent) res.status(500).type('text/plain').send('Failed to fetch transcript PDF: ' + (err?.message || err));
  }
});


//===================
app.get('/api/v1/reports/summary-pdf/:year/:semester', verifyToken, async (req, res) => {
  try {
    const { year, semester } = req.params;
    const BASE = process.env.REPORT_SERVICE_BASE || 'http://172.28.27.228:8000';
    const url = `${BASE}/api/v1/reports/summary-pdf/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`;

    console.log('[Summary PDF Proxy] ->', url);

    const upstream = await fetch(url, { method: 'GET', headers: { Accept: 'application/pdf' } });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(upstream.status).type('text/plain').send(text || `Upstream error (${upstream.status})`);
    }

    const ct = upstream.headers.get('content-type') || '';
    if (!ct.toLowerCase().includes('pdf')) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).type('text/plain').send('Upstream returned non-PDF content:\n' + text.slice(0, 500));
    }

    await forwardResponseStream(upstream, res, `PDF_Summary_Y${year}_S${semester}.pdf`);
  } catch (err) {
    console.error('[Summary PDF Proxy] Fatal:', err);
    if (!res.headersSent) res.status(500).type('text/plain').send('Failed to fetch summary PDF: ' + (err?.message || err));
  }
});




// ================== PROXY: Summary PDF ==================
app.get('/api/v1/reports/summary-pdf/:year/:semester', verifyToken, async (req, res) => {
  try {
    const { year, semester } = req.params;

    // ตั้ง base upstream ตามที่ใช้อยู่ (เปลี่ยน .env ได้ภายหลัง)
    const BASE = process.env.REPORT_SERVICE_BASE || 'http://172.28.27.228:8000';
    const url = `${BASE}/api/v1/reports/summary-pdf/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`;

    console.log('[Summary PDF Proxy] ->', url);

    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/pdf' } // ถ้า upstream ต้อง auth เพิ่ม header ตรงนี้
    });

    console.log('[Summary PDF Proxy] <-', upstream.status, upstream.statusText, upstream.headers.get('content-type'));

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(upstream.status).type('text/plain').send(text || `Upstream error (${upstream.status})`);
    }

    const ct = upstream.headers.get('content-type') || '';
    if (!ct.toLowerCase().includes('pdf')) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).type('text/plain').send('Upstream returned non-PDF content:\n' + text.slice(0, 500));
    }

    // ตั้ง headers ชื่อไฟล์
    const fallbackName = `PDF_Summary_Y${year}_S${semester}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');

    const cd = upstream.headers.get('content-disposition');
    if (cd) {
      res.setHeader('Content-Disposition', cd);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fallbackName)}`);
    }

    // stream ไฟล์ออก
    upstream.body.pipe(res);
    upstream.body.on('error', (e) => {
      console.error('[Summary PDF Proxy] stream error:', e);
      if (!res.headersSent) res.status(500).end('Stream error');
    });
  } catch (err) {
    console.error('[Summary PDF Proxy] Fatal:', err);
    if (!res.headersSent) res.status(500).type('text/plain').send('Failed to fetch summary PDF: ' + (err?.message || err));
  }
});






// ================== PROXY: Transcript PDF (with DEBUG) ==================
// ================== PROXY: Transcript PDF (ใช้ global.fetch) ==================
app.get('/api/v1/transcripts/pdf/:student_id', verifyToken, async (req, res) => {
  try {
    const { student_id } = req.params;

    const UPSTREAM = process.env.TRANSCRIPT_SERVICE_BASE || 'http://172.28.27.228:8000';
    const url = `${UPSTREAM}/api/v1/transcripts/pdf/${encodeURIComponent(student_id)}`;

    console.log('[PDF Proxy] ->', url);

    const upstream = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/pdf' }, // ใส่ auth เพิ่มตรงนี้ถ้า upstream ต้องการ
    });

    console.log('[PDF Proxy] <- status:', upstream.status, upstream.statusText);
    console.log('[PDF Proxy] <- content-type:', upstream.headers.get('content-type'));

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(upstream.status).type('text/plain')
               .send(text || `Upstream error (${upstream.status})`);
    }

    const ct = upstream.headers.get('content-type') || '';
    if (!ct.toLowerCase().includes('pdf')) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).type('text/plain')
               .send('Upstream returned non-PDF content:\n' + text.slice(0, 500));
    }

    const fallbackName = `transcript_${student_id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');

    const cd = upstream.headers.get('content-disposition');
    if (cd) {
      res.setHeader('Content-Disposition', cd);
    } else {
      res.setHeader('Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(fallbackName)}`);
    }

    upstream.body.pipe(res);
    upstream.body.on('error', (e) => {
      console.error('[PDF Proxy] Stream error:', e);
      if (!res.headersSent) res.status(500).end('Stream error');
    });
  } catch (err) {
    console.error('[PDF Proxy] Fatal:', err);
    if (!res.headersSent) res.status(500).type('text/plain')
      .send('Failed to fetch transcript PDF: ' + (err?.message || err));
  }
});


// ================== PROXY: Transcript (Excel) ==================
app.get('/api/v1/transcripts/excel/:student_id', verifyToken, async (req, res) => {
  try {
    const { student_id } = req.params;
    const base = process.env.TRANSCRIPT_SERVICE_BASE || 'http://127.0.0.1:8000';
    const url = `${base}/api/v1/transcripts/excel/${encodeURIComponent(student_id)}`;

    console.log('[Transcript Excel Proxy] ->', url);

    const upstream = await fetch(url, { method: 'GET' });
    console.log('[Transcript Excel Proxy] <-', upstream.status, upstream.statusText, upstream.headers.get('content-type'));

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(upstream.status).type('text/plain').send(text || `Upstream error (${upstream.status})`);
    }

    // ตรวจ type ให้แน่ใจว่าเป็น Excel
    const ct = upstream.headers.get('content-type') || '';
    if (!ct.includes('application/vnd.openxmlformats-officedocument')) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).type('text/plain').send('Upstream returned non-Excel content:\n' + text.slice(0, 500));
    }

    // ส่งชื่อไฟล์
    const cd = upstream.headers.get('content-disposition');
    if (cd) {
      res.setHeader('Content-Disposition', cd);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename=transcript_${student_id}.xlsx`);
    }
    res.setHeader('Content-Type', ct);

    upstream.body.pipe(res);
    upstream.body.on('error', (e) => {
      console.error('[Transcript Excel Proxy] stream error:', e);
      if (!res.headersSent) res.status(500).end('Stream error');
    });
  } catch (err) {
    console.error('[Transcript Excel Proxy] Fatal:', err);
    if (!res.headersSent) res.status(500).type('text/plain')
      .send('Failed to fetch transcript Excel: ' + (err?.message || err));
  }
});





// =============================================================================
// ERROR HANDLER (last)
// =============================================================================
app.use((err, req, res, next) => {
  console.error("💥 Uncaught error:", err);
  return fail(res, 500, err?.message || "Server error");
});

// =============================================================================
// START SERVER
// =============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n====================================\n🚀 Education Management System API\n📍 Server URL: http://localhost:${PORT}\n📍 Health Check: http://localhost:${PORT}/health\n📍 API Base: http://localhost:${PORT}/api\n\n📂 Available Endpoints:\n├─ Auth\n│  POST /api/auth/login\n├─ Users\n│  GET    /api/users\n│  POST   /api/users\n│  GET    /api/users/:id\n│  PUT    /api/users/:id\n│  DELETE /api/users/:id\n│  GET    /api/users/search/:term\n│  GET    /api/users/stats\n├─ Students\n│  GET    /api/students\n│  POST   /api/students\n├─ Courses\n│  GET    /api/courses\n│  POST   /api/courses\n│  GET    /api/courses/:id\n│  PUT    /api/courses/:id\n│  DELETE /api/courses/:id\n│  GET    /api/courses/search/:term\n├─ Files\n│  GET    /api/files\n│  POST   /api/files/preview\n│  POST   /api/files/upload\n│  GET    /api/files/:id/content\n│  DELETE /api/files/:id\n├─ Scores\n│  GET    /api/scores\n│  POST   /api/scores\n│  PUT    /api/scores/:id\n│  DELETE /api/scores/:id\n│  GET    /api/scores/student/:student_id\n│  GET    /api/scores/transcript/:student_id\n├─ Reports\n│  GET    /api/v1/reports/summary-json/:year/:semester\n│  GET    /api/v1/reports/summary-excel/:year/:semester\n\n🔑 Test Accounts:\n• admin@ict.la / password123\n• staff@ict.la / password123\n• student@ict.la / password123\n\n📁 File Support: PDF, Excel (.xlsx/.xls), CSV\n🗄️  Database: PostgreSQL\n🔒 Authentication: JWT Tokens\n====================================\n`);
});
