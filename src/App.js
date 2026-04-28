// import React, { useState, useEffect } from 'react';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import './App.css';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored user in localStorage
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (error) {
//       console.error('Error loading user:', error);
//       localStorage.removeItem('user');
//     }
//     setLoading(false);
//   }, []);

//   const handleLogin = async (email, password ,role ,name ,id) => {
//     // Simulate API call with validation
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         // Check credentials
//         if (email === 'admin@ict.la' && password === 'admin123') {
//           const userData = {
//             id: 1,
//             email: email,
//             name: 'ຜູ້ບໍລິຫານລະບົບ',
//             role: 'admin',
//             avatar: null
//           };
//           // setUser(userData);
//           // localStorage.setItem('user', JSON.stringify(userData));
//           // resolve(userData);
//         } else if (email === 'user@ict.la' && password === 'user123') {
//           const userData = {
//             id: 2,
//             email: email,
//             name: 'ນັກສຶກສາ ICT',
//             role: 'user',
//             avatar: null
//           };
//           // setUser(userData);
//           // localStorage.setItem('user', JSON.stringify(userData));
//           // resolve(userData);
//         } else {
//           reject(new Error('Invalid credentials'));

//           const userData = {
//             id: id,
//             email: email,
//             name: name,
//             role: role,
//             avatar: null
//           };
//           setUser(userData);
//           return
//         }
//       }, 500);
//     });
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">ກຳລັງໂຫຼດລະບົບ...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="App">
//       {user ? (
//         <Dashboard user={user} onLogout={handleLogout} />
//       ) : (
//         <Login onLogin={handleLogin} />
//       )}
//     </div>
//   );
// }

// export default App;




import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ โหลด user จาก localStorage ตอน mount ครั้งแรก
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ฟังก์ชัน login (รับค่าจาก Login.js → axios แล้วส่งมา)
  const handleLogin = (email, password, role, name, id) => {
    const userData = { id, email, name, role, avatar: null };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✅ ฟังก์ชัน logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ✅ หน้า loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">ກຳລັງໂຫຼດລະບົບ...</p>
        </div>
      </div>
    );
  }

  // ✅ render หน้า Login หรือ Dashboard ตาม user
  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
