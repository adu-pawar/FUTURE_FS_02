import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogOut } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute -left-40 -top-40 h-96 w-96 animate-blob rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      <div className="absolute -right-40 -bottom-40 h-96 w-96 animate-blob animation-delay-2000 rounded-full bg-emerald-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      <div className="absolute -bottom-40 left-20 h-96 w-96 animate-blob animation-delay-4000 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass relative z-10 w-full max-w-md rounded-2xl p-10 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-4">
            <img src="/FUTURE_FS_02/logo.png" alt="ManageUp Logo" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to your CRM dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-600 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-600 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white/20 focus:ring-2 focus:ring-blue-500/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/50"
          >
            Sign In
          </motion.button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
