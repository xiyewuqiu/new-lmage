import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/store/imageStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { formatFileSize, formatDate } from '@/utils/format';
import toast from 'react-hot-toast';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineLink,
  HiOutlineDocument,
  HiOutlineClock,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import './Favorites.css';

/**
 * 收藏页面 - 显示用户收藏的图片
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const { images, fetchImages } = useImageStore();
  const { favorites, toggleFavorite } = useFavoriteStore();

  // 加载图片列表
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // 过滤收藏的图片
  const favoriteImages = images.filter((img) => favorites.has(img.id));

  // 复制链接
  const copyImageUrl = (image) => {
    const url = window.location.origin + image.src;
    navigator.clipboard.writeText(url);
    toast.success('链接已复制');
  };

  // 取消收藏
  const handleUnfavorite = (imageId) => {
    toggleFavorite(imageId);
    toast.success('已取消收藏');
  };

  return (
    <motion.div
      className="favorites-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 页面头部 */}
      <div className="favorites-header">
        <div className="header-left">
          <h1 className="page-title">
            <HiHeart />
            我的收藏
          </h1>
          <p className="page-subtitle">共 {favoriteImages.length} 张收藏图片</p>
        </div>
      </div>

      {/* 收藏图片网格 */}
      {favoriteImages.length === 0 ? (
        <div className="empty-state">
          <HiOutlineHeart className="empty-icon" />
          <h3>还没有收藏图片</h3>
          <p>在图片管理中点击爱心图标即可收藏</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            <HiOutlinePhotograph />
            前往图片管理
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteImages.map((image) => (
            <motion.div
              key={image.id}
              className="favorite-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* 图片预览 */}
              <div className="image-preview">
                <img src={image.src} alt={image.fileName} loading="lazy" />
                <div className="image-overlay">
                  <button
                    className="overlay-btn"
                    onClick={() => copyImageUrl(image)}
                    title="复制链接"
                  >
                    <HiOutlineLink />
                  </button>
                  <button
                    className="overlay-btn danger"
                    onClick={() => handleUnfavorite(image.id)}
                    title="取消收藏"
                  >
                    <HiHeart />
                  </button>
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesPage;
