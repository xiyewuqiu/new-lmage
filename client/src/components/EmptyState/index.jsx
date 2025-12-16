import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { HiOutlineInbox } from 'react-icons/hi';
import './EmptyState.css';

/**
 * 空状态组件 - 用于显示无数据时的提示
 */
const EmptyState = ({
  icon: Icon = HiOutlineInbox,
  title = '暂无数据',
  description = '',
  action,
  actionText,
  onAction,
  illustration,
}) => {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 图标或插图 */}
      {illustration ? (
        <div className="empty-illustration">{illustration}</div>
      ) : (
        <div className="empty-icon">
          {typeof Icon === 'function' ? <Icon /> : Icon}
        </div>
      )}

      {/* 标题 */}
      <h3 className="empty-title">{title}</h3>

      {/* 描述 */}
      {description && <p className="empty-description">{description}</p>}

      {/* 操作按钮 */}
      {action ? (
        action
      ) : actionText && onAction ? (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      ) : null}
    </motion.div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  illustration: PropTypes.node,
};

export default EmptyState;
