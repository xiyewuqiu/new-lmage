import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/store/imageStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useAuthStore } from '@/store/authStore';
import { formatFileSize, formatDate } from '@/utils/format';
import toast from 'react-hot-toast';
import {
  HiOutlinePhotograph,
  HiOutlineCloudUpload,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineCheckCircle,
  HiCheckCircle,
  HiOutlineTrash,
  HiOutlineLink,
  HiOutlineHeart,
  HiHeart,
  HiOutlineDocument,
  HiOutlineClock,
  HiOutlineCollection,
} from 'react-icons/hi';
import './Dashboard.css';

/**
 * 仪表板页面 - 图片管理中心
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    images,
    isLoading,
    filters,
    selectedImages,
    isSelectionMode,
    fetchImages,
    deleteImage,
    deleteImages,
    setViewMode,
    setSortBy,
    toggleSelectionMode,
    toggleImageSelection,
    toggleSelectAll,
    clearSelection,
  } = useImageStore();

  const { favorites, toggleFavorite } = useFavoriteStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // 加载图片列表
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // 处理删除单个图片
  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    const result = await deleteImage(imageToDelete.id);
    if (result.success) {
      toast.success('图片已删除');
      setShowDeleteModal(false);
      setImageToDelete(null);
    } else {
      toast.error(result.error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedImages.size === 0) return;

    const confirmed = window.confirm(
      `确定要删除选中的 ${selectedImages.size} 张图片吗？`
    );

    if (confirmed) {
      const result = await deleteImages(Array.from(selectedImages));
      if (result.success) {
        toast.success(`已删除 ${selectedImages.size} 张图片`);
      } else {
        toast.error(result.error);
      }
    }
  };

  // 复制链接
  const copyImageUrl = (image) => {
    const url = window.location.origin + image.src;
    navigator.clipboard.writeText(url);
    toast.success('链接已复制');
  };

  // 检查是否收藏
  const isFavorite = (imageId) => favorites.has(imageId);

  return (
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 页面头部 */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="page-title">
            <HiOutlinePhotograph />
            我的图片
          </h1>
          <p className="page-subtitle">
            共 {images.length} 张图片
            {isSelectionMode && ` · 已选择 ${selectedImages.size} 张`}
          </p>
        </div>

        <div className="header-right">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >
            <HiOutlineCloudUpload />
            上传图片
          </button>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          {/* 视图切换 */}
          <div className="view-switcher">
            <button
              className={`view-btn ${filters.viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="网格视图"
            >
              <HiOutlineViewGrid />
            </button>
            <button
              className={`view-btn ${filters.viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="列表视图"
            >
              <HiOutlineViewList />
            </button>
          </div>

          {/* 排序 */}
          <select
            className="sort-select"
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">最新上传</option>
            <option value="oldest">最早上传</option>
            <option value="largest">文件最大</option>
            <option value="smallest">文件最小</option>
            <option value="name">文件名</option>
          </select>
        </div>

        <div className="toolbar-right">
          {/* 选择模式 */}
          {isSelectionMode ? (
            <>
              <button className="btn btn-sm" onClick={toggleSelectAll}>
                <HiOutlineCollection />
                全选
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleBatchDelete}
                disabled={selectedImages.size === 0}
              >
                <HiOutlineTrash />
                删除选中
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  toggleSelectionMode();
                  clearSelection();
                }}
              >
                取消
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-outline" onClick={toggleSelectionMode}>
              <HiOutlineCheckCircle />
              批量操作
            </button>
          )}
        </div>
      </div>

      {/* 图片网格/列表 */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <HiOutlinePhotograph className="empty-icon" />
          <h3>还没有上传图片</h3>
          <p>点击上传按钮开始使用</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <HiOutlineCloudUpload />
            立即上传
          </button>
        </div>
      ) : (
        <div className={`image-container ${filters.viewMode}`}>
          {images.map((image) => (
            <motion.div
              key={image.id}
              className={`image-card ${
                selectedImages.has(image.id) ? 'selected' : ''
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* 选择框 */}
              {isSelectionMode && (
                <div
                  className="selection-checkbox"
                  onClick={() => toggleImageSelection(image.id)}
                >
                  {selectedImages.has(image.id) ? (
                    <HiCheckCircle />
                  ) : (
                    <HiOutlineCheckCircle />
                  )}
                </div>
              )}

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
                    className="overlay-btn"
                    onClick={() => toggleFavorite(image.id)}
                    title={isFavorite(image.id) ? '取消收藏' : '收藏'}
                  >
                    {isFavorite(image.id) ? <HiHeart /> : <HiOutlineHeart />}
                  </button>
                  <button
                    className="overlay-btn danger"
                    onClick={() => handleDeleteClick(image)}
                    title="删除"
                  >
                    <HiOutlineTrash />
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

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <HiOutlineTrash />
                确认删除
              </h3>
            </div>
            <div className="modal-body">
              <p>确定要删除这张图片吗？此操作无法撤销。</p>
              {imageToDelete && (
                <div className="delete-preview">
                  <img src={imageToDelete.src} alt={imageToDelete.fileName} />
                  <p>{imageToDelete.fileName}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                取消
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <HiOutlineTrash />
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
