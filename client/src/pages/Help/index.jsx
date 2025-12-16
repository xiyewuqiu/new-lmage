import { motion } from 'framer-motion';
import {
  HiOutlineCloudUpload,
  HiOutlinePhotograph,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineShieldCheck,
  HiOutlineDeviceMobile,
  HiOutlineQuestionMarkCircle,
  HiOutlineSupport,
} from 'react-icons/hi';
import { FiGithub, FiMail } from 'react-icons/fi';
import './Help.css';

/**
 * 帮助页面
 */
const HelpPage = () => {
  const faqs = [
    {
      question: '如何上传图片？',
      answer:
        '您可以通过三种方式上传图片：1. 拖拽图片到上传区域；2. 点击上传区域选择文件；3. 使用 Ctrl+V 粘贴剪贴板中的图片。',
    },
    {
      question: '支持哪些图片格式？',
      answer:
        '我们支持常见的图片格式，包括 PNG、JPG、JPEG、GIF、WebP 和 SVG。',
    },
    {
      question: '图片大小有限制吗？',
      answer: '单个图片文件大小限制为 10MB。如果需要上传更大的文件，建议先进行压缩。',
    },
    {
      question: '上传的图片会保存多久？',
      answer:
        '基于 Telegram 的存储特性，您上传的图片将永久保存，不会过期。',
    },
    {
      question: '如何管理我的图片？',
      answer:
        '注册并登录后，您可以在"我的图片"页面查看、编辑、删除和管理所有上传的图片。',
    },
    {
      question: '什么是收藏功能？',
      answer:
        '收藏功能允许您标记重要的图片，方便快速查找。在图片卡片上点击星标图标即可收藏。',
    },
    {
      question: '如何使用标签？',
      answer:
        '标签可以帮助您分类管理图片。您可以在"标签管理"页面创建标签，然后在编辑图片时为图片添加标签。',
    },
    {
      question: '是否支持批量操作？',
      answer:
        '是的，在"我的图片"页面，您可以开启选择模式，批量选择图片进行删除、添加标签等操作。',
    },
  ];

  const features = [
    {
      Icon: HiOutlineCloudUpload,
      title: '快速上传',
      description: '支持拖拽、点击和粘贴三种上传方式',
    },
    {
      Icon: HiOutlinePhotograph,
      title: '图片管理',
      description: '完整的图片管理功能，支持搜索、筛选和排序',
    },
    {
      Icon: HiOutlineStar,
      title: '收藏功能',
      description: '标记重要图片，快速访问常用资源',
    },
    {
      Icon: HiOutlineTag,
      title: '标签系统',
      description: '使用标签分类管理，提高组织效率',
    },
    {
      Icon: HiOutlineShieldCheck,
      title: '安全可靠',
      description: '基于 Telegram 存储，数据安全有保障',
    },
    {
      Icon: HiOutlineDeviceMobile,
      title: '响应式设计',
      description: '完美适配各种设备，随时随地访问',
    },
  ];

  return (
    <motion.div
      className="help-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 页面标题 */}
      <div className="help-header">
        <h1 className="help-title">帮助中心</h1>
        <p className="help-subtitle">
          了解如何使用 TG-Image，快速上手图片管理
        </p>
      </div>

      {/* 功能特性 */}
      <section className="help-section">
        <h2 className="section-title">核心功能</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="feature-icon">
                <feature.Icon />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 常见问题 */}
      <section className="help-section">
        <h2 className="section-title">常见问题</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <h3 className="faq-question">
                <HiOutlineQuestionMarkCircle />
                {faq.question}
              </h3>
              <p className="faq-answer">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 联系支持 */}
      <section className="help-section">
        <div className="contact-card">
          <div className="contact-icon">
            <HiOutlineSupport />
          </div>
          <h2 className="contact-title">需要更多帮助？</h2>
          <p className="contact-description">
            如果您有其他问题或建议，欢迎通过以下方式联系我们
          </p>
          <div className="contact-actions">
            <a
              href="https://github.com/xiyewuqiu/new-lmage/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <FiGithub />
              GitHub Issues
            </a>
            <a
              href="mailto:support@tg-image.com"
              className="btn btn-secondary"
            >
              <FiMail />
              发送邮件
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HelpPage;
