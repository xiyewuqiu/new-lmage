import { motion } from 'framer-motion';
import { formatFileSize, formatDate } from '@/utils/format';
import PropTypes from 'prop-types';
import {
  HiOutlineCheckCircle,
  HiCheckCircle,
  HiHeart,
  HiOutlineHeart,
  HiOutlineLink,
  HiOutlineTrash,
  HiOutlineDocument,
  HiOutlineClock,
} from 'react-icons/hi';
import './ImageCard.css';

/**
 * 图片卡片组件 - 可复用的图片展示卡片
 */
const ImageCard = ({
  image,
  isSelected = false,
  isFavorite = false,
  showSelection = false,
  onSelect,
  onFavorite,
  onCopy,
  onDelete,
  onClick,
}) => {
  // 处理卡片点击
  const handleCardClick = (e) => {
    // 如果点击的是操作按钮，不触发卡片点击
    if (e.target.closest('.image-overlay') || e.target.closest('.selection-checkbox')) {
      return;
    }
    onClick?.(image);
  };

  return (
    <motion.div
      className={`image-card ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
    >
      {/* 选择框 */}
      {showSelection && (
        <div
          className="selection-checkbox"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(image.id);
          }}
        >
          {isSelected ? <HiCheckCircle /> : <HiOutlineCheckCircle />}
        </div>
      )}

      {/* 收藏标记 */}
      {isFavorite && !showSelection && (
        <div className="favorite-badge">
          <HiHeart />
        </div>
      )}

      {/* 图片预览 */}
      <div className="image-preview">
        <img src={image.src} alt={image.fileName} loading="lazy" />
        
        {/* 悬浮操作层 */}
        <div className="image-overlay">
          <div className="overlay-actions">
            {onCopy && (
              <button
                className="overlay-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(image);
                }}
                title="复制链接"
              >
                <HiOutlineLink />
              </button>
            )}
            
            {onFavorite && (
              <button
                className="overlay-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(image.id);
                }}
                title={isFavorite ? '取消收藏' : '收藏'}
              >
                {isFavorite ? <HiHeart /> : <HiOutlineHeart />}
              </button>
            )}
            
            {onDelete && (
              <button
                className="overlay-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image);
                }}
                title="删除"
              >
                <HiOutlineTrash />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 图片信息 */}
      <div className="image-info">
        <p className="image-name" title={image.fileName}>
          {image.fileName}
        </p>
        <div className="image-meta">
          <span>
            <HiOutlineDocument />
            {formatFileSize(image.fileSize)}
          </span>
          <span>
            <HiOutlineClock />
            {formatDate(image.uploadTime)}
          </span>
        </div>
        
        {/* 标签 */}
        {image.tags && image.tags.length > 0 && (
          <div className="image-tags">
            {image.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="tag" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </span>
            ))}
            {image.tags.length > 3 && (
              <span className="tag-more">+{image.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

ImageCard.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    src: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    uploadTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        color: PropTypes.string,
      })
    ),
  }).isRequired,
  isSelected: PropTypes.bool,
  isFavorite: PropTypes.bool,
  showSelection: PropTypes.bool,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  onCopy: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

export default ImageCard;
