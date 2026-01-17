import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  CloudArrowUp,
  User,
  SignOut,
  SignIn,
  CaretDown,
  Image as ImageIcon,
  Star,
  Gear
} from '@phosphor-icons/react';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center py-2 px-1 relative z-30">
      {/* Mobile Title */}
      <div className="md:hidden text-2xl font-hand font-bold text-pencil -rotate-2">
        涂鸦
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          className="btn-primary flex items-center gap-2 text-pencil"
          onClick={() => navigate('/')}
        >
          <CloudArrowUp size={24} />
          <span className="hidden sm:inline">绘画</span>
        </button>

        {isAuthenticated ? (
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/50 rounded-md border border-transparent hover:border-dashed hover:border-gray-400 transition-all font-hand text-lg"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="m-auto mt-1 text-gray-500" />
                )}
              </div>
              <span className="hidden sm:inline text-pencil">{user?.username}</span>
              <CaretDown size={16} weight="bold" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-sketch border border-gray-200 p-2 z-20 rotate-1 transform origin-top-right">
                   {/* Tape on Dropdown */}
                   <div className="absolute -top-3 right-8 w-12 h-6 bg-white/40 backdrop-blur-sm rotate-2 shadow-tape"></div>

                   <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-marker-yellow/30 rounded font-hand text-lg" onClick={() => setShowUserMenu(false)}>
                     <ImageIcon size={20} /> 我的涂鸦
                   </Link>
                   <Link to="/favorites" className="flex items-center gap-2 p-2 hover:bg-marker-pink/30 rounded font-hand text-lg" onClick={() => setShowUserMenu(false)}>
                     <Star size={20} /> 收藏
                   </Link>
                   <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded font-hand text-lg" onClick={() => setShowUserMenu(false)}>
                     <Gear size={20} /> 设置
                   </Link>
                   <div className="h-px bg-gray-200 my-1 border-b border-dashed"></div>
                   <button className="w-full flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded font-hand text-lg text-left" onClick={handleLogout}>
                     <SignOut size={20} /> 离开
                   </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-secondary flex items-center gap-2 text-pencil">
            <SignIn size={24} />
            <span>登录</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
