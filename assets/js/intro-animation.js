/**
 * WaZixwx 个人网站开场动画控制
 * 创建高级、精美、扁平化的开场动画效果
 */

// 为网格线添加索引以实现交错动画
document.addEventListener('DOMContentLoaded', () => {
    initGridLines();
    initShapes();
    setupParticles();
});

/**
 * 初始化网格线，设置索引
 */
function initGridLines() {
    const gridLines = document.querySelectorAll('.grid-line');
    
    if (gridLines.length > 0) {
        // 水平行
        const horizontalLines = Math.sqrt(gridLines.length);
        
        gridLines.forEach((line, index) => {
            // 设置交错动画的索引
            line.style.setProperty('--index', index);
            
            // 为网格线添加额外类以区分水平和垂直
            const row = Math.floor(index / horizontalLines);
            const col = index % horizontalLines;
            
            if (row === 0) {
                line.classList.add('grid-top');
            }
            if (col === 0) {
                line.classList.add('grid-left');
            }
            if (row === horizontalLines - 1) {
                line.classList.add('grid-bottom');
            }
            if (col === horizontalLines - 1) {
                line.classList.add('grid-right');
            }
        });
    }
}

/**
 * 初始化形状，设置额外的旋转和动画延迟
 */
function initShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // 设置不同的动画延迟
        shape.style.setProperty('--delay', `${0.2 * (index + 1)}s`);
        
        // 设置不同的旋转角度
        if (shape.classList.contains('square')) {
            shape.style.setProperty('--rotate', '45deg');
        } else if (shape.classList.contains('hexagon')) {
            shape.style.setProperty('--rotate', '30deg');
        } else if (shape.classList.contains('triangle')) {
            shape.style.setProperty('--rotate', '0deg');
        } else {
            shape.style.setProperty('--rotate', '0deg');
        }
    });
}

/**
 * 设置粒子背景效果
 */
function setupParticles() {
    const introContent = document.querySelector('.intro-content');
    
    if (!introContent) return;
    
    // 创建粒子容器
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    introContent.appendChild(particlesContainer);
    
    // 生成粒子
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        
        // 随机动画延迟
        const delay = Math.random() * 5;
        
        // 随机透明度
        const opacity = Math.random() * 0.5 + 0.1;
        
        // 应用样式
        particle.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            animation-delay: ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * 开场动画控制类
 * 用于管理开场动画序列和过渡
 */
class IntroAnimation {
    constructor() {
        this.introElement = document.querySelector('.intro-animation');
        this.heroSection = document.querySelector('.hero-section');
        this.initialized = false;
        this.loadCompleted = false;
        this.animationTimeline = [];
    }

    /**
     * 初始化动画控制器
     */
    init() {
        if (this.initialized) return;
        this.initialized = true;

        // 监听页面加载完成
        window.addEventListener('load', () => {
            this.loadCompleted = true;
            
            // 如果loader已经被移除，直接开始开场动画
            if (!document.querySelector('.loader-wrapper')) {
                this.startIntroSequence();
            }
        });

        // 定义一个可以在其他地方调用的方法来开始序列
        window.startIntroAnimation = () => this.startIntroSequence();
    }

    /**
     * 开始动画序列
     */
    startIntroSequence() {
        // 确保元素存在
        if (!this.introElement || !this.heroSection) return;

        // 显示开场动画
        this.introElement.style.opacity = '1';
        this.introElement.style.visibility = 'visible';
        
        // 确保网格线和形状已正确初始化
        initGridLines();
        initShapes();
        
        // 创建CSS变量控制全局动画速度
        document.documentElement.style.setProperty('--animation-speed', '1');
        
        // 触发开场动画
        setTimeout(() => {
            this.introElement.classList.add('active');
            this.playSequence();
        }, 100);
    }
    
    /**
     * 播放动画序列
     */
    playSequence() {
        // 设置关闭动画的定时器
        this.animationTimeline = [
            { time: 5500, action: () => this.startExitAnimation() },
            { time: 6500, action: () => this.completeAnimation() }
        ];
        
        // 执行动画时间线
        this.animationTimeline.forEach(item => {
            setTimeout(item.action, item.time);
        });
    }
    
    /**
     * 开始退出动画
     */
    startExitAnimation() {
        if (!this.introElement) return;
        this.introElement.classList.add('exit');
    }
    
    /**
     * 完成动画并转场到英雄部分
     */
    completeAnimation() {
        if (!this.introElement || !this.heroSection) return;
        
        this.introElement.style.display = 'none';
        this.heroSection.classList.add('animate-in');
        
        // 添加滚动触发的渐显效果
        this.setupScrollAnimations();
    }
    
    /**
     * 设置滚动触发的动画
     */
    setupScrollAnimations() {
        const sections = document.querySelectorAll('section:not(#home)');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            section.classList.add('section-hidden');
            sectionObserver.observe(section);
        });
    }
}

// 初始化动画控制器
const introAnim = new IntroAnimation();
introAnim.init();

// 添加CSS类
document.addEventListener('DOMContentLoaded', () => {
    // 创建粒子样式
    const style = document.createElement('style');
    style.textContent = `
        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            background: linear-gradient(120deg, rgba(252, 203, 144, 0.8), rgba(213, 126, 235, 0.8));
            border-radius: 50%;
            pointer-events: none;
            animation: float 20s infinite linear;
        }
        
        .section-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .section-animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
