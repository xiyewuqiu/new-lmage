import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineExclamation, HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi';
import './NotFound.css';

/**
 * 404 页面
 */
const NotFoundPage = () => {
  return (
    <motion.div
      className="not-found-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="not-found-content">
        {/* 404 图标 */}
        <motion.div
          className="not-found-icon"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <HiOutlineExclamation />
        </motion.div>

        {/* 404 文字 */}
        <motion.h1
          className="not-found-title"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          className="not-found-subtitle"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          抱歉，您访问的页面不存在
        </motion.p>

        <motion.p
          className="not-found-description"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          页面可能已被删除、移动或从未存在过
        </motion.p>

        {/* 操作按钮 */}
        <motion.div
          className="not-found-actions"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to="/" className="btn btn-primary">
            <HiOutlineHome />
            返回首页
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            <HiOutlineArrowLeft />
            返回上一页
          </button>
        </motion.div>

        {/* 装饰元素 */}
        <div className="not-found-decoration">
          <motion.div
            className="decoration-circle decoration-circle-1"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="decoration-circle decoration-circle-2"
            animate={{
              y: [0, 20, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
