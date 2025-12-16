import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { uploadFiles, validateFile } from '@/services/uploadService';
import {
  HiOutlineCloudUpload,
  HiOutlinePhotograph,
  HiOutlineDocumentDuplicate,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineLink,
  HiOutlineCode,
} from 'react-icons/hi';
import { SiMarkdown } from 'react-icons/si';
import './Home.css';

/**
 * 首页 - 图片上传
 */
const HomePage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  // 处理文件上传
  const handleUpload = async (files) => {
    // 验证文件
    const validFiles = [];
    for (const file of files) {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/*'],
      });

      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.errors.join(', ')}`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    // 开始上传
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFiles(validFiles, (percent) => {
        setProgress(percent);
      });

      if (result.success) {
        setUploadedImages(result.data);
        setCurrentImage(result.data[0]);
        toast.success(`成功上传 ${result.data.length} 张图片`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('上传失败，请重试');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // 配置 Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
    },
    multiple: true,
    disabled: uploading,
  });

  // 复制到剪贴板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  // 重新上传
  const handleUploadAgain = () => {
    setUploadedImages([]);
    setCurrentImage(null);
  };

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 上传区域 */}
      <section className="upload-section">
        <div className="upload-header">
          <h1 className="upload-title">上传图片</h1>
          <p className="upload-subtitle">简单、快速、安全的图片托管服务</p>
        </div>

        {/* 拖拽上传 */}
        {uploadedImages.length === 0 && (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-icon">
              <HiOutlineCloudUpload />
            </div>
            <p className="dropzone-text">
              {isDragActive ? '释放以上传文件' : '拖放图片到这里或点击选择'}
            </p>
            <div className="dropzone-hint">
              <span className="dropzone-hint-item">
                <HiOutlinePhotograph />
                支持多种图片格式
              </span>
              <span className="dropzone-hint-item">
                <HiOutlineDocumentDuplicate />
                支持批量上传
              </span>
              <span className="dropzone-hint-item">
                <HiOutlineClipboard />
                支持 Ctrl+V 粘贴
              </span>
            </div>
          </div>
        )}

        {/* 上传进度 */}
        {uploading && (
          <motion.div
            className="upload-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">上传中... {progress}%</p>
          </motion.div>
        )}

        {/* 上传结果 */}
        {uploadedImages.length > 0 && currentImage && (
          <motion.div
            className="upload-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="result-header">
              <h3>
                <HiOutlineCheck />
                上传成功！
              </h3>
              <p className="result-subtitle">
                您的图片已成功上传，可以通过以下方式使用
              </p>
            </div>

            {/* 图片预览 */}
            <div className="image-preview">
              <img src={currentImage.src} alt="上传的图片" />
            </div>

            {/* 链接组 */}
            <div className="link-group">
              <div className="link-item">
                <label>
                  <HiOutlineLink />
                  直接链接
                </label>
                <div className="copy-container">
                  <input
                    type="text"
                    className="input"
                    value={window.location.origin + currentImage.src}
                    readOnly
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      copyToClipboard(window.location.origin + currentImage.src)
                    }
                  >
                    <HiOutlineDocumentDuplicate />
                    复制
                  </button>
                </div>
              </div>

              <div className="link-item">
                <label>
                  <HiOutlineCode />
                  HTML 代码
                </label>
                <div className="copy-container">
                  <input
                    type="text"
                    className="input"
                    value={`<img src="${window.location.origin}${currentImage.src}" alt="图片" />`}
                    readOnly
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      copyToClipboard(
                        `<img src="${window.location.origin}${currentImage.src}" alt="图片" />`
                      )
                    }
                  >
                    <HiOutlineDocumentDuplicate />
                    复制
                  </button>
                </div>
              </div>

              <div className="link-item">
                <label>
                  <SiMarkdown />
                  Markdown 代码
                </label>
                <div className="copy-container">
                  <input
                    type="text"
                    className="input"
                    value={`![图片](${window.location.origin}${currentImage.src})`}
                    readOnly
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      copyToClipboard(
                        `![图片](${window.location.origin}${currentImage.src})`
                      )
                    }
                  >
                    <HiOutlineDocumentDuplicate />
                    复制
                  </button>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="result-actions">
              <button className="btn btn-primary" onClick={handleUploadAgain}>
                <HiOutlineCloudUpload />
                再次上传
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default HomePage;
