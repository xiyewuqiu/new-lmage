import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import {
  HiOutlineCloudUpload,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineUser,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineLogin,
  HiChevronDown,
} from 'react-icons/hi';
import './Header.css';

/**
 * 头部组件
 * 包含 Logo、搜索、主题切换、用户菜单等
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 处理退出登录
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* 左侧 - 标题 */}
        <div className="header-left">
          <h1 className="header-title">TG-Image</h1>
        </div>

        {/* 右侧 - 操作按钮 */}
        <div className="header-right">
          {/* 上传按钮 */}
          <button
            className="header-btn upload-btn"
            onClick={() => navigate('/')}
            title="上传图片"
          >
            <HiOutlineCloudUpload />
            <span className="hide-mobile">上传</span>
          </button>

          {/* 主题切换 */}
          <button
            className="header-btn theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
          </button>

          {/* 用户菜单 */}
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} />
                  ) : (
                    <HiOutlineUser />
                  )}
                </div>
                <span className="hide-mobile">{user?.username}</span>
                <HiChevronDown className="chevron-icon" />
              </button>

              {/* 下拉菜单 */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="user-menu-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/dashboard"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlinePhotograph />
                      <span>我的图片</span>
                    </Link>
                    <Link
                      to="/favorites"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineStar />
                      <span>收藏</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineUser />
                      <span>个人资料</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineCog />
                      <span>设置</span>
                    </Link>
                    <div className="menu-divider"></div>
                    <button className="menu-item logout" onClick={handleLogout}>
                      <HiOutlineLogout />
                      <span>退出登录</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="header-btn login-btn">
              <HiOutlineLogin />
              <span>登录</span>
            </Link>
          )}
        </div>
      </div>

      {/* 点击外部关闭菜单 */}
      {showUserMenu && (
        <div
          className="user-menu-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
