import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useImageStore } from '@/store/imageStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { 
  HiHome, 
  HiOutlineHome,
  HiPhotograph,
  HiOutlinePhotograph,
  HiStar,
  HiOutlineStar,
  HiCog,
  HiOutlineCog,
  HiQuestionMarkCircle,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import './Sidebar.css';

/**
 * 底部导航栏组件
 * 现代化设计，使用 react-icons
 */
const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { images } = useImageStore();
  const { favorites } = useFavoriteStore();

  // 主导航菜单项
  const menuItems = [
    {
      path: '/',
      icon: HiOutlineHome,
      activeIcon: HiHome,
      label: '首页',
      public: true,
    },
    {
      path: '/dashboard',
      icon: HiOutlinePhotograph,
      activeIcon: HiPhotograph,
      label: '图库',
      badge: images.length,
      requireAuth: true,
    },
    {
      path: '/favorites',
      icon: HiOutlineStar,
      activeIcon: HiStar,
      label: '收藏',
      badge: favorites.size,
      requireAuth: true,
    },
    {
      path: '/settings',
      icon: HiOutlineCog,
      activeIcon: HiCog,
      label: '设置',
      requireAuth: true,
    },
    {
      path: '/help',
      icon: HiOutlineQuestionMarkCircle,
      activeIcon: HiQuestionMarkCircle,
      label: '帮助',
      public: true,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const filterMenuItems = (items) => {
    return items.filter(
      (item) => item.public || (item.requireAuth && isAuthenticated)
    );
  };

  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="bottom-nav-container">
        {/* 背景光效 */}
        <div className="bottom-nav-glow" />
        
        <div className="bottom-nav-items">
          {filterMenuItems(menuItems).map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                {/* 激活指示器 */}
                {active && (
                  <motion.div
                    className="nav-item-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* 图标容器 */}
                <motion.div 
                  className="nav-item-icon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon />
                  
                  {/* 徽章 */}
                  {item.badge > 0 && (
                    <span className="nav-item-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </motion.div>
                
                {/* 标签 */}
                <span className="nav-item-label">{item.label}</span>
                
                {/* 涟漪效果背景 */}
                <div className="nav-item-ripple" />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
