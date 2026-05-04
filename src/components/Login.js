import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Database } from 'lucide-react';
import logo from '../assets/IICT.png';
import logimg from "../assets/LTC-logo-sign.png";
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log(email, password);
      // await onLogin(email, password);
      const data = await axios.post('http://172.28.27.50:5002/api/auth/login', { email, password });
      console.log(data.data);
      if (data.status == 200) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        // window.location.href = '/dashboard';
      }
      await onLogin(email, password, data.data.user.role, data.data.user.name, data.data.user.id);
      console.log(data.status);
    } catch (err) {
      setError('ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
      console.error('Login error:', err);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-25">
            {/* <div className="inline-flex items-center justify-center w-33 h-33 rounded-full bg-white mb-4 shadow-md">
              <img src={logo} alt="Logo" className="w-28 h-28 object-contain" />
            </div> */}

            <div className="flex flex-row justify-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white mb-4 border-3 border-gray-200 shadow-xl overflow-hidden p-4 mr-3">
                <img src={logimg} alt="Logo" className="w-89  h-90  object-cover " />
              </div>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white mb-4 border-3 border-gray-200 shadow-xl overflow-hidden p-2">
                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>


            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ລະບົບຈັດການໃບຄະແນນ
            </h1>
            <p className="text-gray-600">
              ສະຖາບັນເຕັກໂນໂລຊີ ICT
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ອີເມວ
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="admin@ict.la"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ລະຫັດຜ່ານ
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Demo Accounts:
              <br />
              Admin: admin@ict.la / admin123
              <br />
              User: user@ict.la / user123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;