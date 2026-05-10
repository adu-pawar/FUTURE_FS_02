import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome as HomeIcon, FiUsers as UsersIcon, FiUserPlus as AddIcon, FiLogOut as LogOutIcon, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { name: 'Customers', path: '/customers', icon: <UsersIcon /> },
    { name: 'Add Customer', path: '/customers/add', icon: <AddIcon /> },
  ];

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-dark text-white shadow-2xl">
      <div>
        <div className="flex h-20 items-center justify-between border-b border-gray-700 px-6">
          <div className="flex items-center gap-2">
            <img src="/FUTURE_FS_02/logo.png" alt="ManageUp Logo" className="h-8 w-8 rounded-lg object-contain" />
            <h1 className="text-xl font-bold text-primary">ManageUp</h1>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 lg:hidden"
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-700 p-4">
        {user && (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-all duration-300 hover:bg-gray-800 hover:text-red-300"
          >
            <LogOutIcon className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
