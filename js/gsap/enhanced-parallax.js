// Enhanced Parallax - Многослойный параллакс с velocity-based эффектами
class EnhancedParallax {
    constructor() {
        this.layers = [];
        this.floatingElements = [];
        this.scrollVelocity = 0;
        this.lastScrollY = 0;
        this.velocitySmoothing = 0.1;
        this.isInitialized = false;
        
        // Настройки параллакса
        this.config = {
            layer1Speed: 0.2,
            layer2Speed: 0.5,
            layer3Speed: 0.8,
            floatingSpeed: 0.3,
            velocityMultiplier: 0.1,
            maxVelocity: 10
        };
        
        this.init();
    }
    
    init() {
        console.log('🌊 Инициализация Enhanced Parallax...');
        
        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP не найден для Enhanced Parallax');
            return;
        }
        
        this.findParallaxElements();
        this.setupScrollTriggers();
        this.setupVelocityTracking();
        this.setupControls();
        
        this.isInitialized = true;
        console.log('✅ Enhanced Parallax инициализирован');
    }
    
    findParallaxElements() {
        // Находим все parallax слои
        this.layers = [
            {
                element: document.querySelector('.parallax-layer-1'),
                speed: this.config.layer1Speed,
                name: 'Layer 1'
            },
            {
                element: document.querySelector('.parallax-layer-2'),
                speed: this.config.layer2Speed,
                name: 'Layer 2'
            },
            {
                element: document.querySelector('.parallax-layer-3'),
                speed: this.config.layer3Speed,
                name: 'Layer 3'
            }
        ];
        
        // Находим floating элементы
        this.floatingElements = Array.from(document.querySelectorAll('.parallax-floating-element'));
        
        console.log(`🎯 Найдено ${this.layers.length} parallax слоев и ${this.floatingElements.length} floating элементов`);
    }
    
    setupScrollTriggers() {
        const section = document.querySelector('.parallax-demo-section');
        if (!section) {
            console.warn('⚠️ Parallax demo section не найдена');
            return;
        }
        
        // Основной ScrollTrigger для секции
        ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                this.updateParallax(self.progress);
            },
            onToggle: (self) => {
                if (self.isActive) {
                    console.log('🎬 Parallax секция активна');
                } else {
                    console.log('⏸️ Parallax секция неактивна');
                }
            }
        });
        
        // Отдельные ScrollTriggers для каждого слоя
        this.layers.forEach((layer, index) => {
            if (layer.element) {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const yPos = progress * 100 * layer.speed;
                        
                        gsap.set(layer.element, {
                            yPercent: -yPos,
                            ease: "none"
                        });
                    }
                });
                
                console.log(`✅ ScrollTrigger настроен для ${layer.name}`);
            }
        });
        
        // ScrollTrigger для floating элементов
        this.floatingElements.forEach((element, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    const progress = self.progress;
                    const baseY = progress * 50 * this.config.floatingSpeed;
                    const velocityY = this.scrollVelocity * this.config.velocityMultiplier;
                    const rotation = progress * 360 + (this.scrollVelocity * 2);
                    
                    gsap.set(element, {
                        yPercent: -(baseY + velocityY),
                        rotation: rotation,
                        scale: 1 + (Math.abs(this.scrollVelocity) * 0.01),
                        ease: "none"
                    });
                }
            });
        });
    }
    
    setupVelocityTracking() {
        let ticking = false;
        
        const updateVelocity = () => {
            const currentScrollY = window.pageYOffset;
            const rawVelocity = currentScrollY - this.lastScrollY;
            
            // Сглаживаем velocity
            this.scrollVelocity = gsap.utils.interpolate(
                this.scrollVelocity,
                rawVelocity,
                this.velocitySmoothing
            );
            
            // Ограничиваем максимальную velocity
            this.scrollVelocity = gsap.utils.clamp(
                -this.config.maxVelocity,
                this.config.maxVelocity,
                this.scrollVelocity
            );
            
            this.lastScrollY = currentScrollY;
            ticking = false;
            
            // Обновляем velocity индикатор если есть
            this.updateVelocityIndicator();
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateVelocity);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Затухание velocity когда скролл останавливается
        gsap.ticker.add(() => {
            this.scrollVelocity *= 0.95; // Постепенное затухание
        });
    }
    
    updateParallax(progress) {
        // Дополнительные эффекты основанные на прогрессе
        const section = document.querySelector('.parallax-demo-section');
        if (section) {
            // Изменяем opacity фона в зависимости от прогресса
            const opacity = 1 - (progress * 0.3);
            gsap.set(section, {
                '--bg-opacity': opacity
            });
        }
    }
    
    updateVelocityIndicator() {
        const indicator = document.querySelector('.velocity-indicator');
        if (indicator) {
            const normalizedVelocity = Math.abs(this.scrollVelocity) / this.config.maxVelocity;
            gsap.set(indicator, {
                scaleY: normalizedVelocity,
                backgroundColor: `hsl(${240 + (normalizedVelocity * 60)}, 70%, 60%)`
            });
        }
    }
    
    setupControls() {
        // Контролы для настройки параллакса
        const layer1Slider = document.getElementById('layer1Speed');
        const layer2Slider = document.getElementById('layer2Speed');
        const layer3Slider = document.getElementById('layer3Speed');
        const velocitySlider = document.getElementById('velocityMultiplier');
        
        const layer1Value = document.getElementById('layer1Value');
        const layer2Value = document.getElementById('layer2Value');
        const layer3Value = document.getElementById('layer3Value');
        const velocityValue = document.getElementById('velocityValue');
        
        // Layer 1 Speed
        if (layer1Slider && layer1Value) {
            layer1Slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.layer1Speed = value;
                layer1Value.textContent = value.toFixed(1);
                this.layers[0].speed = value;
                console.log(`🎛️ Layer 1 speed: ${value}`);
            });
        }
        
        // Layer 2 Speed
        if (layer2Slider && layer2Value) {
            layer2Slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.layer2Speed = value;
                layer2Value.textContent = value.toFixed(1);
                this.layers[1].speed = value;
                console.log(`🎛️ Layer 2 speed: ${value}`);
            });
        }
        
        // Layer 3 Speed
        if (layer3Slider && layer3Value) {
            layer3Slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.layer3Speed = value;
                layer3Value.textContent = value.toFixed(1);
                this.layers[2].speed = value;
                console.log(`🎛️ Layer 3 speed: ${value}`);
            });
        }
        
        // Velocity Multiplier
        if (velocitySlider && velocityValue) {
            velocitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.velocityMultiplier = value;
                velocityValue.textContent = value.toFixed(2);
                console.log(`🎛️ Velocity multiplier: ${value}`);
            });
        }
        
        // Reset button
        const resetButton = document.getElementById('resetParallax');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
                console.log('🔄 Parallax настройки сброшены');
            });
        }
        
        console.log('🎛️ Parallax контролы настроены');
    }
    
    resetToDefaults() {
        // Сбрасываем настройки к значениям по умолчанию
        this.config = {
            layer1Speed: 0.2,
            layer2Speed: 0.5,
            layer3Speed: 0.8,
            floatingSpeed: 0.3,
            velocityMultiplier: 0.1,
            maxVelocity: 10
        };
        
        // Обновляем слайдеры
        const layer1Slider = document.getElementById('layer1Speed');
        const layer2Slider = document.getElementById('layer2Speed');
        const layer3Slider = document.getElementById('layer3Speed');
        const velocitySlider = document.getElementById('velocityMultiplier');
        
        if (layer1Slider) layer1Slider.value = this.config.layer1Speed;
        if (layer2Slider) layer2Slider.value = this.config.layer2Speed;
        if (layer3Slider) layer3Slider.value = this.config.layer3Speed;
        if (velocitySlider) velocitySlider.value = this.config.velocityMultiplier;
        
        // Обновляем отображаемые значения
        const layer1Value = document.getElementById('layer1Value');
        const layer2Value = document.getElementById('layer2Value');
        const layer3Value = document.getElementById('layer3Value');
        const velocityValue = document.getElementById('velocityValue');
        
        if (layer1Value) layer1Value.textContent = this.config.layer1Speed.toFixed(1);
        if (layer2Value) layer2Value.textContent = this.config.layer2Speed.toFixed(1);
        if (layer3Value) layer3Value.textContent = this.config.layer3Speed.toFixed(1);
        if (velocityValue) velocityValue.textContent = this.config.velocityMultiplier.toFixed(2);
        
        // Обновляем скорости слоев
        this.layers.forEach((layer, index) => {
            if (index === 0) layer.speed = this.config.layer1Speed;
            if (index === 1) layer.speed = this.config.layer2Speed;
            if (index === 2) layer.speed = this.config.layer3Speed;
        });
    }
    
    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('🔧 Parallax конфигурация обновлена:', this.config);
    }
    
    pause() {
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger && trigger.trigger.closest('.parallax-demo-section')) {
                trigger.disable();
            }
        });
        console.log('⏸️ Parallax приостановлен');
    }
    
    resume() {
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger && trigger.trigger.closest('.parallax-demo-section')) {
                trigger.enable();
            }
        });
        console.log('▶️ Parallax возобновлен');
    }
    
    destroy() {
        // Удаляем все ScrollTriggers связанные с parallax
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger && trigger.trigger.closest('.parallax-demo-section')) {
                trigger.kill();
            }
        });
        
        this.isInitialized = false;
        console.log('🗑️ Enhanced Parallax уничтожен');
    }
    
    // Дебаг информация
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            layersCount: this.layers.length,
            floatingElementsCount: this.floatingElements.length,
            currentVelocity: this.scrollVelocity.toFixed(2),
            config: this.config
        };
    }
}

// Экспорт для использования в других модулях
window.EnhancedParallax = EnhancedParallax;

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация будет происходить в main.js
    });
}
