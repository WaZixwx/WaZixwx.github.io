/**
 * WaZixwx 个人网站开场动画控制
 * 创建高级、精美、扁平化的开场动画效果
 */

// 为网格线添加索引以实现交错动画
document.addEventListener('DOMContentLoaded', () => {
    initGridLines();
    initShapes();
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
 * 开场动画控制类
 * 用于管理开场动画序列和过渡
 */
class IntroAnimation {
    constructor() {
        this.introElement = document.querySelector('.intro-animation');
        this.heroSection = document.querySelector('.hero-section');
        this.initialized = false;
        this.loadCompleted = false;
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
        
        // 触发开场动画
        setTimeout(() => {
            this.introElement.classList.add('active');
        }, 100);

        // 设置关闭动画的定时器
        setTimeout(() => {
            this.introElement.classList.add('exit');
            
            // 开场动画结束后显示英雄部分
            setTimeout(() => {
                this.introElement.style.display = 'none';
                this.heroSection.classList.add('animate-in');
            }, 1000);
        }, 5000); // 开场动画持续5秒后退出
    }
}

// 初始化动画控制器
const introAnim = new IntroAnimation();
introAnim.init();
