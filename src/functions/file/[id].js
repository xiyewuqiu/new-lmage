export async function fileHandler(c) {
    const env = c.env;
    const id = c.req.param('id');
    const url = new URL(c.req.url);

    // 检查是否为下载请求
    const isDownload = url.searchParams.get('download') === 'true';

    // 检查是否为原图请求（直接嵌入）
    const isRaw = url.searchParams.get('raw') === 'true';

    // 检查是否为浏览器直接访问（而非嵌入、API调用等）
    const userAgent = c.req.header('User-Agent') || '';
    const accept = c.req.header('Accept') || '';
    const referer = c.req.header('Referer') || '';

    // 判断是否为浏览器直接访问：
    // 1. Accept头包含text/html
    // 2. 没有referer或referer不是图片嵌入
    // 3. 不是下载请求和原图请求
    const isBrowserDirectAccess = !isDownload && !isRaw &&
                                  accept.includes('text/html') &&
                                  !accept.includes('image/') &&
                                  (!referer || !referer.includes('image'));

    try {
        let fileUrl = null;

        // 尝试处理通过Telegram Bot API上传的文件
        if (id.length > 30 || id.includes('.')) { // 长ID通常代表通过Bot上传的文件，或包含扩展名的文件
            const fileId = id.split('.')[0]; // 分离文件ID和扩展名
            const filePath = await getFilePath(env, fileId);

            if (filePath) {
                fileUrl = `https://api.telegram.org/file/bot${env.TG_Bot_Token}/${filePath}`;
            }
        } else {
            // 处理Telegraph链接
            fileUrl = `https://telegra.ph/file/${id}`;
        }

        // 如果找到文件URL
        if (fileUrl) {
            // 如果是浏览器直接访问，返回预览页面
            if (isBrowserDirectAccess) {
                return createPreviewPage(c, id, fileUrl);
            }

            // 否则返回原图文件（包括下载、原图请求、图片嵌入等）
            return await proxyFile(c, fileUrl);
        }

        // 处理KV元数据
        if (env.img_url) {
            let record = await env.img_url.getWithMetadata(id);

            if (!record || !record.metadata) {
                // 初始化元数据（如不存在）
                record = {
                    metadata: {
                        ListType: "None",
                        Label: "None",
                        TimeStamp: Date.now(),
                        liked: false,
                        fileName: id,
                        fileSize: 0,
                    }
                };
                await env.img_url.put(id, "", { metadata: record.metadata });
            }

            const metadata = {
                ListType: record.metadata.ListType || "None",
                Label: record.metadata.Label || "None",
                TimeStamp: record.metadata.TimeStamp || Date.now(),
                liked: record.metadata.liked !== undefined ? record.metadata.liked : false,
                fileName: record.metadata.fileName || id,
                fileSize: record.metadata.fileSize || 0,
            };

            // 根据ListType和Label处理
            if (metadata.ListType === "Block" || metadata.Label === "adult") {
                if (referer) {
                    return c.redirect('/images/blocked.png');
                } else {
                    return c.redirect('/block-img.html');
                }
            }

            // 保存元数据
            await env.img_url.put(id, "", { metadata });
        }

        // 如果所有尝试都失败，返回404
        return c.text('文件不存在', 404);
    } catch (error) {
        console.error('文件访问错误:', error);
        return c.text('服务器错误', 500);
    }
}

/**
 * 创建图片预览页面
 */
function createPreviewPage(c, id, imageUrl) {
    const currentUrl = new URL(c.req.url);
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    const downloadUrl = `${baseUrl}/file/${id}?download=true`;
    const rawUrl = `${baseUrl}/file/${id}?raw=true`;

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图片预览 - TG-Image</title>
    <meta name="description" content="高质量图片在线预览">
    <link rel="icon" href="${baseUrl}/images/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #4361ee;
            --primary-dark: #3730a3;
            --text-color: #ffffff;
            --text-muted: rgba(255, 255, 255, 0.7);
            --bg-dark: #000000;
            --bg-overlay: rgba(0, 0, 0, 0.9);
            --bg-panel: rgba(17, 25, 40, 0.9);
            --border-color: rgba(255, 255, 255, 0.1);
            --success-color: #10b981;
            --error-color: #ef4444;
            --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            --radius: 16px;
            --radius-sm: 8px;
        }

        body {
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            color: var(--text-color);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            position: relative;
        }

        /* 动态背景效果 */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 25% 25%, rgba(67, 97, 238, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
            z-index: 0;
            animation: backgroundShift 20s ease-in-out infinite alternate;
        }

        @keyframes backgroundShift {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-10px, -10px) rotate(1deg); }
        }

        .preview-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-in;
            z-index: 1;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .preview-container.fullscreen {
            cursor: zoom-out;
        }

        .preview-image {
            max-width: 85%;
            max-height: 85%;
            object-fit: contain;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border-color);
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }

        .preview-image.loaded {
            opacity: 1;
            transform: scale(1) translateY(0);
        }

        .preview-image:hover:not(.fullscreen) {
            transform: scale(1.02);
            box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.9);
        }

        .preview-image.fullscreen {
            max-width: 100%;
            max-height: 100%;
            border-radius: 0;
            border: none;
            box-shadow: none;
        }

        /* 控制面板 */
        .controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            animation: slideUp 0.6s ease-out 0.8s forwards;
        }

        @keyframes slideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .control-btn {
            width: 56px;
            height: 56px;
            background: var(--bg-panel);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            color: var(--text-color);
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            position: relative;
            overflow: hidden;
        }

        .control-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        .control-btn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 12px 24px rgba(67, 97, 238, 0.3);
            border-color: var(--primary-color);
        }

        .control-btn:hover::before {
            opacity: 1;
        }

        .control-btn:active {
            transform: translateY(-2px) scale(1.02);
        }

        .control-btn.large {
            width: 64px;
            height: 64px;
            font-size: 24px;
            background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
            border-color: var(--primary-color);
        }

        .control-btn.large::before {
            opacity: 1;
            background: linear-gradient(45deg, var(--primary-dark), #6366f1);
        }

        /* 信息面板 */
        .info-panel {
            position: fixed;
            top: 30px;
            left: 30px;
            background: var(--bg-panel);
            border: 1px solid var(--border-color);
            padding: 20px;
            border-radius: var(--radius);
            backdrop-filter: blur(20px);
            font-size: 14px;
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            min-width: 200px;
        }

        .info-panel.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .info-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            font-weight: 600;
            color: var(--primary-color);
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .info-item:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }

        .info-label {
            color: var(--text-muted);
            font-size: 13px;
        }

        .info-value {
            color: var(--text-color);
            font-weight: 500;
        }

        /* 加载状态 */
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 100;
        }

        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: var(--text-muted);
            font-size: 16px;
            font-weight: 500;
        }

        /* 错误状态 */
        .error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--error-color);
            background: var(--bg-panel);
            padding: 40px;
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(20px);
            z-index: 100;
        }

        .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.7;
        }

        .error-text {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .error-subtitle {
            font-size: 14px;
            color: var(--text-muted);
        }

        /* 快捷键提示 */
        .hotkeys {
            position: fixed;
            bottom: 30px;
            left: 30px;
            background: var(--bg-panel);
            border: 1px solid var(--border-color);
            padding: 16px 20px;
            border-radius: var(--radius);
            backdrop-filter: blur(20px);
            font-size: 13px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
        }

        .hotkeys.show {
            opacity: 1;
            transform: translateY(0);
        }

        .hotkeys kbd {
            background: var(--border-color);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 11px;
            font-weight: bold;
            margin: 0 4px;
        }

        /* 品牌标识 */
        .brand {
            position: fixed;
            top: 30px;
            right: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted);
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            animation: fadeIn 0.6s ease-out 1s forwards;
            z-index: 1000;
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        .brand-icon {
            width: 24px;
            height: 24px;
            background: var(--primary-color);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
        }

        /* 成功提示 */
        .toast {
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius-sm);
            font-weight: 500;
            z-index: 2000;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .controls {
                bottom: 20px;
                right: 20px;
                gap: 10px;
            }

            .control-btn {
                width: 48px;
                height: 48px;
                font-size: 18px;
            }

            .control-btn.large {
                width: 56px;
                height: 56px;
                font-size: 22px;
            }

            .info-panel {
                top: 20px;
                left: 20px;
                right: 20px;
                font-size: 13px;
                padding: 16px;
            }

            .hotkeys {
                display: none;
            }

            .brand {
                top: 20px;
                right: 20px;
                font-size: 12px;
            }

            .preview-image {
                max-width: 95%;
                max-height: 95%;
            }
        }

        @media (max-width: 480px) {
            .controls {
                bottom: 16px;
                right: 16px;
                gap: 8px;
            }

            .info-panel {
                top: 16px;
                left: 16px;
                right: 16px;
            }

            .brand {
                top: 16px;
                right: 16px;
            }
        }
    </style>
</head>
<body>
    <!-- 品牌标识 -->
    <div class="brand">
        <div class="brand-icon">
            <i class="ri-image-line"></i>
        </div>
        TG-Image
    </div>

    <!-- 主预览容器 -->
    <div class="preview-container" id="previewContainer">
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载图片...</div>
        </div>

        <img class="preview-image" id="previewImage" style="display: none;" />
        <video class="preview-image" id="previewVideo" style="display: none;" autoplay loop muted playsinline></video>

        <div class="error" id="error" style="display: none;">
            <div class="error-icon">
                <i class="ri-error-warning-line"></i>
            </div>
            <div class="error-text">文件加载失败</div>
            <div class="error-subtitle">请检查网络连接或稍后重试</div>
        </div>
    </div>

    <!-- 信息面板 -->
    <div class="info-panel" id="infoPanel">
        <div class="info-header">
            <i class="ri-information-line"></i>
            图片信息
        </div>
        <div class="info-item">
            <span class="info-label">文件名</span>
            <span class="info-value" id="fileName">${id}</span>
        </div>
        <div class="info-item">
            <span class="info-label">尺寸</span>
            <span class="info-value" id="dimensions">-</span>
        </div>
        <div class="info-item">
            <span class="info-label">类型</span>
            <span class="info-value" id="fileType">-</span>
        </div>
        <div class="info-item">
            <span class="info-label">大小</span>
            <span class="info-value" id="fileSize">-</span>
        </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
        <button class="control-btn" id="infoBtn" onclick="toggleInfo()" title="显示/隐藏信息 (I)">
            <i class="ri-information-line"></i>
        </button>
        <button class="control-btn" id="copyBtn" onclick="copyLink()" title="复制链接 (C)">
            <i class="ri-link"></i>
        </button>
        <button class="control-btn" id="fullscreenBtn" onclick="toggleFullscreen()" title="全屏查看 (F)">
            <i class="ri-fullscreen-line"></i>
        </button>
        <button class="control-btn large" id="downloadBtn" onclick="downloadImage()" title="下载原图 (D)">
            <i class="ri-download-line"></i>
        </button>
    </div>

    <!-- 快捷键提示 -->
    <div class="hotkeys" id="hotkeys">
        <kbd>F</kbd> 全屏 <kbd>I</kbd> 信息 <kbd>C</kbd> 复制 <kbd>D</kbd> 下载 <kbd>ESC</kbd> 关闭
    </div>

    <!-- 成功提示 -->
    <div class="toast" id="toast"></div>

    <script>
        const imageUrl = '${rawUrl}'; // 使用原图链接
        const downloadUrl = '${downloadUrl}';
        const shareUrl = '${baseUrl}/file/${id}'; // 分享链接（预览页面）
        const previewImage = document.getElementById('previewImage');
        const previewVideo = document.getElementById('previewVideo');
        const previewContainer = document.getElementById('previewContainer');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const infoPanel = document.getElementById('infoPanel');
        const hotkeys = document.getElementById('hotkeys');
        const toast = document.getElementById('toast');
        const fullscreenBtn = document.getElementById('fullscreenBtn');

        let isFullscreen = false;
        let infoVisible = false;
        let currentElement = null; // 当前显示的元素（img或video）

        // 显示提示消息
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }

        // 复制链接
        function copyLink() {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('链接已复制到剪贴板');
            }).catch(() => {
                showToast('复制失败，请手动复制');
            });
        }

        // 检测文件类型并加载相应元素
        function loadMedia() {
            const originalFormat = '${id}'.includes('.') ? '${id}'.split('.').pop().toLowerCase() : '';

            // 先尝试作为图片加载
            const testImg = new Image();
            testImg.onload = function() {
                // 成功加载为图片
                currentElement = previewImage;
                previewImage.src = imageUrl;
                showMedia(previewImage);
            };

            testImg.onerror = function() {
                // 图片加载失败，尝试作为视频加载（可能是GIF转MP4）
                if (originalFormat === 'gif') {
                    currentElement = previewVideo;
                    previewVideo.src = imageUrl;
                    showMedia(previewVideo);
                } else {
                    // 都失败了，显示错误
                    loading.style.display = 'none';
                    error.style.display = 'block';
                }
            };

            testImg.src = imageUrl;
        }

        // 显示媒体元素
        function showMedia(element) {
            loading.style.display = 'none';
            element.style.display = 'block';

            // 添加加载完成动画
            setTimeout(() => {
                element.classList.add('loaded');
            }, 100);

            // 更新文件信息
            updateMediaInfo();

            // 显示快捷键提示
            setTimeout(() => {
                hotkeys.classList.add('show');
                setTimeout(() => {
                    hotkeys.classList.remove('show');
                }, 4000);
            }, 1500);
        }

        // 视频加载事件
        previewVideo.onloadeddata = function() {
            if (currentElement === previewVideo) {
                showMedia(previewVideo);
            }
        };

        previewVideo.onerror = function() {
            if (currentElement === previewVideo) {
                loading.style.display = 'none';
                error.style.display = 'block';
            }
        };

        // 开始加载
        loadMedia();

        // 更新媒体信息
        function updateMediaInfo() {
            const originalFormat = '${id}'.includes('.') ? '${id}'.split('.').pop().toLowerCase() : '';
            const extension = imageUrl.split('.').pop().toLowerCase();

            if (currentElement === previewImage) {
                // 图片信息
                document.getElementById('dimensions').textContent =
                    previewImage.naturalWidth + ' × ' + previewImage.naturalHeight + ' px';
            } else if (currentElement === previewVideo) {
                // 视频信息
                document.getElementById('dimensions').textContent =
                    previewVideo.videoWidth + ' × ' + previewVideo.videoHeight + ' px';
            }

            const typeMap = {
                'jpg': 'JPEG',
                'jpeg': 'JPEG',
                'png': 'PNG',
                'gif': 'GIF',
                'webp': 'WebP',
                'svg': 'SVG',
                'mp4': 'MP4'
            };

            // 如果原始文件是GIF但实际是MP4，显示为GIF
            let displayType = typeMap[extension] || '未知';
            if (originalFormat === 'gif') {
                if (currentElement === previewVideo || extension === 'mp4') {
                    displayType = 'GIF (动图)';
                } else {
                    displayType = 'GIF';
                }
            }

            document.getElementById('fileType').textContent = displayType;

            // 文件大小显示为未知（无法准确计算）
            document.getElementById('fileSize').textContent = '未知';
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        // 切换信息面板
        function toggleInfo() {
            infoVisible = !infoVisible;
            if (infoVisible) {
                infoPanel.classList.add('show');
            } else {
                infoPanel.classList.remove('show');
            }
        }

        // 切换全屏
        function toggleFullscreen() {
            isFullscreen = !isFullscreen;
            if (isFullscreen) {
                previewContainer.classList.add('fullscreen');
                if (currentElement) {
                    currentElement.classList.add('fullscreen');
                }
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
                fullscreenBtn.title = '退出全屏 (F)';
            } else {
                previewContainer.classList.remove('fullscreen');
                if (currentElement) {
                    currentElement.classList.remove('fullscreen');
                }
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-line"></i>';
                fullscreenBtn.title = '全屏查看 (F)';
            }
        }

        // 下载图片
        function downloadImage() {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '${id}';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('开始下载图片...');
        }

        // 点击媒体元素切换全屏
        previewContainer.addEventListener('click', function(e) {
            if (e.target === previewImage || e.target === previewVideo || e.target === previewContainer) {
                toggleFullscreen();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', function(e) {
            switch(e.key.toLowerCase()) {
                case 'escape':
                    if (isFullscreen) {
                        toggleFullscreen();
                    } else if (infoVisible) {
                        toggleInfo();
                    } else {
                        window.close();
                    }
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'd':
                    e.preventDefault();
                    downloadImage();
                    break;
                case 'i':
                    e.preventDefault();
                    toggleInfo();
                    break;
                case 'c':
                    e.preventDefault();
                    copyLink();
                    break;
            }
        });

        // 防止右键菜单
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // 添加页面离开前的确认
        window.addEventListener('beforeunload', function(e) {
            // 可以在这里添加离开确认逻辑
        });
    </script>
</body>
</html>`;

    return c.html(html);
}

/**
 * 获取Telegram文件路径
 */
async function getFilePath(env, fileId) {
    try {
        const url = `https://api.telegram.org/bot${env.TG_Bot_Token}/getFile?file_id=${fileId}`;
        const res = await fetch(url, {
            method: 'GET',
        });

        if (!res.ok) {
            console.error(`HTTP错误! 状态: ${res.status}`);
            return null;
        }

        const responseData = await res.json();
        const { ok, result } = responseData;

        if (ok && result) {
            return result.file_path;
        } else {
            console.error('响应数据错误:', responseData);
            return null;
        }
    } catch (error) {
        console.error('获取文件路径错误:', error.message);
        return null;
    }
}

/**
 * 代理文件请求
 * 直接传递原始文件内容，不进行压缩，确保原图质量
 */
async function proxyFile(c, fileUrl) {
    const response = await fetch(fileUrl, {
        method: c.req.method,
        headers: c.req.headers
    });

    if (!response.ok) {
        return c.text('文件获取失败', response.status);
    }

    const headers = new Headers();
    response.headers.forEach((value, key) => {
        headers.set(key, value);
    });

    // 添加缓存控制
    headers.set('Cache-Control', 'public, max-age=31536000');

    // 确保设置正确的Content-Type，以便浏览器能够预览图片
    const contentType = response.headers.get('Content-Type');
    // 从请求ID中获取原始文件扩展名
    const requestId = c.req.param('id');
    const originalExtension = requestId.includes('.') ? requestId.split('.').pop().toLowerCase() : '';
    console.log(`请求ID: ${requestId}, 原始扩展名: ${originalExtension}`);

    if (contentType) {
        // 特殊处理：如果原始文件是GIF但Telegram返回的是MP4，保持为video类型但添加特殊标记
        if (originalExtension === 'gif' && contentType.startsWith('video/')) {
            console.log('检测到GIF转MP4的情况，保持video Content-Type');
            headers.set('Content-Type', contentType);
            // 添加自定义头部标记这是一个转换后的GIF
            headers.set('X-Original-Format', 'gif');
        } else {
            headers.set('Content-Type', contentType);
        }
    } else {
        // 根据URL推断内容类型
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        console.log(`从URL推断文件扩展名: ${fileExtension}`);

        if (['jpg', 'jpeg'].includes(fileExtension)) {
            headers.set('Content-Type', 'image/jpeg');
        } else if (fileExtension === 'png') {
            headers.set('Content-Type', 'image/png');
        } else if (fileExtension === 'gif' || originalExtension === 'gif') {
            // 如果原始是GIF文件，但实际可能是MP4
            if (fileExtension === 'mp4' || contentType === 'video/mp4') {
                headers.set('Content-Type', 'video/mp4');
                headers.set('X-Original-Format', 'gif');
                console.log('设置GIF转MP4的Content-Type');
            } else {
                headers.set('Content-Type', 'image/gif');
                console.log('设置GIF Content-Type');
            }
        } else if (fileExtension === 'webp') {
            headers.set('Content-Type', 'image/webp');
        } else if (fileExtension === 'svg') {
            headers.set('Content-Type', 'image/svg+xml');
        } else if (fileExtension === 'mp4') {
            headers.set('Content-Type', 'video/mp4');
        } else {
            // 默认设置为二进制流
            headers.set('Content-Type', 'application/octet-stream');
        }
    }

    // 移除Content-Disposition头或设置为inline，确保浏览器预览而不是下载
    headers.set('Content-Disposition', 'inline');

    return new Response(response.body, {
        status: response.status,
        headers
    });
}