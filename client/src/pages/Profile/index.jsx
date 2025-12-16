import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { validateUsername, validateEmail } from '@/utils/validation';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineCloudUpload,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineInformationCircle,
  HiCheckCircle,
} from 'react-icons/hi';
import './Profile.css';

/**
 * 个人资料页面
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 验证表单
  const validateForm = () => {
    const newErrors = {};

    // 验证用户名
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.errors[0];
    }

    // 验证邮箱
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('资料更新成功');
        setIsEditing(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 页面头部 */}
      <div className="profile-header">
        <h1 className="page-title">
          <HiOutlineUser />
          个人资料
        </h1>
        <p className="page-subtitle">管理您的账户信息</p>
      </div>

      {/* 资料卡片 */}
      <div className="profile-card">
        {/* 头像区域 */}
        <div className="avatar-section">
          <div className="avatar-container">
            {formData.avatar ? (
              <img src={formData.avatar} alt="头像" className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                <HiOutlineUser />
              </div>
            )}
          </div>
          {isEditing && (
            <button className="btn btn-sm btn-outline">
              <HiOutlineCloudUpload />
              更换头像
            </button>
          )}
        </div>

        {/* 表单区域 */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">
              <HiOutlineUser />
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`input ${errors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <HiOutlineMail />
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bio">
              <HiOutlineDocumentText />
              个人简介
            </label>
            <textarea
              id="bio"
              name="bio"
              className="textarea"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
              placeholder="介绍一下自己..."
            />
          </div>

          {/* 操作按钮 */}
          <div className="form-actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck />
                      保存更改
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <HiOutlinePencil />
                编辑资料
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 账户信息 */}
      <div className="account-info">
        <h2 className="section-title">
          <HiOutlineInformationCircle />
          账户信息
        </h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">注册时间</span>
            <span className="info-value">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('zh-CN')
                : '未知'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">用户ID</span>
            <span className="info-value">{user?.id || '未知'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">账户状态</span>
            <span className="info-value status-active">
              <HiCheckCircle />
              正常
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
