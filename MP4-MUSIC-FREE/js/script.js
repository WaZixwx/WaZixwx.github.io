// 先导入必要的FFmpeg组件
const { createFFmpeg } = FFmpeg;

// 全局变量
let ffmpeg;
let inputFile = null;
let videoData = null;
let audioData = null;
let isProcessing = false;

// DOM 元素
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadContainer = document.getElementById('upload-container');
const processingContainer = document.getElementById('processing-container');
const resultContainer = document.getElementById('result-container');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPercentage = document.getElementById('progress-percentage');
const processBtn = document.getElementById('process-btn');
const cancelBtn = document.getElementById('cancel-btn');
const videoFileInfo = document.getElementById('video-file-info');
const audioFileInfo = document.getElementById('audio-file-info');
const previewVideoBtn = document.getElementById('preview-video-btn');
const previewAudioBtn = document.getElementById('preview-audio-btn');
const downloadVideoBtn = document.getElementById('download-video-btn');
const downloadAudioBtn = document.getElementById('download-audio-btn');
const downloadAllBtn = document.getElementById('download-all-btn');
const newTaskBtn = document.getElementById('new-task-btn');
const previewModal = document.getElementById('preview-modal');
const closePreviewBtn = document.getElementById('close-preview-btn');
const videoPlayer = document.getElementById('video-player');
const audioPlayer = document.getElementById('audio-player');
const previewTitle = document.getElementById('preview-title');

// 初始化函数
async function init() {
    try {
        // 加载 FFmpeg
        ffmpeg = createFFmpeg({
            log: true,
            progress: handleFFmpegProgress,
            corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
        });
        
        console.log('开始加载FFmpeg...');
        await ffmpeg.load();
        console.log('FFmpeg 加载成功');
        
        // 初始化事件监听器
        setupEventListeners();
    } catch (error) {
        console.error('初始化 FFmpeg 失败:', error);
        alert('加载处理引擎失败，请刷新页面重试。错误详情: ' + error.message);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 文件拖放事件
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
    
    // 点击选择文件
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 按钮事件
    processBtn.addEventListener('click', startProcessing);
    cancelBtn.addEventListener('click', cancelProcessing);
    previewVideoBtn.addEventListener('click', () => previewFile('video'));
    previewAudioBtn.addEventListener('click', () => previewFile('audio'));
    downloadVideoBtn.addEventListener('click', () => downloadFile('video'));
    downloadAudioBtn.addEventListener('click', () => downloadFile('audio'));
    downloadAllBtn.addEventListener('click', downloadAll);
    newTaskBtn.addEventListener('click', resetApp);
    closePreviewBtn.addEventListener('click', closePreview);
    
    // 模态框外部点击关闭
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            closePreview();
        }
    });
}

// 处理文件选择
function handleFileSelect(file) {
    // 检查文件类型
    if (!file.type.includes('video/mp4')) {
        showError('请选择MP4格式的文件');
        return;
    }
    
    // 检查文件大小（限制为2GB）
    if (file.size > 2 * 1024 * 1024 * 1024) {
        showError('文件大小不能超过2GB');
        return;
    }
    
    inputFile = file;
    
    // 更新UI
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // 显示处理容器
    uploadContainer.style.display = 'none';
    processingContainer.style.display = 'block';
    
    // 添加动画效果
    processingContainer.classList.add('animated', 'fadeIn');
}

// 开始处理
async function startProcessing() {
    if (!inputFile || isProcessing) return;
    
    isProcessing = true;
    processBtn.disabled = true;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    progressText.textContent = '正在准备处理...';
    
    try {
        // 读取文件
        const data = await readFileAsArrayBuffer(inputFile);
        
        // 写入文件到 FFmpeg 内存
        ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(data));
        
        // 更新进度
        progressText.textContent = '正在分离音视频...';
        
        // 执行分离 - 无损提取视频
        await ffmpeg.run(
            '-i', 'input.mp4',
            '-c:v', 'copy',
            '-an',
            'output_video.mp4'
        );
        
        // 无损提取音频
        await ffmpeg.run(
            '-i', 'input.mp4',
            '-vn',
            '-acodec', 'copy',
            'output_audio.m4a'
        );
        
        // 读取处理后的文件
        videoData = ffmpeg.FS('readFile', 'output_video.mp4');
        audioData = ffmpeg.FS('readFile', 'output_audio.m4a');
        
        // 显示结果
        showResults();
    } catch (error) {
        console.error('处理出错:', error);
        showError('处理过程中出现错误，请重试');
    } finally {
        isProcessing = false;
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-cut"></i> 开始分离';
    }
}

// 显示结果
function showResults() {
    // 更新结果文件名
    const videoFileName = inputFile.name.replace('.mp4', '_video.mp4');
    const audioFileName = inputFile.name.replace('.mp4', '_audio.m4a');
    
    videoFileInfo.textContent = videoFileName;
    audioFileInfo.textContent = audioFileName;
    
    // 切换到结果界面
    processingContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    // 添加动画效果
    resultContainer.classList.add('animated', 'fadeIn');
}

// 预览文件
function previewFile(type) {
    videoPlayer.style.display = 'none';
    audioPlayer.style.display = 'none';
    
    if (type === 'video' && videoData) {
        const videoBlob = new Blob([videoData.buffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        videoPlayer.src = videoUrl;
        videoPlayer.style.display = 'block';
        previewTitle.textContent = '视频预览';
        
        // 显示预览模态框
        previewModal.classList.add('active');
    } else if (type === 'audio' && audioData) {
        const audioBlob = new Blob([audioData.buffer], { type: 'audio/m4a' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        previewTitle.textContent = '音频预览';
        
        // 显示预览模态框
        previewModal.classList.add('active');
    }
}

// 关闭预览
function closePreview() {
    previewModal.classList.remove('active');
    
    // 暂停播放
    videoPlayer.pause();
    audioPlayer.pause();
    
    // 延迟清除资源
    setTimeout(() => {
        videoPlayer.src = '';
        audioPlayer.src = '';
    }, 300);
}

// 下载文件
function downloadFile(type) {
    if (type === 'video' && videoData) {
        const videoBlob = new Blob([videoData.buffer], { type: 'video/mp4' });
        const videoFileName = inputFile.name.replace('.mp4', '_video.mp4');
        
        downloadBlob(videoBlob, videoFileName);
    } else if (type === 'audio' && audioData) {
        const audioBlob = new Blob([audioData.buffer], { type: 'audio/m4a' });
        const audioFileName = inputFile.name.replace('.mp4', '_audio.m4a');
        
        downloadBlob(audioBlob, audioFileName);
    }
}

// 下载所有文件（压缩包）
async function downloadAll() {
    if (!videoData || !audioData) return;
    
    try {
        downloadAllBtn.disabled = true;
        downloadAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在打包...';
        
        // 创建 ZIP 文件
        const zip = new JSZip();
        
        const videoFileName = inputFile.name.replace('.mp4', '_video.mp4');
        const audioFileName = inputFile.name.replace('.mp4', '_audio.m4a');
        
        zip.file(videoFileName, videoData);
        zip.file(audioFileName, audioData);
        
        // 生成 ZIP
        const zipContent = await zip.generateAsync({ type: 'blob' });
        
        // 下载 ZIP 文件
        const zipFileName = inputFile.name.replace('.mp4', '_分离文件.zip');
        downloadBlob(zipContent, zipFileName);
    } catch (error) {
        console.error('打包出错:', error);
        showError('打包过程中出现错误，请重试');
    } finally {
        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = '<i class="fas fa-file-archive"></i> 下载全部（压缩包）';
    }
}

// 取消处理
function cancelProcessing() {
    if (isProcessing) {
        // 实际上 FFmpeg.wasm 不支持直接取消任务，这里只是重置界面
        isProcessing = false;
    }
    
    resetApp();
}

// 重置应用
function resetApp() {
    // 重置变量
    inputFile = null;
    videoData = null;
    audioData = null;
    isProcessing = false;
    
    // 重置界面
    processingContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    uploadContainer.style.display = 'block';
    
    // 重置进度条
    progressFill.style.width = '0%';
    progressPercentage.textContent = '0%';
    progressText.textContent = '正在处理...';
    
    // 添加动画效果
    uploadContainer.classList.add('animated', 'fadeIn');
}

// 处理 FFmpeg 进度
function handleFFmpegProgress(progress) {
    if (isProcessing) {
        const percent = Math.floor(progress.ratio * 100);
        progressFill.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
    }
}

// 显示错误
function showError(message) {
    alert(message);
}

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 读取文件为 ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        
        reader.readAsArrayBuffer(file);
    });
}

// 下载 Blob
function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// 添加模拟进度的函数（仅用于改善用户体验）
function simulateProgress() {
    let percent = 0;
    const interval = setInterval(() => {
        percent += 1;
        
        if (percent > 95) {
            clearInterval(interval);
            return;
        }
        
        progressFill.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
    }, 150);
    
    return interval;
}

// 检测浏览器兼容性
function checkBrowserCompatibility() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    
    if (!(isChrome || isFirefox || isEdge)) {
        alert('为了最佳体验，请使用 Chrome、Firefox 或 Edge 浏览器');
    }
}

// 在页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    // 检查浏览器兼容性
    checkBrowserCompatibility();
    
    // 初始化应用
    init().catch(err => {
        console.error('初始化 FFmpeg 失败:', err);
        alert('加载处理引擎失败，请刷新页面重试');
    });
}); 