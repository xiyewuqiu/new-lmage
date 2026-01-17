import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { uploadFiles, validateFile } from '@/services/uploadService';
import {
  CloudArrowUp,
  Image as ImageIcon,
  Copy,
  DownloadSimple,
  FileMd,
  X,
  ArrowClockwise,
  Check,
  Link as LinkIcon
} from '@phosphor-icons/react';

const HomePage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0, percent: 0 });

  const handleUpload = async (files) => {
    const validFiles = [];
    for (const file of files) {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['image/*'],
      });

      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.errors.join(', ')}`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadResults([]);
    setUploadProgress({ completed: 0, total: validFiles.length, percent: 0 });

    try {
      const result = await uploadFiles(
        validFiles,
        (progress) => setUploadProgress(progress),
        { concurrency: 5, retries: 3 }
      );

      if (result.success) {
        setUploadResults(result.data);
        toast.success(`搞定！成功添加了 ${result.summary.success} 张涂鸦。`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('出错了，怎么回事？');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] },
    multiple: true,
    disabled: uploading,
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板！');
  };

  const exportMetadata = () => {
    const successResults = uploadResults.filter(r => r.success);
    const metadata = {
      timestamp: new Date().toISOString(),
      images: successResults.map(r => ({
        filename: r.filename,
        url: window.location.origin + r.data.src,
      }))
    };
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary-entries-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllUrls = () => {
    const urls = uploadResults.filter(r => r.success).map(r => window.location.origin + r.data.src).join('\n');
    copyToClipboard(urls);
  };

  const copyMarkdownList = () => {
    const markdown = uploadResults.filter(r => r.success).map(r => `![${r.filename}](${window.location.origin}${r.data.src})`).join('\n');
    copyToClipboard(markdown);
  };

  const retryFailedImage = (index) => {
    toast("手动重试功能还在开发中...", { icon: '🚧' });
  };

  const successCount = uploadResults.filter(r => r.success).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-pencil rotate-slight-n1">新日记</h2>
        <p className="text-xl text-gray-500 font-hand mt-2 rotate-slight-1">在这里粘贴你的回忆...</p>
      </div>

      {/* Upload Zone */}
      {uploadResults.length === 0 && !uploading && (
        <div
          {...getRootProps()}
          className={`
            border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-marker-blue bg-blue-50 scale-105 rotate-1' : 'border-gray-300 hover:border-pencil hover:rotate-slight-1'}
          `}
        >
          <input {...getInputProps()} />
          <CloudArrowUp size={64} className={`mx-auto mb-4 ${isDragActive ? 'text-marker-blue' : 'text-gray-400'}`} weight="light" />
          <p className="text-2xl text-pencil font-bold">
            {isDragActive ? '快把照片丢进来！' : '拖拽涂鸦到这里'}
          </p>
          <p className="text-lg text-gray-400 mt-2">或者点击选择</p>
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <div className="text-center py-12">
          <div className="text-3xl font-bold text-pencil mb-4 animate-bounce">
            正在绘制中... {Math.round(uploadProgress.percent)}%
          </div>
          <div className="w-full h-4 border-2 border-pencil rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-marker-yellow transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress.percent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Board */}
      {uploadResults.length > 0 && !uploading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-wrap justify-between items-center mb-6 border-b-2 border-dashed border-gray-200 pb-4">
            <div className="text-2xl font-bold text-pencil">
              <Check size={32} className="inline text-green-500 mr-2" />
              完成: {successCount}
            </div>
            <div className="flex gap-2">
              <button onClick={exportMetadata} className="btn-doodle text-sm py-1 px-3 flex items-center gap-1" title="导出 JSON">
                <DownloadSimple /> 数据
              </button>
              <button onClick={copyAllUrls} className="btn-doodle text-sm py-1 px-3 flex items-center gap-1" title="复制所有链接">
                <LinkIcon /> 链接
              </button>
              <button onClick={copyMarkdownList} className="btn-doodle text-sm py-1 px-3 flex items-center gap-1" title="复制 Markdown">
                <FileMd /> MD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {uploadResults.map((result, index) => (
              <div 
                key={index} 
                className={`
                  bg-white p-3 shadow-sketch border border-gray-200 relative transition-transform hover:scale-105 hover:z-10
                  ${index % 2 === 0 ? 'rotate-slight-1' : 'rotate-slight-n2'}
                `}
              >
                {/* Visual Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm -rotate-2 shadow-tape"></div>
                
                {result.success ? (
                  <>
                    <div className="aspect-video bg-gray-50 overflow-hidden mb-3 border border-gray-100">
                      <img
                        src={window.location.origin + result.data.src}
                        alt={result.filename}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={window.location.origin + result.data.src} 
                         readOnly 
                         className="input-hand text-sm flex-1"
                         onClick={(e) => e.target.select()}
                       />
                       <button onClick={() => copyToClipboard(window.location.origin + result.data.src)} className="text-pencil hover:text-marker-blue transition-colors">
                         <Copy size={24} />
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-red-500">
                    <X size={32} className="mx-auto mb-2" />
                    <p>{result.filename} 失败</p>
                    <p className="text-sm">{result.error}</p>
                    <button onClick={() => retryFailedImage(index)} className="mt-2 text-pencil underline">重试</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              className="btn-primary text-2xl px-8 py-3 rotate-slight-n1" 
              onClick={() => { setUploadResults([]); }}
            >
              <CloudArrowUp className="inline mr-2" />
              再来一张
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
