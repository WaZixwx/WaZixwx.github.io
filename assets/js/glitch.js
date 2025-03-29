/**
 * 故障文字效果
 * 
 * 为带有 .glitch-text 类的元素添加动态故障效果
 */
(function() {
    // 获取所有故障文字元素
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    // 为每个元素添加故障效果
    glitchElements.forEach(element => {
        // 获取原始文本
        const text = element.textContent;
        
        // 设置data-text属性
        element.setAttribute('data-text', text);
        
        // 随机添加闪烁效果
        setInterval(() => {
            // 随机决定是否闪烁
            if (Math.random() > 0.95) {
                element.style.opacity = '0.9';
                
                // 随机延迟后恢复
                setTimeout(() => {
                    element.style.opacity = '1';
                }, Math.random() * 100);
            }
        }, 500);
    });
    
    // 鼠标悬停效果增强
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('glitch-hover');
            
            // 随机扭曲变形
            const interval = setInterval(() => {
                const x = Math.random() * 4 - 2; // -2到2之间的值
                const y = Math.random() * 4 - 2; // -2到2之间的值
                const skewX = Math.random() * 2 - 1; // -1到1之间的值
                const skewY = Math.random() * 2 - 1; // -1到1之间的值
                
                element.style.transform = `translate(${x}px, ${y}px) skew(${skewX}deg, ${skewY}deg)`;
            }, 50);
            
            // 保存interval ID以便离开时清除
            element.dataset.glitchInterval = interval;
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('glitch-hover');
            element.style.transform = '';
            
            // 清除interval
            clearInterval(element.dataset.glitchInterval);
        });
    });
})();
