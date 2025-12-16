import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTagStore } from '@/store/tagStore';
import toast from 'react-hot-toast';
import {
  HiOutlineTag,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
} from 'react-icons/hi';
import './Tags.css';

/**
 * 标签管理页面
 */
const TagsPage = () => {
  const { tags, isLoading, fetchTags, createTag, updateTag, deleteTag } = useTagStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  // 加载标签列表
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // 创建标签
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error('请输入标签名称');
      return;
    }

    const result = await createTag({ name: tagName, color: tagColor });
    if (result.success) {
      toast.success('标签创建成功');
      setShowCreateModal(false);
      setTagName('');
      setTagColor('#3b82f6');
    } else {
      toast.error(result.error);
    }
  };

  // 编辑标签
  const handleEdit = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error('请输入标签名称');
      return;
    }

    const result = await updateTag(editingTag.id, { name: tagName, color: tagColor });
    if (result.success) {
      toast.success('标签更新成功');
      setShowEditModal(false);
      setEditingTag(null);
      setTagName('');
      setTagColor('#3b82f6');
    } else {
      toast.error(result.error);
    }
  };

  // 删除标签
  const handleDelete = async (tagId) => {
    const confirmed = window.confirm('确定要删除这个标签吗？');
    if (!confirmed) return;

    const result = await deleteTag(tagId);
    if (result.success) {
      toast.success('标签已删除');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <motion.div
      className="tags-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 页面头部 */}
      <div className="tags-header">
        <div className="header-left">
          <h1 className="page-title">
            <HiOutlineTag />
            标签管理
          </h1>
          <p className="page-subtitle">共 {tags.length} 个标签</p>
        </div>
        <div className="header-right">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <HiOutlinePlus />
            创建标签
          </button>
        </div>
      </div>

      {/* 标签列表 */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      ) : tags.length === 0 ? (
        <div className="empty-state">
          <HiOutlineTag className="empty-icon" />
          <h3>还没有标签</h3>
          <p>创建标签来更好地组织您的图片</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <HiOutlinePlus />
            创建第一个标签
          </button>
        </div>
      ) : (
        <div className="tags-grid">
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              className="tag-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tag-color" style={{ backgroundColor: tag.color }}></div>
              <div className="tag-content">
                <h3 className="tag-name">{tag.name}</h3>
                <p className="tag-count">{tag.count || 0} 张图片</p>
              </div>
              <div className="tag-actions">
                <button
                  className="tag-action-btn"
                  onClick={() => handleEdit(tag)}
                  title="编辑"
                >
                  <HiOutlinePencil />
                </button>
                <button
                  className="tag-action-btn danger"
                  onClick={() => handleDelete(tag.id)}
                  title="删除"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 创建标签模态框 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <HiOutlinePlus />
                创建标签
              </h3>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>标签名称</label>
                  <input
                    type="text"
                    className="input"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="输入标签名称"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>标签颜色</label>
                  <input
                    type="color"
                    className="color-input"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  <HiOutlineCheck />
                  创建
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 编辑标签模态框 */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <HiOutlinePencil />
                编辑标签
              </h3>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>标签名称</label>
                  <input
                    type="text"
                    className="input"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="输入标签名称"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>标签颜色</label>
                  <input
                    type="color"
                    className="color-input"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  <HiOutlineCheck />
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TagsPage;
