/**
 * Story Sections Component - YOOY Style Clip-Path Transitions
 * Реализует pinned story sections с clip-path circle reveal переходами
 */

class StorySections {
    constructor() {
        this.container = document.getElementById('story-container');
        this.scenes = document.querySelectorAll('.c-story__scene');
        this.backgrounds = document.querySelectorAll('.c-story__bg');
        this.progressFill = document.querySelector('.story-progress__fill');
        this.progressCurrent = document.querySelector('.story-progress__current');
        
        this.currentScene = 0;
        this.totalScenes = this.scenes.length;
        this.isAnimating = false;
        
        // Настройки по умолчанию
        this.settings = {
            duration: 1.5,
            circleSize: 150,
            circleX: 50,
            circleY: 50
        };
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.setupScrollTrigger();
        this.setupControls();
        this.updateProgress();
        
        console.log('Story Sections initialized');
    }
    
    setupScrollTrigger() {
        // Регистрируем ScrollTrigger плагин
        gsap.registerPlugin(ScrollTrigger);
        
        // Создаем ScrollTrigger для pinning контейнера
        ScrollTrigger.create({
            trigger: '.story-sections-demo-section',
            start: 'top top',
            end: 'bottom bottom',
            pin: '.c-story',
            pinSpacing: false,
            onUpdate: (self) => {
                this.handleScrollProgress(self.progress);
            }
        });
    }
    
    handleScrollProgress(progress) {
        // Определяем текущую секцию на основе прогресса скролла
        const targetScene = Math.floor(progress * this.totalScenes);
        const clampedScene = Math.min(targetScene, this.totalScenes - 1);
        
        if (clampedScene !== this.currentScene && !this.isAnimating) {
            this.goToScene(clampedScene);
        }
    }
    
    goToScene(sceneIndex) {
        if (sceneIndex === this.currentScene || this.isAnimating) return;
        
        this.isAnimating = true;
        const previousScene = this.currentScene;
        this.currentScene = sceneIndex;
        
        // Анимируем переход между секциями
        this.animateTransition(previousScene, sceneIndex);
        
        // Обновляем прогресс
        this.updateProgress();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.settings.duration * 1000);
    }
    
    animateTransition(fromScene, toScene) {
        const direction = toScene > fromScene ? 'forward' : 'backward';
        
        // Скрываем предыдущую секцию
        if (this.scenes[fromScene]) {
            gsap.to(this.scenes[fromScene], {
                opacity: 0,
                y: direction === 'forward' ? -30 : 30,
                duration: this.settings.duration * 0.5,
                ease: 'power2.out'
            });
        }
        
        // Анимируем clip-path для фона
        if (this.backgrounds[toScene]) {
            const circleSize = this.settings.circleSize;
            const circleX = this.settings.circleX;
            const circleY = this.settings.circleY;
            
            gsap.to(this.backgrounds[toScene], {
                clipPath: `circle(${circleSize}% at ${circleX}% ${circleY}%)`,
                duration: this.settings.duration,
                ease: 'power2.inOut'
            });
        }
        
        // Показываем новую секцию с задержкой
        setTimeout(() => {
            if (this.scenes[toScene]) {
                gsap.fromTo(this.scenes[toScene], 
                    {
                        opacity: 0,
                        y: direction === 'forward' ? 30 : -30,
                        visibility: 'visible'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: this.settings.duration * 0.5,
                        ease: 'power2.out'
                    }
                );
            }
        }, this.settings.duration * 500);
    }
    
    updateProgress() {
        const progressPercent = ((this.currentScene + 1) / this.totalScenes) * 100;
        
        if (this.progressFill) {
            gsap.to(this.progressFill, {
                height: `${progressPercent}%`,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
        
        if (this.progressCurrent) {
            this.progressCurrent.textContent = this.currentScene + 1;
        }
    }
    
    setupControls() {
        // Настройка контролов
        this.setupRangeControl('storyDuration', 'duration', (value) => `${value}s`);
        this.setupRangeControl('circleSize', 'circleSize', (value) => `${value}%`);
        this.setupRangeControl('circleX', 'circleX', (value) => `${value}%`);
        this.setupRangeControl('circleY', 'circleY', (value) => `${value}%`);
        
        // Кнопки навигации
        const prevBtn = document.getElementById('storyPrev');
        const nextBtn = document.getElementById('storyNext');
        const resetBtn = document.getElementById('storyReset');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousScene());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextScene());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }
    
    setupRangeControl(inputId, settingKey, formatter) {
        const input = document.getElementById(inputId);
        const display = document.getElementById(`${inputId}Value`);
        
        if (input && display) {
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.settings[settingKey] = value;
                display.textContent = formatter(value);
            });
        }
    }
    
    previousScene() {
        if (this.currentScene > 0) {
            this.goToScene(this.currentScene - 1);
        }
    }
    
    nextScene() {
        if (this.currentScene < this.totalScenes - 1) {
            this.goToScene(this.currentScene + 1);
        }
    }
    
    reset() {
        // Сброс всех clip-path анимаций
        this.backgrounds.forEach((bg, index) => {
            if (index > 0) {
                gsap.set(bg, {
                    clipPath: `circle(0% at ${this.settings.circleX}% ${this.settings.circleY}%)`
                });
            }
        });
        
        // Сброс секций
        this.scenes.forEach((scene, index) => {
            gsap.set(scene, {
                opacity: index === 0 ? 1 : 0,
                visibility: index === 0 ? 'visible' : 'hidden',
                y: 0
            });
        });
        
        this.currentScene = 0;
        this.updateProgress();
        
        console.log('Story Sections reset');
    }
    
    // Публичные методы для внешнего управления
    getCurrentScene() {
        return this.currentScene;
    }
    
    getTotalScenes() {
        return this.totalScenes;
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    destroy() {
        // Очистка ScrollTrigger
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === '.story-sections-demo-section') {
                trigger.kill();
            }
        });
        
        console.log('Story Sections destroyed');
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие GSAP и ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        window.storySections = new StorySections();
    } else {
        console.warn('GSAP or ScrollTrigger not loaded. Story Sections disabled.');
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorySections;
}
