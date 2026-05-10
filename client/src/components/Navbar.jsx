import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getColorForName, getInitials } from '../utils/colors';

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);
  const color = user ? getColorForName(user.name) : null;

  return (
    <header className="flex h-20 items-center justify-between bg-white px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full bg-gray-100 py-2 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-gray-500 transition-colors hover:text-primary">
          <FiBell className="text-xl" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-3 border-l pl-4 md:pl-6">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-gray-700 md:block">
                {user.name}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color.bg} ${color.text} font-bold text-sm shadow-md`}>
                {getInitials(user.name)}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 md:px-4 md:py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/30 transition-colors hover:bg-blue-600 md:px-4 md:py-2"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
