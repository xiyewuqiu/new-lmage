import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { HiX } from 'react-icons/hi';
import './Modal.css';

/**
 * 通用模态框组件
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlay = true,
  showCloseButton = true,
}) => {
  // 按 ESC 键关闭
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <motion.div
            className={`modal modal-${size}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 模态框头部 */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && <h3 className="modal-title">{title}</h3>}
                {showCloseButton && (
                  <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="关闭"
                  >
                    <HiX />
                  </button>
                )}
              </div>
            )}

            {/* 模态框内容 */}
            <div className="modal-body">{children}</div>

            {/* 模态框底部 */}
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  closeOnOverlay: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

export default Modal;
