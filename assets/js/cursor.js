/**
 * 自定义鼠标指针效果
 * 
 * 创建炫酷的鼠标跟随效果，包括点击、悬停等交互
 */
(function() {
    // DOM加载检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor);
    } else {
        initCursor();
    }
    
    function initCursor() {
        // 获取鼠标相关元素
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        // 如果元素不存在，退出
        if (!cursorDot || !cursorOutline) return;
        
        // 初始位置（避免页面加载时闪烁）
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        
        // 在开场动画期间隐藏鼠标指针
        const introAnimationElement = document.querySelector('.intro-animation');
        if (introAnimationElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        // 当开场动画开始时
                        if (introAnimationElement.classList.contains('active')) {
                            // 确保鼠标指针隐藏
                            cursorDot.style.opacity = '0';
                            cursorOutline.style.opacity = '0';
                        }
                        
                        // 当开场动画结束时
                        if (introAnimationElement.classList.contains('exit')) {
                            // 显示鼠标指针
                            setTimeout(() => {
                                cursorDot.style.opacity = '1';
                                cursorOutline.style.opacity = '1';
                            }, 500);
                        }
                    }
                });
            });
            
            // 开始观察intro-animation元素的class变化
            observer.observe(introAnimationElement, { attributes: true });
        }
        // 鼠标位置变量
        let mouseX = 0;
        let mouseY = 0;
        
        // 实际元素位置（用于平滑动画）
        let dotX = 0;
        let dotY = 0;
        let outlineX = 0;
        let outlineY = 0;
        
        // 鼠标事件监听器
        document.addEventListener('mousemove', trackMouse);
        document.addEventListener('mousedown', cursorDown);
        document.addEventListener('mouseup', cursorUp);
        document.addEventListener('mouseleave', cursorLeave);
        document.addEventListener('mouseenter', cursorEnter);
        
        // 启动动画循环
        requestAnimationFrame(animateCursor);
        
        /**
         * 追踪鼠标位置
         */
        function trackMouse(e) {
            // 更新鼠标位置
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
        
        /**
         * 鼠标按下事件
         */
        function cursorDown() {
            cursorDot.classList.add('active');
            cursorOutline.classList.add('active');
        }
        
        /**
         * 鼠标释放事件
         */
        function cursorUp() {
            cursorDot.classList.remove('active');
            cursorOutline.classList.remove('active');
        }
        
        /**
         * 鼠标离开页面
         */
        function cursorLeave() {
            cursorDot.classList.add('hidden');
            cursorOutline.classList.add('hidden');
        }
        
        /**
         * 鼠标进入页面
         */
        function cursorEnter() {
            cursorDot.classList.remove('hidden');
            cursorOutline.classList.remove('hidden');
        }
        
        /**
         * 平滑动画鼠标跟随
         */
        function animateCursor() {
            // 计算位置差异（用于平滑动画）
            const dotDiffX = mouseX - dotX;
            const dotDiffY = mouseY - dotY;
            const outlineDiffX = mouseX - outlineX;
            const outlineDiffY = mouseY - outlineY;
            
            // 应用平滑动画 - 优化跟随速度
            dotX += dotDiffX * 0.6;
            dotY += dotDiffY * 0.6;
            outlineX += outlineDiffX * 0.3;
            outlineY += outlineDiffY * 0.3;
            
            // 应用位置 - 优化位置计算
            cursorDot.style.transform = `translate3d(${Math.round(dotX - 4)}px, ${Math.round(dotY - 4)}px, 0)`;
            cursorOutline.style.transform = `translate3d(${Math.round(outlineX - 20)}px, ${Math.round(outlineY - 20)}px, 0)`;
            
            // 继续动画循环
            requestAnimationFrame(animateCursor);
        }
        
        // 页面加载完成后显示鼠标
        setTimeout(() => {
            // 显示完整鼠标（包括dot和outline）
            cursorDot.style.opacity = '';
            cursorOutline.style.opacity = '';
        }, 1000);
    }
})();
