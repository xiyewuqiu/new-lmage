import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { validatePassword } from '@/utils/validation';
import toast from 'react-hot-toast';
import {
  HiOutlineCog,
  HiOutlineColorSwatch,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBell,
  HiOutlineCloudUpload,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineCheck,
} from 'react-icons/hi';
import './Settings.css';

/**
 * 设置页面
 */
const SettingsPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, changePassword, logout } = useAuthStore();

  // 密码修改
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 账户设置
  const [settings, setSettings] = useState({
    emailNotifications: true,
    uploadNotifications: true,
    autoSave: true,
    compressImages: false,
    defaultPrivacy: 'public',
  });

  // 处理密码输入
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 验证密码
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = '请输入当前密码';
    }

    const newPasswordValidation = validatePassword(passwordData.newPassword);
    if (!newPasswordValidation.isValid) {
      errors.newPassword = newPasswordValidation.errors[0];
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 提交密码修改
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        toast.success('密码修改成功');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordSection(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('修改失败，请重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 处理设置变化
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success('设置已保存');
  };

  // 注销账户
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      '确定要注销账户吗？此操作无法撤销，所有数据将被永久删除。'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm('请再次确认：真的要删除账户吗？');
      if (doubleConfirm) {
        toast.error('账户注销功能暂未开放');
      }
    }
  };

  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 页面头部 */}
      <div className="settings-header">
        <h1 className="page-title">
          <HiOutlineCog />
          设置
        </h1>
        <p className="page-subtitle">管理您的偏好设置和账户安全</p>
      </div>

      {/* 设置内容 */}
      <div className="settings-content">
        {/* 外观设置 */}
        <section className="settings-section">
          <h2 className="section-title">
            <HiOutlineColorSwatch />
            外观设置
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>主题模式</h3>
              <p>选择浅色或深色主题</p>
            </div>
            <div className="theme-switcher">
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <HiOutlineSun />
                浅色
              </button>
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <HiOutlineMoon />
                深色
              </button>
            </div>
          </div>
        </section>

        {/* 通知设置 */}
        <section className="settings-section">
          <h2 className="section-title">
            <HiOutlineBell />
            通知设置
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>邮件通知</h3>
              <p>接收重要更新和活动通知</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleSettingChange('emailNotifications', e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>上传通知</h3>
              <p>图片上传完成后发送通知</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.uploadNotifications}
                onChange={(e) =>
                  handleSettingChange('uploadNotifications', e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* 上传设置 */}
        <section className="settings-section">
          <h2 className="section-title">
            <HiOutlineCloudUpload />
            上传设置
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>自动保存</h3>
              <p>上传后自动保存到我的图片</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>图片压缩</h3>
              <p>上传时自动压缩图片以节省空间</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.compressImages}
                onChange={(e) =>
                  handleSettingChange('compressImages', e.target.checked)
                }
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>默认隐私</h3>
              <p>新上传图片的默认可见性</p>
            </div>
            <select
              className="select"
              value={settings.defaultPrivacy}
              onChange={(e) => handleSettingChange('defaultPrivacy', e.target.value)}
            >
              <option value="public">公开</option>
              <option value="private">私密</option>
              <option value="unlisted">不公开列出</option>
            </select>
          </div>
        </section>

        {/* 安全设置 */}
        <section className="settings-section">
          <h2 className="section-title">
            <HiOutlineShieldCheck />
            安全设置
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>修改密码</h3>
              <p>定期更换密码以保护账户安全</p>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              <HiOutlineLockClosed />
              {showPasswordSection ? '取消' : '修改密码'}
            </button>
          </div>

          {/* 密码修改表单 */}
          {showPasswordSection && (
            <motion.form
              className="password-form"
              onSubmit={handlePasswordSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="form-group">
                <label htmlFor="currentPassword">当前密码</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className={`input ${passwordErrors.currentPassword ? 'error' : ''}`}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="输入当前密码"
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">
                    {passwordErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">新密码</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className={`input ${passwordErrors.newPassword ? 'error' : ''}`}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="输入新密码"
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">确认新密码</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="再次输入新密码"
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-message">
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <div className="btn-spinner"></div>
                    修改中...
                  </>
                ) : (
                  <>
                    <HiOutlineCheck />
                    确认修改
                  </>
                )}
              </button>
            </motion.form>
          )}
        </section>

        {/* 危险区域 */}
        <section className="settings-section danger-section">
          <h2 className="section-title">
            <HiOutlineExclamation />
            危险区域
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>注销账户</h3>
              <p>永久删除您的账户��所有数据</p>
            </div>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              <HiOutlineTrash />
              注销账户
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
