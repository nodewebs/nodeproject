// // backend/server.js
// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { buffer } = require('stream/consumers');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
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

// // ==================== ROUTES ====================

// // Test Route
// app.get('/', (req, res) => {
//   res.json({ message: '🚀 Backend API is running!' });
// });

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   // console.log('Login attempt:', email);

//   try {
//     // Get user from database
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     console.log(result.rows);
//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'User not found' 
//       });
//     }

//     const user = result.rows[0];

//     // Check password (password123 for all test users)
//     const validPassword = await bcrypt.compare(password, user.password);
//     const password123Hash = await bcrypt.hash('password123', 10);
//     console.log('Hashed password123:', password123Hash);
//     console.log('Password valid:', validPassword);
//     if (!validPassword) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid password' 
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Send response
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

// // Get all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, name, email, role, status FROM users'
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

// // Get all students
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

// // Add new student
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

// // Get all files
// app.get('/api/files', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT f.*, u.name as user_name FROM files f LEFT JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC'
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
// ///////////////////////////////////update code 20250828

// // เพิ่มให้ express serve static files
// app.use('/uploads', express.static('uploads'));
// // สร้างโฟลเดอร์ uploads
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('📁 Created uploads folder');
// }

// // ตั้งค่า multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${uniqueSuffix}-${name}${ext}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /pdf|xlsx|xls|csv/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
//     if (extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, Excel, and CSV files allowed'));
//     }
//   }
// });

// // Middleware สำหรับ verify token (ถ้ายังไม่มี)
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];

//   console.log('Verifying token:', token);
  

//   if (!token) {
//     // ถ้าไม่มี token ก็ให้ผ่านไปก่อน (สำหรับทดสอบ)
//     req.user = { id: 1 }; // mock user
//     // const decoded = jwt.verify(token.process.env.JWT_SECRET);
//     // console.log('Decoded token:', decoded);
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

// // Upload file endpoint
// app.post('/api/files/upload', verifyToken, upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'No file uploaded' 
//       });
//     }
//     console.log(req.file);
//     console.log('📤 File uploaded:', req.file.originalname);
//     // console.log('File info:', req.body.files);
//     // console.log('Uploaded by user ID:', Buffer.from(req.file.originalname ,'latin1').toString('utf-8'));

//     const originalName = Buffer.from(req.file.originalname ,'latin1').toString('utf-8');
    
//     // บันทึกข้อมูลไฟล์ลง database
//     const fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
//     const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();
    
//     const result = await pool.query(
//       'INSERT INTO files (name, size, type, upload_date, user_id, status) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *',
//       [
//         originalName,
//         fileSize,
//         fileType,
//         req.user.id || 1,
//         'completed'
//       ]
//     );

//     res.json({
//       success: true,
//       message: 'File uploaded successfully',
//       file: {
//         ...result.rows[0],
//         path: `/uploads/${req.file.filename}`,
//         filename: req.file.filename,
//         originalName: req.file.originalname
//       }
//     });
    
//     console.log('✅ File saved to database');
    
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Upload failed: ' + error.message
//     });
//   }
// });

// // Delete file endpoint
// app.delete('/api/files/:id', verifyToken, async (req, res) => {
//   try {
//     // ดึงข้อมูลไฟล์จาก database
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

//     // ลบจาก database
//     await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);
    
//     res.json({
//       success: true,
//       message: 'File deleted successfully'
//     });
    
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Delete failed' 
//     });
//   }
// });

// ///////////////////////////////////
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`
//   ====================================
//   🚀 Server is running!
//   📍 URL: http://localhost:${PORT}
//   📍 Test API: http://localhost:${PORT}/api/users
  
//   Test Accounts:
//   - admin@ict.la / password123
//   - staff@ict.la / password123
//   - student@ict.la / password123
//   ====================================
//   `);
// });





// // backend/server.js
// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const { buffer } = require('stream/consumers');
// const csv = require('csv-parser'); // เพิ่มสำหรับอ่าน CSV
// const XLSX = require('xlsx'); // เพิ่มสำหรับอ่าน Excel
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
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

// // ==================== ROUTES ====================

// // Test Route
// app.get('/', (req, res) => {
//   res.json({ message: '🚀 Backend API is running!' });
// });

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   // console.log('Login attempt:', email);

//   try {
//     // Get user from database
//     const result = await pool.query(
//       'SELECT * FROM users WHERE email = $1',
//       [email]
//     );

//     console.log(result.rows);
//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'User not found' 
//       });
//     }

//     const user = result.rows[0];

//     // Check password (password123 for all test users)
//     const validPassword = await bcrypt.compare(password, user.password);
//     const password123Hash = await bcrypt.hash('password123', 10);
//     console.log('Hashed password123:', password123Hash);
//     console.log('Password valid:', validPassword);
//     if (!validPassword) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Invalid password' 
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Send response
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

// // Get all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, name, email, role, status FROM users'
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

// // Get all students
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

// // Add new student
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

// // Get all files
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

// ///////////////////////////////////update code 20250828

// // เพิ่มให้ express serve static files
// app.use('/uploads', express.static('uploads'));

// // สร้างโฟลเดอร์ uploads และ temp
// const uploadsDir = path.join(__dirname, 'uploads');
// const tempDir = path.join(__dirname, 'temp');

// [uploadsDir, tempDir].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log(`📁 Created ${path.basename(dir)} folder`);
//   }
// });

// // ตั้งค่า multer สำหรับ upload ถาวร
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${uniqueSuffix}-${name}${ext}`);
//   }
// });

// // ตั้งค่า multer สำหรับ preview (temp)
// const tempStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'temp/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `temp_${uniqueSuffix}_${file.originalname}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /pdf|xlsx|xls|csv/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
//     if (extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, Excel, and CSV files allowed'));
//     }
//   }
// });

// const tempUpload = multer({
//   storage: tempStorage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /pdf|xlsx|xls|csv/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
//     if (extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, Excel, and CSV files allowed'));
//     }
//   }
// });

// // Middleware สำหรับ verify token
// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];

//   console.log('Verifying token:', token);
  
//   if (!token) {
//     // ถ้าไม่มี token ก็ให้ผ่านไปก่อน (สำหรับทดสอบ)
//     req.user = { id: 1 }; // mock user
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

// // ==================== FILE PREVIEW FUNCTIONS ====================

// // ฟังก์ชันสำหรับอ่าน CSV
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
//         if (rowCount <= 5) { // เก็บแค่ 5 แถวแรกสำหรับ preview
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

// // ฟังก์ชันสำหรับอ่าน Excel
// async function previewExcel(filePath) {
//   try {
//     const workbook = XLSX.readFile(filePath);
//     const sheetNames = workbook.SheetNames;
//     const firstSheet = workbook.Sheets[sheetNames[0]];
    
//     // Convert to JSON
//     const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
//     if (jsonData.length === 0) {
//       throw new Error('Excel file is empty');
//     }

//     const headers = jsonData[0] || [];
//     const preview = jsonData.slice(1, 16); // เก็บ 5 แถวแรก
//     const totalRows = jsonData.length - 1; // ลบ header row

//     // ดึงชื่อวิชาจากชื่อไฟล์ถ้ามี
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

// // ฟังก์ชันสำหรับอ่าน PDF (mock สำหรับตอนนี้)
// async function previewPDF(filePath) {
//   try {
//     const stats = fs.statSync(filePath);
    
//     return {
//       type: 'PDF',
//       pages: 'N/A', // จะต้องใช้ PDF library เช่น pdf-parse
//       title: 'PDF Document',
//       info: `ເອກະສານ PDF ຂະໜາດ ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
//       size: stats.size
//     };

//   } catch (error) {
//     throw new Error('PDF parsing failed: ' + error.message);
//   }
// }

// // ==================== NEW API ENDPOINTS ====================

// // Preview file endpoint - อ่านข้อมูลไฟล์แบบ temporary
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
//       // ลบไฟล์ temp หลังจากอ่านเสร็จ (ทั้งสำเร็จและไม่สำเร็จ)
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

// // Upload file endpoint (ปรับปรุงเล็กน้อย)
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
    
//     // ตรวจสอบประเภทไฟล์ที่อนุญาต
//     const allowedTypes = ['.pdf', '.xlsx', '.xls', '.csv'];
//     const fileExtension = path.extname(originalName).toLowerCase();
    
//     if (!allowedTypes.includes(fileExtension)) {
//       // ลบไฟล์ที่อัพโหลดมาแล้ว
//       fs.unlinkSync(req.file.path);
//       return res.status(400).json({ 
//         success: false,
//         error: 'File type not allowed. Only PDF, Excel, and CSV files are supported.' 
//       });
//     }
    
//     // บันทึกข้อมูลไฟล์ลง database
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
    
//     // ลบไฟล์ในกรณี error
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
    
//     res.status(500).json({ 
//       success: false,
//       error: 'Upload failed: ' + error.message
//     });
//   }
// });

// // Get file content endpoint (สำหรับดูเนื้อหาไฟล์ที่อัพโหลดแล้ว)
// app.get('/api/files/:id/content', verifyToken, async (req, res) => {
//   try {
//     // ดึงข้อมูลไฟล์จาก database
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

//     // อ่านเนื้อหาไฟล์ตามประเภท
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

// // Delete file endpoint (ปรับปรุงให้ลบไฟล์จริงด้วย)
// app.delete('/api/files/:id', verifyToken, async (req, res) => {
//   try {
//     // ดึงข้อมูลไฟล์จาก database
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
    
//     // ลบไฟล์จาก filesystem (ถ้ามี file_path)
//     if (file.file_path && fs.existsSync(file.file_path)) {
//       fs.unlinkSync(file.file_path);
//       console.log('🗑️ File deleted from disk:', file.file_path);
//     }
    
//     // ลบจาก database
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

// // Cleanup temp files endpoint (ทำความสะอาดไฟล์ temp ที่ค้างอยู่)
// app.post('/api/files/cleanup-temp', verifyToken, (req, res) => {
//   try {
//     const tempDir = path.join(__dirname, 'temp');
    
//     if (fs.existsSync(tempDir)) {
//       const files = fs.readdirSync(tempDir);
//       let deletedCount = 0;
      
//       files.forEach(file => {
//         const filePath = path.join(tempDir, file);
//         const stats = fs.statSync(filePath);
//         const now = new Date();
//         const fileAge = (now - stats.mtime) / (1000 * 60); // อายุไฟล์ในหน่วยนาที
        
//         // ลบไฟล์ที่เก่ากว่า 10 นาที
//         if (fileAge > 10) {
//           fs.unlinkSync(filePath);
//           deletedCount++;
//         }
//       });
      
//       res.json({
//         success: true,
//         message: `Cleaned up ${deletedCount} temp files`
//       });
//     } else {
//       res.json({
//         success: true,
//         message: 'No temp directory found'
//       });
//     }
    
//   } catch (error) {
//     console.error('Cleanup error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Cleanup failed: ' + error.message
//     });
//   }
// });

// //////////////////////   User  //////////////////////

// // User Management API Endpoints - เพิ่มลงใน server.js หลังจาก existing routes

// // Create new user
// app.post('/api/users', verifyToken, async (req, res) => {
//   try {
//     const { name, email, phone, role, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         error: 'Name, email, and password are required'
//       });
//     }

//     // Check if email already exists
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

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert new user
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

// // Update existing user
// app.put('/api/users/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone, role, password, status } = req.body;

//     // Validation
//     if (!name || !email) {
//       return res.status(400).json({
//         success: false,
//         error: 'Name and email are required'
//       });
//     }

//     // Check if user exists
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

//     // Check if email is already used by another user
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

//     // Update with or without password
//     if (password && password.trim() !== '') {
//       // Hash new password
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
//       // Update without changing password
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

// // Delete user
// app.delete('/api/users/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if user exists
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

//     // Prevent deleting the currently logged-in user
//     if (req.user && req.user.id === parseInt(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Cannot delete your own account'
//       });
//     }

//     // TODO: Check if user has related data (files, grades, etc.)
//     // const relatedData = await pool.query('SELECT * FROM files WHERE user_id = $1', [id]);
//     // if (relatedData.rows.length > 0) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     error: 'Cannot delete user with existing data. Please remove related records first.'
//     //   });
//     // }

//     // Delete user
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

// // Get single user by ID
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

// // Search users
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

// // Get users by role
// app.get('/api/users/role/:role', verifyToken, async (req, res) => {
//   try {
//     const { role } = req.params;
    
//     const result = await pool.query(
//       `SELECT id, name, email, phone, role, status, created_at, updated_at,
//               last_login, login_count
//        FROM users 
//        WHERE role = $1
//        ORDER BY name ASC`,
//       [role]
//     );
    
//     res.json({
//       success: true,
//       users: result.rows
//     });
    
//   } catch (error) {
//     console.error('Error getting users by role:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while getting users by role' 
//     });
//   }
// });

// // Update user status (activate/deactivate)
// app.patch('/api/users/:id/status', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     if (!['active', 'inactive'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Status must be either "active" or "inactive"'
//       });
//     }
    
//     const result = await pool.query(
//       `UPDATE users 
//        SET status = $1, updated_at = NOW()
//        WHERE id = $2 
//        RETURNING id, name, email, status`,
//       [status, id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
//       user: result.rows[0]
//     });
    
//     console.log(`✅ User ${status}:`, result.rows[0].email);
    
//   } catch (error) {
//     console.error('Error updating user status:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while updating user status' 
//     });
//   }
// });

// // Reset user password (admin only)
// app.patch('/api/users/:id/reset-password', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { newPassword } = req.body;
    
//     // Check if current user has admin role
//     if (!req.user || req.user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         error: 'Only administrators can reset passwords'
//       });
//     }
    
//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         error: 'Password must be at least 6 characters long'
//       });
//     }
    
//     // Hash new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
//     const result = await pool.query(
//       `UPDATE users 
//        SET password = $1, updated_at = NOW()
//        WHERE id = $2 
//        RETURNING id, name, email`,
//       [hashedPassword, id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Password reset successfully',
//       user: result.rows[0]
//     });
    
//     console.log('✅ Password reset for user:', result.rows[0].email);
    
//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error while resetting password' 
//     });
//   }
// });

// // Get user statistics
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

// // Update the existing GET /api/users to include additional fields
// // Replace the existing route with this enhanced version:
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


// ////////////////////  courses  /////////////////////////

// // Courses Management API Endpoints - เพิ่มลงใน server.js

// // Get all courses
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

// // Get single course by ID
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

// // Create new course
// app.post('/api/courses', verifyToken, async (req, res) => {
//   try {
//     const { 
//       course_code, name_lao, name_eng, credit, theory_hours, 
//       lab_hours, practice_hours, semester, year, remark, ext1, ext2 
//     } = req.body;

//     // Validation
//     if (!course_code || !name_lao || !name_eng || !credit || 
//         theory_hours === undefined || !semester || !year) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: course_code, name_lao, name_eng, credit, theory_hours, semester, year'
//       });
//     }

//     // Check if course code already exists
//     const existingCourse = await pool.query(
//       'SELECT course_id FROM courses WHERE course_code = $1',
//       [course_code]
//     );

//     if (existingCourse.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ'
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

// // Update course
// app.put('/api/courses/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       course_code, name_lao, name_eng, credit, theory_hours, 
//       lab_hours, practice_hours, semester, year, remark, ext1, ext2 
//     } = req.body;

//     // Validation
//     if (!course_code || !name_lao || !name_eng || !credit || 
//         theory_hours === undefined || !semester || !year) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields'
//       });
//     }

//     // Check if course exists
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

//     // Check if course code already exists (excluding current course)
//     const duplicateCode = await pool.query(
//       'SELECT course_id FROM courses WHERE course_code = $1 AND course_id != $2',
//       [course_code, id]
//     );

//     if (duplicateCode.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ'
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

// // Delete course
// app.delete('/api/courses/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if course exists
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

//     // TODO: Check if course is being used in other tables (grades, enrollments, etc.)
//     // const usageCheck = await pool.query(
//     //   'SELECT COUNT(*) as count FROM grades WHERE course_id = $1', 
//     //   [id]
//     // );
//     // if (parseInt(usageCheck.rows[0].count) > 0) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     error: 'ບໍ່ສາມາດລຶບວິຊາທີ່ມີການບັນທຶກຄະແນນແລ້ວ'
//     //   });
//     // }

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

// // Search courses
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

// // Get courses by semester and year
// app.get('/api/courses/semester/:semester/year/:year', async (req, res) => {
//   try {
//     const { semester, year } = req.params;
//     const result = await pool.query(`
//       SELECT course_id, course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark, ext1, ext2
//       FROM courses 
//       WHERE semester = $1 AND "year" = $2
//       ORDER BY course_code ASC
//     `, [semester, year]);
    
//     res.json({
//       success: true,
//       courses: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting courses by semester/year:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // Get courses by year only
// app.get('/api/courses/year/:year', async (req, res) => {
//   try {
//     const { year } = req.params;
//     const result = await pool.query(`
//       SELECT course_id, course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark, ext1, ext2
//       FROM courses 
//       WHERE "year" = $1
//       ORDER BY semester ASC, course_code ASC
//     `, [year]);
    
//     res.json({
//       success: true,
//       courses: result.rows
//     });
//   } catch (error) {
//     console.error('Error getting courses by year:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // Get course statistics
// app.get('/api/courses/stats', async (req, res) => {
//   try {
//     const totalCourses = await pool.query('SELECT COUNT(*) as count FROM courses');
    
//     const creditStats = await pool.query(`
//       SELECT 
//         SUM(credit) as total_credits,
//         AVG(credit) as avg_credits,
//         MAX(credit) as max_credits,
//         MIN(credit) as min_credits
//       FROM courses
//     `);
    
//     const semesterStats = await pool.query(`
//       SELECT 
//         semester,
//         COUNT(*) as course_count,
//         SUM(credit) as total_credits,
//         AVG(credit) as avg_credits
//       FROM courses
//       GROUP BY semester
//       ORDER BY semester
//     `);
    
//     const yearStats = await pool.query(`
//       SELECT 
//         "year",
//         COUNT(*) as course_count,
//         SUM(credit) as total_credits,
//         AVG(credit) as avg_credits
//       FROM courses
//       GROUP BY "year"
//       ORDER BY "year" DESC
//     `);

//     const hoursStats = await pool.query(`
//       SELECT 
//         SUM(theory_hours + lab_hours + practice_hours) as total_hours,
//         AVG(theory_hours + lab_hours + practice_hours) as avg_hours,
//         SUM(theory_hours) as total_theory_hours,
//         SUM(lab_hours) as total_lab_hours,
//         SUM(practice_hours) as total_practice_hours
//       FROM courses
//     `);
    
//     res.json({
//       success: true,
//       stats: {
//         total_courses: parseInt(totalCourses.rows[0].count),
//         credit_stats: creditStats.rows[0],
//         hours_stats: hoursStats.rows[0],
//         semester_breakdown: semesterStats.rows,
//         year_breakdown: yearStats.rows
//       }
//     });
    
//   } catch (error) {
//     console.error('Error getting course stats:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // Get available years (for filter dropdown)
// app.get('/api/courses/years', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT DISTINCT "year" 
//       FROM courses 
//       ORDER BY "year" DESC
//     `);
    
//     res.json({
//       success: true,
//       years: result.rows.map(row => row.year)
//     });
//   } catch (error) {
//     console.error('Error getting available years:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error' 
//     });
//   }
// });

// // Bulk import courses (for future use)
// app.post('/api/courses/bulk-import', verifyToken, async (req, res) => {
//   try {
//     const { courses } = req.body;
    
//     if (!Array.isArray(courses) || courses.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'No courses provided for import'
//       });
//     }

//     const client = await pool.connect();
//     let successCount = 0;
//     let errorCount = 0;
//     const errors = [];

//     try {
//       await client.query('BEGIN');

//       for (let i = 0; i < courses.length; i++) {
//         const course = courses[i];
//         try {
//           // Validate required fields
//           if (!course.course_code || !course.name_lao || !course.name_eng) {
//             throw new Error(`Row ${i + 1}: Missing required fields`);
//           }

//           // Check for duplicate course code
//           const existing = await client.query(
//             'SELECT course_id FROM courses WHERE course_code = $1',
//             [course.course_code]
//           );

//           if (existing.rows.length > 0) {
//             throw new Error(`Row ${i + 1}: Course code ${course.course_code} already exists`);
//           }

//           await client.query(`
//             INSERT INTO courses 
//             (course_code, name_lao, name_eng, credit, theory_hours, 
//              lab_hours, practice_hours, semester, "year", remark, ext1, ext2)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
//           `, [
//             course.course_code,
//             course.name_lao,
//             course.name_eng,
//             parseInt(course.credit) || 0,
//             parseInt(course.theory_hours) || 0,
//             parseInt(course.lab_hours) || 0,
//             parseInt(course.practice_hours) || 0,
//             parseInt(course.semester) || 1,
//             parseInt(course.year) || new Date().getFullYear(),
//             course.remark || null,
//             course.ext1 || null,
//             course.ext2 || null
//           ]);

//           successCount++;
//         } catch (error) {
//           errorCount++;
//           errors.push(`Row ${i + 1}: ${error.message}`);
//         }
//       }

//       await client.query('COMMIT');
      
//       res.json({
//         success: true,
//         message: `Import completed. ${successCount} courses imported, ${errorCount} errors.`,
//         stats: {
//           total: courses.length,
//           success: successCount,
//           errors: errorCount
//         },
//         errors: errors.length > 0 ? errors : undefined
//       });

//       console.log(`✅ Bulk import completed: ${successCount} success, ${errorCount} errors`);

//     } catch (error) {
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       client.release();
//     }

//   } catch (error) {
//     console.error('Error in bulk import:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during bulk import' 
//     });
//   }
// });

// // Export courses to CSV format
// app.get('/api/courses/export/csv', verifyToken, async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT course_code, name_lao, name_eng, credit, 
//              theory_hours, lab_hours, practice_hours, semester, 
//              "year", remark
//       FROM courses 
//       ORDER BY "year" DESC, semester ASC, course_code ASC
//     `);

//     // Set CSV headers
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=courses.csv');

//     // CSV header row
//     const headers = [
//       'Course Code', 'Name (Lao)', 'Name (English)', 'Credits',
//       'Theory Hours', 'Lab Hours', 'Practice Hours', 
//       'Semester', 'Year', 'Remark'
//     ];
    
//     let csvContent = headers.join(',') + '\n';

//     // Add data rows
//     result.rows.forEach(course => {
//       const row = [
//         course.course_code || '',
//         `"${(course.name_lao || '').replace(/"/g, '""')}"`,
//         `"${(course.name_eng || '').replace(/"/g, '""')}"`,
//         course.credit || 0,
//         course.theory_hours || 0,
//         course.lab_hours || 0,
//         course.practice_hours || 0,
//         course.semester || '',
//         course.year || '',
//         `"${(course.remark || '').replace(/"/g, '""')}"`
//       ];
//       csvContent += row.join(',') + '\n';
//     });

//     res.send(csvContent);
//     console.log('✅ Courses exported to CSV');

//   } catch (error) {
//     console.error('Error exporting courses:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during export' 
//     });
//   }
// });


// ///////////////////////////////////
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`
//   ====================================
//   🚀 Server is running!
//   📍 URL: http://localhost:${PORT}
//   📍 Test API: http://localhost:${PORT}/api/users
  
//   📂 New Endpoints Added:
//   - POST /api/files/preview (Preview file data)
//   - GET /api/files/:id/content (Get full file content)
//   - POST /api/files/cleanup-temp (Cleanup temp files)
  
//   Test Accounts:
//   - admin@ict.la / password123
//   - staff@ict.la / password123
//   - student@ict.la / password123
//   ====================================
//   `);
// });





// =============================================================================
// BACKEND SERVER - EDUCATION MANAGEMENT SYSTEM
// =============================================================================
// Description: Express.js server for managing users, courses, students, and files
// Features: Authentication, File Upload/Preview, User Management, Course Management
// Author: ICT Department
// Version: 1.0
// =============================================================================

// =============================================================================
// DEPENDENCIES & IMPORTS
// =============================================================================
const express = require('express');
const { Pool } = require('pg');           // PostgreSQL database client
const cors = require('cors');             // Cross-Origin Resource Sharing
const bcrypt = require('bcrypt');         // Password hashing
const jwt = require('jsonwebtoken');      // JSON Web Token authentication
const multer = require('multer');         // File upload handling
const path = require('path');             // File path utilities
const fs = require('fs');                 // File system operations
const { buffer } = require('stream/consumers');
const csv = require('csv-parser');        // CSV file parsing
const XLSX = require('xlsx');             // Excel file parsing
require('dotenv').config();               // Environment variables

// =============================================================================
// EXPRESS APP INITIALIZATION
// =============================================================================
const app = express();

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================
app.use(cors());                          // Enable CORS for frontend communication
app.use(express.json());                  // Parse JSON request bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

// =============================================================================
// DATABASE CONNECTION SETUP
// =============================================================================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.log('Please check your database credentials in .env file');
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// =============================================================================
// FILE UPLOAD CONFIGURATION
// =============================================================================

// Create necessary directories for file storage
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');

[uploadsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created ${path.basename(dir)} folder`);
  }
});

// Multer configuration for permanent file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

// Multer configuration for temporary file previews
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `temp_${uniqueSuffix}_${file.originalname}`);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|xlsx|xls|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, Excel, and CSV files allowed'));
  }
};

// Initialize multer instances
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});

const tempUpload = multer({
  storage: tempStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});

// =============================================================================
// MIDDLEWARE FUNCTIONS
// =============================================================================

/**
 * JWT Token Verification Middleware
 * Validates JWT tokens and sets req.user for authenticated routes
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  console.log('Verifying token:', token);
  
  if (!token) {
    // For testing purposes, allow requests without token with mock user
    req.user = { id: 1 }; // TODO: Remove this in production
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// =============================================================================
// FILE PROCESSING UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse and preview CSV files
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Object>} Preview data with headers and sample rows
 */
async function previewCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = [];
    let rowCount = 0;

    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = headerList.map(h => h.trim());
      })
      .on('data', (data) => {
        rowCount++;
        if (rowCount <= 5) { // Keep only first 5 rows for preview
          results.push(Object.values(data));
        }
      })
      .on('end', () => {
        resolve({
          type: 'CSV',
          headers: headers,
          preview: results,
          totalRows: rowCount,
          columns: headers.length
        });
      })
      .on('error', (error) => {
        reject(new Error('CSV parsing failed: ' + error.message));
      });
  });
}

/**
 * Parse and preview Excel files
 * @param {string} filePath - Path to the Excel file
 * @returns {Promise<Object>} Preview data with headers and sample rows
 */
async function previewExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const firstSheet = workbook.Sheets[sheetNames[0]];
    
    // Convert to JSON format
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }

    const headers = jsonData[0] || [];
    const preview = jsonData.slice(1, 6); // Keep first 5 data rows
    const totalRows = jsonData.length - 1; // Exclude header row

    // Extract subject information from filename if available
    const fileName = path.basename(filePath);
    let subject = null;
    if (fileName.includes('ການສື່ສານຂໍ້ມູນ') || fileName.includes('Communication')) {
      subject = 'ວິຊາ ການສື່ສານຂໍ້ມູນ 2025';
    }

    return {
      type: 'Excel',
      headers: headers.map(h => h ? h.toString().trim() : ''),
      preview: preview,
      totalRows: totalRows,
      columns: headers.length,
      sheets: sheetNames,
      activeSheet: sheetNames[0],
      subject: subject
    };

  } catch (error) {
    throw new Error('Excel parsing failed: ' + error.message);
  }
}

/**
 * Parse and preview PDF files (basic info only)
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} Basic PDF information
 */
async function previewPDF(filePath) {
  try {
    const stats = fs.statSync(filePath);
    
    return {
      type: 'PDF',
      pages: 'N/A', // Would need pdf-parse library for actual page count
      title: 'PDF Document',
      info: `ເອກະສານ PDF ຂະໜາດ ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      size: stats.size
    };

  } catch (error) {
    throw new Error('PDF parsing failed: ' + error.message);
  }
}

// =============================================================================
// BASIC ROUTES
// =============================================================================

/**
 * Root endpoint - API health check
 */
app.get('/', (req, res) => {
  res.json({ message: '🚀 Backend API is running!' });
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

/**
 * User Login
 * POST /api/auth/login
 * Authenticates user credentials and returns JWT token
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const user = result.rows[0];

    // Verify password (currently using bcrypt comparison)
    const validPassword = await bcrypt.compare(password, user.password);
    const password123Hash = await bcrypt.hash('password123', 10);
    console.log('Hashed password123:', password123Hash);
    console.log('Password valid:', validPassword);
    
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response with user data and token
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    console.log('✅ Login successful for:', email);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// =============================================================================
// USER MANAGEMENT ROUTES
// =============================================================================

/**
 * Get All Users
 * GET /api/users
 * Returns list of all users with basic information
 */
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at,
              last_login, login_count
       FROM users 
       ORDER BY created_at DESC`
    );
    
    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Single User by ID
 * GET /api/users/:id
 */
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at,
              last_login, login_count
       FROM users WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting user' 
    });
  }
});

/**
 * Create New User
 * POST /api/users
 */
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    // Check for duplicate email
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, role, password, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
       RETURNING id, name, email, phone, role, status, created_at`,
      [name, email, phone || null, role || 'student', hashedPassword, 'active']
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0]
    });
    
    console.log('✅ User created:', email);
    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while creating user' 
    });
  }
});

/**
 * Update User
 * PUT /api/users/:id
 */
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password, status } = req.body;

    // Input validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check for duplicate email (excluding current user)
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email is already used by another user'
      });
    }

    let updateQuery;
    let updateValues;

    // Handle password update (optional)
    if (password && password.trim() !== '') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      updateQuery = `
        UPDATE users 
        SET name = $1, email = $2, phone = $3, role = $4, password = $5, 
            status = $6, updated_at = NOW()
        WHERE id = $7 
        RETURNING id, name, email, phone, role, status, created_at, updated_at
      `;
      updateValues = [name, email, phone || null, role || 'student', hashedPassword, status || 'active', id];
    } else {
      // Update without changing password
      updateQuery = `
        UPDATE users 
        SET name = $1, email = $2, phone = $3, role = $4, status = $5, updated_at = NOW()
        WHERE id = $6 
        RETURNING id, name, email, phone, role, status, created_at, updated_at
      `;
      updateValues = [name, email, phone || null, role || 'student', status || 'active', id];
    }

    const result = await pool.query(updateQuery, updateValues);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
    
    console.log('✅ User updated:', email);
    
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while updating user' 
    });
  }
});

/**
 * Delete User
 * DELETE /api/users/:id
 */
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userEmail = existingUser.rows[0].email;

    // Prevent self-deletion
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // TODO: Check for related data before deletion
    // Example: files, grades, enrollments, etc.

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
    console.log('✅ User deleted:', userEmail);
    
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting user' 
    });
  }
});

/**
 * Search Users
 * GET /api/users/search/:term
 */
app.get('/api/users/search/:term', verifyToken, async (req, res) => {
  try {
    const { term } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at,
              last_login, login_count
       FROM users 
       WHERE LOWER(name) LIKE LOWER($1) 
          OR LOWER(email) LIKE LOWER($1) 
          OR LOWER(phone) LIKE LOWER($1)
       ORDER BY name ASC`,
      [`%${term}%`]
    );
    
    res.json({
      success: true,
      users: result.rows
    });
    
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while searching users' 
    });
  }
});

/**
 * Get Users by Role
 * GET /api/users/role/:role
 */
app.get('/api/users/role/:role', verifyToken, async (req, res) => {
  try {
    const { role } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at,
              last_login, login_count
       FROM users 
       WHERE role = $1
       ORDER BY name ASC`,
      [role]
    );
    
    res.json({
      success: true,
      users: result.rows
    });
    
  } catch (error) {
    console.error('Error getting users by role:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting users by role' 
    });
  }
});

/**
 * Update User Status
 * PATCH /api/users/:id/status
 */
app.patch('/api/users/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "active" or "inactive"'
      });
    }
    
    const result = await pool.query(
      `UPDATE users 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING id, name, email, status`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      user: result.rows[0]
    });
    
    console.log(`✅ User ${status}:`, result.rows[0].email);
    
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while updating user status' 
    });
  }
});

/**
 * Reset User Password (Admin Only)
 * PATCH /api/users/:id/reset-password
 */
app.patch('/api/users/:id/reset-password', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    // Check admin privileges
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can reset passwords'
      });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING id, name, email`,
      [hashedPassword, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Password reset successfully',
      user: result.rows[0]
    });
    
    console.log('✅ Password reset for user:', result.rows[0].email);
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while resetting password' 
    });
  }
});

/**
 * Get User Statistics
 * GET /api/users/stats
 */
app.get('/api/users/stats', verifyToken, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    
    const roleStats = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
      ORDER BY role
    `);
    
    const statusStats = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM users
      GROUP BY status
      ORDER BY status
    `);
    
    const recentUsers = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    
    const activeUsers = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE last_login >= NOW() - INTERVAL '30 days'
        AND status = 'active'
    `);
    
    res.json({
      success: true,
      stats: {
        total_users: parseInt(totalUsers.rows[0].count),
        role_breakdown: roleStats.rows,
        status_breakdown: statusStats.rows,
        recent_registrations: parseInt(recentUsers.rows[0].count),
        active_last_30_days: parseInt(activeUsers.rows[0].count)
      }
    });
    
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting user statistics' 
    });
  }
});

// =============================================================================
// STUDENT MANAGEMENT ROUTES
// =============================================================================

/**
 * Get All Students
 * GET /api/students
 */
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    
    res.json({
      success: true,
      students: result.rows
    });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Add New Student
 * POST /api/students
 */
app.post('/api/students', async (req, res) => {
  const { student_id, name, name_en, faculty, major, admission_year } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO students (student_id, name, name_en, faculty, major, admission_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [student_id, name, name_en, faculty, major, admission_year]
    );
    
    res.json({
      success: true,
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// =============================================================================
// FILE MANAGEMENT ROUTES
// =============================================================================

/**
 * Get All Files
 * GET /api/files
 */
app.get('/api/files', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT f.*, u.name as user_name FROM files f LEFT JOIN users u ON f.user_id = u.id ORDER BY f.upload_date DESC'
    );
    
    res.json({
      success: true,
      files: result.rows
    });
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Preview File Content (Temporary Upload)
 * POST /api/files/preview
 * Uploads file temporarily and returns preview data without saving to database
 */
app.post('/api/files/preview', verifyToken, tempUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded for preview' 
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
    
    console.log('🔍 Previewing file:', originalName);

    let previewData = {};

    try {
      // Process file based on extension
      switch (fileExtension) {
        case '.csv':
          previewData = await previewCSV(filePath);
          break;
        case '.xlsx':
        case '.xls':
          previewData = await previewExcel(filePath);
          break;
        case '.pdf':
          previewData = await previewPDF(filePath);
          break;
        default:
          throw new Error('Unsupported file type for preview');
      }

      res.json({
        success: true,
        preview: {
          ...previewData,
          originalName: originalName,
          size: req.file.size,
          type: fileExtension.substring(1).toUpperCase()
        }
      });

    } catch (previewError) {
      throw previewError;
    } finally {
      // Always cleanup temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Temp file deleted:', filePath);
      }
    }

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Preview failed: ' + error.message
    });
  }
});

/**
 * Upload File (Permanent Storage)
 * POST /api/files/upload
 * Uploads file permanently and saves record to database
 */
app.post('/api/files/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }
    
    console.log('📤 File uploaded:', req.file.originalname);
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
    
    // Validate file type
    const allowedTypes = ['.pdf', '.xlsx', '.xls', '.csv'];
    const fileExtension = path.extname(originalName).toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      // Delete uploaded file if type not allowed
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        error: 'File type not allowed. Only PDF, Excel, and CSV files are supported.' 
      });
    }
    
    // Calculate file size and type for database storage
    const fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
    const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();
    
    // Save file information to database
    const result = await pool.query(
      'INSERT INTO files (name, size, type, upload_date, user_id, status, file_path) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING *',
      [
        originalName,
        fileSize,
        fileType,
        req.user.id || 1,
        'completed',
        req.file.path
      ]
    );

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        ...result.rows[0],
        path: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: originalName
      }
    });
    
    console.log('✅ File saved to database with ID:', result.rows[0].id);
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Cleanup file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Upload failed: ' + error.message
    });
  }
});

/**
 * Get File Content
 * GET /api/files/:id/content
 * Returns the parsed content of an uploaded file
 */
app.get('/api/files/:id/content', verifyToken, async (req, res) => {
  try {
    // Fetch file information from database
    const fileResult = await pool.query(
      'SELECT * FROM files WHERE id = $1',
      [req.params.id]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'File not found' 
      });
    }

    const file = fileResult.rows[0];
    const filePath = file.file_path;

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false,
        error: 'File not found on disk' 
      });
    }

    const fileExtension = path.extname(file.name).toLowerCase();
    let content = {};

    // Parse file content based on type
    switch (fileExtension) {
      case '.csv':
        content = await previewCSV(filePath);
        break;
      case '.xlsx':
      case '.xls':
        content = await previewExcel(filePath);
        break;
      case '.pdf':
        content = await previewPDF(filePath);
        break;
      default:
        return res.status(400).json({ 
          success: false,
          error: 'Unsupported file type' 
        });
    }

    res.json({
      success: true,
      file: file,
      content: content
    });

  } catch (error) {
    console.error('Read file error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to read file: ' + error.message
    });
  }
});

/**
 * Delete File
 * DELETE /api/files/:id
 * Removes file from both database and filesystem
 */
app.delete('/api/files/:id', verifyToken, async (req, res) => {
  try {
    // Get file information from database
    const fileResult = await pool.query(
      'SELECT * FROM files WHERE id = $1',
      [req.params.id]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'File not found' 
      });
    }

    const file = fileResult.rows[0];
    
    // Delete physical file if exists
    if (file.file_path && fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
      console.log('🗑️ File deleted from disk:', file.file_path);
    }
    
    // Remove from database
    await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
    
    console.log('✅ File deleted from database:', file.name);
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Delete failed: ' + error.message
    });
  }
});

/**
 * Cleanup Temporary Files
 * POST /api/files/cleanup-temp
 * Removes old temporary files (older than 10 minutes)
 */
app.post('/api/files/cleanup-temp', verifyToken, (req, res) => {
  try {
    const tempDir = path.join(__dirname, 'temp');
    
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      let deletedCount = 0;
      
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        const now = new Date();
        const fileAge = (now - stats.mtime) / (1000 * 60); // Age in minutes
        
        // Delete files older than 10 minutes
        if (fileAge > 10) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });
      
      res.json({
        success: true,
        message: `Cleaned up ${deletedCount} temp files`
      });
    } else {
      res.json({
        success: true,
        message: 'No temp directory found'
      });
    }
    
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Cleanup failed: ' + error.message
    });
  }
});

// =============================================================================
// COURSE MANAGEMENT ROUTES
// =============================================================================

/**
 * Get All Courses
 * GET /api/courses
 */
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT course_id, course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark, ext1, ext2
      FROM courses 
      ORDER BY "year" DESC, semester ASC, course_code ASC
    `);
    
    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Single Course by ID
 * GET /api/courses/:id
 */
app.get('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT course_id, course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark, ext1, ext2
      FROM courses 
      WHERE course_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      course: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Create New Course
 * POST /api/courses
 */
app.post('/api/courses', verifyToken, async (req, res) => {
  try {
    const { 
      course_code, name_lao, name_eng, credit, theory_hours, 
      lab_hours, practice_hours, semester, year, remark, ext1, ext2 
    } = req.body;

    // Input validation
    if (!course_code || !name_lao || !name_eng || !credit || 
        theory_hours === undefined || !semester || !year) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: course_code, name_lao, name_eng, credit, theory_hours, semester, year'
      });
    }

    // Check for duplicate course code
    const existingCourse = await pool.query(
      'SELECT course_id FROM courses WHERE course_code = $1',
      [course_code]
    );

    if (existingCourse.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)'
      });
    }

    // Insert new course
    const result = await pool.query(`
      INSERT INTO courses 
      (course_code, name_lao, name_eng, credit, theory_hours, 
       lab_hours, practice_hours, semester, "year", remark, ext1, ext2)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
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
      ext2 || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: result.rows[0]
    });
    
    console.log('✅ Course created:', course_code);
    
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while creating course' 
    });
  }
});

/**
 * Update Course
 * PUT /api/courses/:id
 */
app.put('/api/courses/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      course_code, name_lao, name_eng, credit, theory_hours, 
      lab_hours, practice_hours, semester, year, remark, ext1, ext2 
    } = req.body;

    // Input validation
    if (!course_code || !name_lao || !name_eng || !credit || 
        theory_hours === undefined || !semester || !year) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if course exists
    const existingCourse = await pool.query(
      'SELECT course_id FROM courses WHERE course_id = $1',
      [id]
    );

    if (existingCourse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check for duplicate course code (excluding current course)
    const duplicateCode = await pool.query(
      'SELECT course_id FROM courses WHERE course_code = $1 AND course_id != $2',
      [course_code, id]
    );

    if (duplicateCode.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ລະຫັດວິຊານີ້ມີຢູ່ແລ້ວ (Course code already exists)'
      });
    }

    // Update course
    const result = await pool.query(`
      UPDATE courses SET 
        course_code = $1, name_lao = $2, name_eng = $3, credit = $4, 
        theory_hours = $5, lab_hours = $6, practice_hours = $7, 
        semester = $8, "year" = $9, remark = $10, ext1 = $11, ext2 = $12
      WHERE course_id = $13
      RETURNING *
    `, [
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
      id
    ]);
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      course: result.rows[0]
    });
    
    console.log('✅ Course updated:', course_code);
    
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while updating course' 
    });
  }
});

/**
 * Delete Course
 * DELETE /api/courses/:id
 */
app.delete('/api/courses/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await pool.query(
      'SELECT course_code FROM courses WHERE course_id = $1',
      [id]
    );

    if (existingCourse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const courseCode = existingCourse.rows[0].course_code;

    // TODO: Check if course is being used in other tables (grades, enrollments, etc.)
    // const usageCheck = await pool.query(
    //   'SELECT COUNT(*) as count FROM grades WHERE course_id = $1', 
    //   [id]
    // );
    // if (parseInt(usageCheck.rows[0].count) > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'ບໍ່ສາມາດລຶບວິຊາທີ່ມີການບັນທຶກຄະແນນແລ້ວ (Cannot delete course with existing grades)'
    //   });
    // }

    await pool.query('DELETE FROM courses WHERE course_id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
    
    console.log('✅ Course deleted:', courseCode);
    
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting course' 
    });
  }
});

/**
 * Search Courses
 * GET /api/courses/search/:term
 */
app.get('/api/courses/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const result = await pool.query(`
      SELECT course_id, course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark, ext1, ext2
      FROM courses 
      WHERE LOWER(course_code) LIKE LOWER($1) 
         OR LOWER(name_lao) LIKE LOWER($1) 
         OR LOWER(name_eng) LIKE LOWER($1)
      ORDER BY "year" DESC, semester ASC, course_code ASC
    `, [`%${term}%`]);
    
    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Courses by Semester and Year
 * GET /api/courses/semester/:semester/year/:year
 */
app.get('/api/courses/semester/:semester/year/:year', async (req, res) => {
  try {
    const { semester, year } = req.params;
    const result = await pool.query(`
      SELECT course_id, course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark, ext1, ext2
      FROM courses 
      WHERE semester = $1 AND "year" = $2
      ORDER BY course_code ASC
    `, [semester, year]);
    
    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    console.error('Error getting courses by semester/year:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Courses by Year
 * GET /api/courses/year/:year
 */
app.get('/api/courses/year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const result = await pool.query(`
      SELECT course_id, course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark, ext1, ext2
      FROM courses 
      WHERE "year" = $1
      ORDER BY semester ASC, course_code ASC
    `, [year]);
    
    res.json({
      success: true,
      courses: result.rows
    });
  } catch (error) {
    console.error('Error getting courses by year:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Course Statistics
 * GET /api/courses/stats
 */
app.get('/api/courses/stats', async (req, res) => {
  try {
    const totalCourses = await pool.query('SELECT COUNT(*) as count FROM courses');
    
    const creditStats = await pool.query(`
      SELECT 
        SUM(credit) as total_credits,
        AVG(credit) as avg_credits,
        MAX(credit) as max_credits,
        MIN(credit) as min_credits
      FROM courses
    `);
    
    const semesterStats = await pool.query(`
      SELECT 
        semester,
        COUNT(*) as course_count,
        SUM(credit) as total_credits,
        AVG(credit) as avg_credits
      FROM courses
      GROUP BY semester
      ORDER BY semester
    `);
    
    const yearStats = await pool.query(`
      SELECT 
        "year",
        COUNT(*) as course_count,
        SUM(credit) as total_credits,
        AVG(credit) as avg_credits
      FROM courses
      GROUP BY "year"
      ORDER BY "year" DESC
    `);

    const hoursStats = await pool.query(`
      SELECT 
        SUM(theory_hours + lab_hours + practice_hours) as total_hours,
        AVG(theory_hours + lab_hours + practice_hours) as avg_hours,
        SUM(theory_hours) as total_theory_hours,
        SUM(lab_hours) as total_lab_hours,
        SUM(practice_hours) as total_practice_hours
      FROM courses
    `);
    
    res.json({
      success: true,
      stats: {
        total_courses: parseInt(totalCourses.rows[0].count),
        credit_stats: creditStats.rows[0],
        hours_stats: hoursStats.rows[0],
        semester_breakdown: semesterStats.rows,
        year_breakdown: yearStats.rows
      }
    });
    
  } catch (error) {
    console.error('Error getting course stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Get Available Years
 * GET /api/courses/years
 * Returns list of years that have courses (for filter dropdowns)
 */
app.get('/api/courses/years', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT "year" 
      FROM courses 
      ORDER BY "year" DESC
    `);
    
    res.json({
      success: true,
      years: result.rows.map(row => row.year)
    });
  } catch (error) {
    console.error('Error getting available years:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/**
 * Bulk Import Courses
 * POST /api/courses/bulk-import
 * Imports multiple courses in a single transaction
 */
app.post('/api/courses/bulk-import', verifyToken, async (req, res) => {
  try {
    const { courses } = req.body;
    
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No courses provided for import'
      });
    }

    const client = await pool.connect();
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      await client.query('BEGIN');

      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        try {
          // Validate required fields
          if (!course.course_code || !course.name_lao || !course.name_eng) {
            throw new Error(`Row ${i + 1}: Missing required fields`);
          }

          // Check for duplicate course code
          const existing = await client.query(
            'SELECT course_id FROM courses WHERE course_code = $1',
            [course.course_code]
          );

          if (existing.rows.length > 0) {
            throw new Error(`Row ${i + 1}: Course code ${course.course_code} already exists`);
          }

          await client.query(`
            INSERT INTO courses 
            (course_code, name_lao, name_eng, credit, theory_hours, 
             lab_hours, practice_hours, semester, "year", remark, ext1, ext2)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `, [
            course.course_code,
            course.name_lao,
            course.name_eng,
            parseInt(course.credit) || 0,
            parseInt(course.theory_hours) || 0,
            parseInt(course.lab_hours) || 0,
            parseInt(course.practice_hours) || 0,
            parseInt(course.semester) || 1,
            parseInt(course.year) || new Date().getFullYear(),
            course.remark || null,
            course.ext1 || null,
            course.ext2 || null
          ]);

          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: `Import completed. ${successCount} courses imported, ${errorCount} errors.`,
        stats: {
          total: courses.length,
          success: successCount,
          errors: errorCount
        },
        errors: errors.length > 0 ? errors : undefined
      });

      console.log(`✅ Bulk import completed: ${successCount} success, ${errorCount} errors`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in bulk import:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during bulk import' 
    });
  }
});

/**
 * Export Courses to CSV
 * GET /api/courses/export/csv
 * Downloads all courses as CSV file
 */
app.get('/api/courses/export/csv', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT course_code, name_lao, name_eng, credit, 
             theory_hours, lab_hours, practice_hours, semester, 
             "year", remark
      FROM courses 
      ORDER BY "year" DESC, semester ASC, course_code ASC
    `);

    // Set CSV response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=courses.csv');

    // CSV header row
    const headers = [
      'Course Code', 'Name (Lao)', 'Name (English)', 'Credits',
      'Theory Hours', 'Lab Hours', 'Practice Hours', 
      'Semester', 'Year', 'Remark'
    ];
    
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    result.rows.forEach(course => {
      const row = [
        course.course_code || '',
        `"${(course.name_lao || '').replace(/"/g, '""')}"`,
        `"${(course.name_eng || '').replace(/"/g, '""')}"`,
        course.credit || 0,
        course.theory_hours || 0,
        course.lab_hours || 0,
        course.practice_hours || 0,
        course.semester || '',
        course.year || '',
        `"${(course.remark || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    res.send(csvContent);
    console.log('✅ Courses exported to CSV');

  } catch (error) {
    console.error('Error exporting courses:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during export' 
    });
  }
});

// =============================================================================

// ==================== SCORES API ====================

// Get all scores
app.get('/api/scores', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, student_id, course_code, academic_year, semester as score_semester,
              midterm_score, midterm_grade, exam_score, exam_grade,
              final_score, final_grade, email as score_email
       FROM scores
       ORDER BY academic_year DESC, semester DESC`
    );

    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching scores'
    });
  }
});

// Update score
app.put('/api/scores/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_id,
      course_code,
      academic_year,
      semester,
      midterm_score,
      midterm_grade,
      exam_score,
      exam_grade,
      final_score,
      final_grade,
      email
    } = req.body;

    const result = await pool.query(
      `UPDATE scores 
       SET student_id=$1, course_code=$2, academic_year=$3, semester=$4,
           midterm_score=$5, midterm_grade=$6,
           exam_score=$7, exam_grade=$8,
           final_score=$9, final_grade=$10,
           email=$11, updated_at=NOW()
       WHERE id=$12
       RETURNING *`,
      [
        student_id, course_code, academic_year, semester,
        midterm_score, midterm_grade, exam_score, exam_grade,
        final_score, final_grade, email, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Score not found' });
    }

    res.json({
      success: true,
      message: 'Score updated successfully',
      score: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating score'
    });
  }
  app.get('/api/scores', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, student_id, course_code, academic_year, semester as score_semester,
              midterm_score, midterm_grade, exam_score, exam_grade,
              final_score, final_grade, email as score_email
       FROM scores
       ORDER BY academic_year DESC, semester DESC`
    );

    res.json({ success: true, scores: result.rows });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
// Update score

// Get all scores + student info
app.get('/api/scores', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         s.id,
         s.student_id,
         st.first_name_lao,
         st.last_name_lao,
         st.first_name_en,
         st.last_name_en,
         s.course_code,
         s.academic_year,
         s.semester AS score_semester,
         s.email,
         s.activity_score,
         s.activity_grade,
         s.midterm_score,
         s.midterm_grade,
         s.exam_score,
         s.exam_grade,
         s.final_score,
         s.final_grade
       FROM scores s
       LEFT JOIN students st ON s.student_id = st.student_id
       ORDER BY s.academic_year DESC, s.semester DESC, s.student_id ASC`
    );

    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching scores'
    });
  }
});

});



//Scores Management API Endpoints - เพิ่มลงใน server.js

// Get all scores with student and course details
app.get('/api/scores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        st.first_name_lao,
        st.last_name_lao,
        st.email AS student_email,
        st.dob,
        st.entry_year,
        st.is_active,
        s.course_code,
        c.name_lao AS course_name_lao,
        c.name_eng AS course_name_eng,
        c.credit,
        c.theory_hours,
        c.lab_hours,
        c.practice_hours,
        c.semester AS course_semester,
        c."year" AS course_year,
        s.academic_year,
        s.semester AS score_semester,
        s.midterm_score,
        s.midterm_grade,
        s.exam_score,
        s.exam_grade,
        s.final_score,
        s.final_grade,
        s.email AS score_email
      FROM scores s
      LEFT JOIN students st ON s.student_id = st.student_id
      LEFT JOIN courses c ON s.course_code = c.course_code
      ORDER BY s.academic_year DESC, s.semester ASC, s.student_id ASC
    `);
    
    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error getting scores:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting scores' 
    });
  }
});

// Get single score by ID
app.get('/api/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        st.first_name_lao,
        st.last_name_lao,
        st.email AS student_email,
        s.course_code,
        c.name_lao AS course_name_lao,
        c.name_eng AS course_name_eng,
        s.academic_year,
        s.semester,
        s.midterm_score,
        s.midterm_grade,
        s.exam_score,
        s.exam_grade,
        s.final_score,
        s.final_grade,
        s.email
      FROM scores s
      LEFT JOIN students st ON s.student_id = st.student_id
      LEFT JOIN courses c ON s.course_code = c.course_code
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }
    
    res.json({
      success: true,
      score: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting score:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting score' 
    });
  }
});

// Create new score
app.post('/api/scores', verifyToken, async (req, res) => {
  try {
    const { 
      student_id, course_code, academic_year, semester,
      midterm_score, midterm_grade, exam_score, exam_grade,
      final_score, final_grade, email 
    } = req.body;

    // Validation
    if (!student_id || !course_code || !academic_year || !semester) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: student_id, course_code, academic_year, semester'
      });
    }

    // Check if student exists
    const studentCheck = await pool.query(
      'SELECT student_id FROM students WHERE student_id = $1',
      [student_id]
    );
    if (studentCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ບໍ່ພົບນັກສຶກສາທີ່ມີລະຫັດດັ່ງກ່າວ'
      });
    }

    // Check if course exists
    const courseCheck = await pool.query(
      'SELECT course_code FROM courses WHERE course_code = $1',
      [course_code]
    );
    if (courseCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ບໍ່ພົບວິຊາທີ່ມີລະຫັດດັ່ງກ່າວ'
      });
    }

    // Check for duplicate score entry
    const duplicateCheck = await pool.query(
      'SELECT id FROM scores WHERE student_id = $1 AND course_code = $2 AND academic_year = $3 AND semester = $4',
      [student_id, course_code, academic_year, semester]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ'
      });
    }

    const result = await pool.query(`
      INSERT INTO scores 
      (student_id, course_code, academic_year, semester, midterm_score, midterm_grade, 
       exam_score, exam_grade, final_score, final_grade, email, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `, [
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
      email || null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Score created successfully',
      score: result.rows[0]
    });
    
    console.log('✅ Score created for student:', student_id);
    
  } catch (error) {
    console.error('Error creating score:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while creating score' 
    });
  }
});

// Update score
app.put('/api/scores/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      student_id, course_code, academic_year, semester,
      midterm_score, midterm_grade, exam_score, exam_grade,
      final_score, final_grade, email 
    } = req.body;

    // Validation
    if (!student_id || !course_code || !academic_year || !semester) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if score exists
    const existingScore = await pool.query(
      'SELECT id FROM scores WHERE id = $1',
      [id]
    );
    if (existingScore.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Check for duplicate score entry (excluding current record)
    const duplicateCheck = await pool.query(
      'SELECT id FROM scores WHERE student_id = $1 AND course_code = $2 AND academic_year = $3 AND semester = $4 AND id != $5',
      [student_id, course_code, academic_year, semester, id]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ມີການບັນທຶກຄະແນນຂອງນັກສຶກສາຄົນນີ້ໃນວິຊານີ້ແລ້ວ'
      });
    }

    const result = await pool.query(`
      UPDATE scores SET 
        student_id = $1, course_code = $2, academic_year = $3, semester = $4,
        midterm_score = $5, midterm_grade = $6, exam_score = $7, exam_grade = $8,
        final_score = $9, final_grade = $10, email = $11, updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
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
      id
    ]);
    
    res.json({
      success: true,
      message: 'Score updated successfully',
      score: result.rows[0]
    });
    
    console.log('✅ Score updated for student:', student_id);
    
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while updating score' 
    });
  }
});

// Delete score
app.delete('/api/scores/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if score exists
    const existingScore = await pool.query(
      'SELECT student_id, course_code FROM scores WHERE id = $1',
      [id]
    );
    if (existingScore.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    const { student_id, course_code } = existingScore.rows[0];

    await pool.query('DELETE FROM scores WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Score deleted successfully'
    });
    
    console.log('✅ Score deleted for student:', student_id, 'course:', course_code);
    
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting score' 
    });
  }
});

// Get scores by student ID
app.get('/api/scores/student/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const result = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        st.first_name_lao,
        st.last_name_lao,
        s.course_code,
        c.name_lao AS course_name_lao,
        c.name_eng AS course_name_eng,
        c.credit,
        s.academic_year,
        s.semester,
        s.midterm_score,
        s.midterm_grade,
        s.exam_score,
        s.exam_grade,
        s.final_score,
        s.final_grade
      FROM scores s
      LEFT JOIN students st ON s.student_id = st.student_id
      LEFT JOIN courses c ON s.course_code = c.course_code
      WHERE s.student_id = $1
      ORDER BY s.academic_year DESC, s.semester ASC
    `, [student_id]);
    
    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error getting scores by student:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting student scores' 
    });
  }
});

// Get scores by course code
app.get('/api/scores/course/:course_code', async (req, res) => {
  try {
    const { course_code } = req.params;
    const result = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        st.first_name_lao,
        st.last_name_lao,
        s.course_code,
        c.name_lao AS course_name_lao,
        s.academic_year,
        s.semester,
        s.midterm_score,
        s.midterm_grade,
        s.exam_score,
        s.exam_grade,
        s.final_score,
        s.final_grade
      FROM scores s
      LEFT JOIN students st ON s.student_id = st.student_id
      LEFT JOIN courses c ON s.course_code = c.course_code
      WHERE s.course_code = $1
      ORDER BY s.final_score DESC
    `, [course_code]);
    
    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error getting scores by course:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting course scores' 
    });
  }
});

// Get score statistics
app.get('/api/scores/stats', async (req, res) => {
  try {
    const totalScores = await pool.query('SELECT COUNT(*) as count FROM scores');
    
    const gradeStats = await pool.query(`
      SELECT 
        final_grade as grade,
        COUNT(*) as count
      FROM scores
      WHERE final_grade IS NOT NULL
      GROUP BY final_grade
      ORDER BY final_grade
    `);
    
    const averageStats = await pool.query(`
      SELECT 
        AVG(midterm_score) as avg_midterm,
        AVG(exam_score) as avg_exam,
        AVG(final_score) as avg_final,
        MAX(final_score) as max_final,
        MIN(final_score) as min_final
      FROM scores
      WHERE final_score IS NOT NULL
    `);
    
    const semesterStats = await pool.query(`
      SELECT 
        academic_year,
        semester,
        COUNT(*) as score_count,
        AVG(final_score) as avg_score
      FROM scores
      WHERE final_score IS NOT NULL
      GROUP BY academic_year, semester
      ORDER BY academic_year DESC, semester ASC
    `);
    
    res.json({
      success: true,
      stats: {
        total_scores: parseInt(totalScores.rows[0].count),
        grade_distribution: gradeStats.rows,
        average_stats: averageStats.rows[0],
        semester_stats: semesterStats.rows
      }
    });
    
  } catch (error) {
    console.error('Error getting score stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while getting score statistics' 
    });
  }
});

// Search scores
app.get('/api/scores/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const result = await pool.query(`
      SELECT 
        s.id,
        s.student_id,
        st.first_name_lao,
        st.last_name_lao,
        s.course_code,
        c.name_lao AS course_name_lao,
        c.name_eng AS course_name_eng,
        s.academic_year,
        s.semester,
        s.midterm_score,
        s.midterm_grade,
        s.exam_score,
        s.exam_grade,
        s.final_score,
        s.final_grade
      FROM scores s
      LEFT JOIN students st ON s.student_id = st.student_id
      LEFT JOIN courses c ON s.course_code = c.course_code
      WHERE LOWER(s.student_id) LIKE LOWER($1) 
         OR LOWER(st.first_name_lao) LIKE LOWER($1)
         OR LOWER(st.last_name_lao) LIKE LOWER($1)
         OR LOWER(s.course_code) LIKE LOWER($1)
         OR LOWER(c.name_lao) LIKE LOWER($1)
         OR LOWER(c.name_eng) LIKE LOWER($1)
      ORDER BY s.academic_year DESC, s.semester ASC
    `, [`%${term}%`]);
    
    res.json({
      success: true,
      scores: result.rows
    });
  } catch (error) {
    console.error('Error searching scores:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while searching scores' 
    });
  }
});

// Generate transcript for a student
app.get('/api/scores/transcript/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    
    // Get student info
    const studentInfo = await pool.query(
      'SELECT * FROM students WHERE student_id = $1',
      [student_id]
    );
    
    if (studentInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    // Get all scores for the student
    const scores = await pool.query(`
      SELECT 
        s.*,
        c.name_lao AS course_name_lao,
        c.name_eng AS course_name_eng,
        c.credit,
        c.theory_hours,
        c.lab_hours,
        c.practice_hours
      FROM scores s
      LEFT JOIN courses c ON s.course_code = c.course_code
      WHERE s.student_id = $1
      ORDER BY s.academic_year ASC, s.semester ASC
    `, [student_id]);
    
    // Calculate GPA and other statistics
    const totalCredits = scores.rows.reduce((sum, score) => sum + (score.credit || 0), 0);
    const gradePoints = {
      'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0
    };
    
    let totalGradePoints = 0;
    let totalCreditHours = 0;
    
    scores.rows.forEach(score => {
      if (score.final_grade && score.credit && gradePoints[score.final_grade] !== undefined) {
        totalGradePoints += gradePoints[score.final_grade] * score.credit;
        totalCreditHours += score.credit;
      }
    });
    
    const gpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : 0;
    
    res.json({
      success: true,
      transcript: {
        student: studentInfo.rows[0],
        scores: scores.rows,
        summary: {
          total_credits: totalCredits,
          completed_credits: totalCreditHours,
          gpa: parseFloat(gpa),
          total_courses: scores.rows.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error generating transcript:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while generating transcript' 
    });
  }
});

// Bulk import scores
app.post('/api/scores/bulk-import', verifyToken, async (req, res) => {
  try {
    const { scores } = req.body;
    
    if (!Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No scores provided for import'
      });
    }

    const client = await pool.connect();
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      await client.query('BEGIN');

      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        try {
          // Validate required fields
          if (!score.student_id || !score.course_code || !score.academic_year || !score.semester) {
            throw new Error(`Row ${i + 1}: Missing required fields`);
          }

          // Check for duplicate
          const existing = await client.query(
            'SELECT id FROM scores WHERE student_id = $1 AND course_code = $2 AND academic_year = $3 AND semester = $4',
            [score.student_id, score.course_code, score.academic_year, score.semester]
          );

          if (existing.rows.length > 0) {
            throw new Error(`Row ${i + 1}: Duplicate score entry for student ${score.student_id} in course ${score.course_code}`);
          }

          await client.query(`
            INSERT INTO scores 
            (student_id, course_code, academic_year, semester, midterm_score, midterm_grade, 
             exam_score, exam_grade, final_score, final_grade, email, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          `, [
            score.student_id,
            score.course_code,
            parseInt(score.academic_year),
            parseInt(score.semester),
            score.midterm_score ? parseFloat(score.midterm_score) : null,
            score.midterm_grade || null,
            score.exam_score ? parseFloat(score.exam_score) : null,
            score.exam_grade || null,
            score.final_score ? parseFloat(score.final_score) : null,
            score.final_grade || null,
            score.email || null
          ]);

          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: `Import completed. ${successCount} scores imported, ${errorCount} errors.`,
        stats: {
          total: scores.length,
          success: successCount,
          errors: errorCount
        },
        errors: errors.length > 0 ? errors : undefined
      });

      console.log(`✅ Bulk score import completed: ${successCount} success, ${errorCount} errors`);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in bulk import scores:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during bulk import' 
    });
  }
});
// =====================================  New   ========================================


// =============================================================================
// SERVER STARTUP
// =============================================================================

/**
 * Start the Express server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Education Management System API
  📍 Server URL: http://localhost:${PORT}
  📍 Health Check: http://localhost:${PORT}
  📍 API Base: http://localhost:${PORT}/api
  
  📂 Available Endpoints:
  ┌─ Authentication ────────────────────
  │ POST /api/auth/login
  ├─ User Management ──────────────────
  │ GET    /api/users
  │ POST   /api/users
  │ GET    /api/users/:id
  │ PUT    /api/users/:id
  │ DELETE /api/users/:id
  │ GET    /api/users/search/:term
  │ GET    /api/users/role/:role
  │ PATCH  /api/users/:id/status
  │ PATCH  /api/users/:id/reset-password
  │ GET    /api/users/stats
  ├─ Student Management ───────────────
  │ GET    /api/students
  │ POST   /api/students
  ├─ Course Management ────────────────
  │ GET    /api/courses
  │ POST   /api/courses
  │ GET    /api/courses/:id
  │ PUT    /api/courses/:id
  │ DELETE /api/courses/:id
  │ GET    /api/courses/search/:term
  │ GET    /api/courses/semester/:semester/year/:year
  │ GET    /api/courses/year/:year
  │ GET    /api/courses/stats
  │ GET    /api/courses/years
  │ POST   /api/courses/bulk-import
  │ GET    /api/courses/export/csv
  ├─ File Management ──────────────────
  │ GET    /api/files
  │ POST   /api/files/preview
  │ POST   /api/files/upload
  │ GET    /api/files/:id/content
  │ DELETE /api/files/:id
  │ POST   /api/files/cleanup-temp
  └─────────────────────────────────────
  
  🔑 Test Accounts:
  • admin@ict.la / password123
  • staff@ict.la / password123
  • student@ict.la / password123
  
  📁 File Support: PDF, Excel (.xlsx/.xls), CSV
  🗄️  Database: PostgreSQL
  🔒 Authentication: JWT Tokens
  ====================================
  `);
});