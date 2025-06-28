// Enhanced Horizontal Scroll - Улучшенный горизонтальный скролл с momentum и velocity эффектами
class EnhancedHorizontalScroll {
    constructor() {
        this.container = null;
        this.panels = [];
        this.currentPanel = 0;
        this.totalPanels = 0;
        this.scrollVelocity = 0;
        this.lastScrollY = 0;
        this.momentumValue = 0;
        this.isInitialized = false;
        this.velocityParticles = [];
        
        // Настройки скролла
        this.config = {
            momentum: 0.8,
            velocityMultiplier: 0.05,
            maxVelocity: 20,
            smoothness: 1.2,
            particleCount: 20,
            particleLifetime: 2.0,
            snapThreshold: 0.3
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Инициализация Enhanced Horizontal Scroll...');
        
        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP не найден для Enhanced Horizontal Scroll');
            return;
        }
        
        this.findScrollElements();
        this.setupHorizontalScroll();
        this.setupVelocityTracking();
        this.setupMomentumIndicator();
        this.setupVelocityParticles();
        this.setupControls();
        
        this.isInitialized = true;
        console.log('✅ Enhanced Horizontal Scroll инициализирован');
    }
    
    findScrollElements() {
        this.container = document.querySelector('.enhanced-horizontal-container');
        this.panels = Array.from(document.querySelectorAll('.enhanced-horizontal-panel'));
        this.totalPanels = this.panels.length;
        
        if (!this.container) {
            console.warn('⚠️ Enhanced horizontal container не найден');
            return;
        }
        
        console.log(`🎯 Найдено ${this.totalPanels} панелей для горизонтального скролла`);
    }
    
    setupHorizontalScroll() {
        if (!this.container || this.panels.length === 0) return;
        
        const section = document.querySelector('.enhanced-horizontal-demo-section');
        if (!section) {
            console.warn('⚠️ Enhanced horizontal demo section не найдена');
            return;
        }
        
        // Создаем основной ScrollTrigger для горизонтального скролла
        this.scrollTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => "+=" + (this.container.scrollWidth - window.innerWidth),
            pin: true,
            scrub: this.config.smoothness,
            snap: {
                snapTo: 1 / (this.totalPanels - 1),
                duration: { min: 0.2, max: 0.6 },
                delay: 0.1,
                ease: "power2.inOut"
            },
            onUpdate: (self) => {
                this.updateHorizontalPosition(self.progress);
                this.updatePanelStates(self.progress);
            },
            onSnapComplete: (self) => {
                const newPanel = Math.round(self.progress * (this.totalPanels - 1));
                if (newPanel !== this.currentPanel) {
                    this.currentPanel = newPanel;
                    this.onPanelChange(newPanel);
                }
            }
        });
        
        // Анимация для каждой панели
        this.panels.forEach((panel, index) => {
            this.setupPanelAnimations(panel, index);
        });
        
        console.log('✅ Горизонтальный скролл настроен');
    }
    
    updateHorizontalPosition(progress) {
        if (!this.container) return;
        
        // Базовое горизонтальное движение
        const xPos = -progress * (this.container.scrollWidth - window.innerWidth);
        
        // Добавляем velocity эффект
        const velocityOffset = this.scrollVelocity * this.config.velocityMultiplier;
        
        gsap.set(this.container, {
            x: xPos + velocityOffset,
            ease: "none"
        });
        
        // Обновляем momentum индикатор
        this.updateMomentumIndicator(progress);
    }
    
    updatePanelStates(progress) {
        const activeIndex = progress * (this.totalPanels - 1);
        
        this.panels.forEach((panel, index) => {
            const distance = Math.abs(index - activeIndex);
            const opacity = Math.max(0.3, 1 - distance * 0.3);
            const scale = Math.max(0.8, 1 - distance * 0.1);
            const blur = Math.min(5, distance * 2);
            
            gsap.set(panel, {
                opacity: opacity,
                scale: scale,
                filter: `blur(${blur}px)`,
                ease: "none"
            });
        });
    }
    
    setupPanelAnimations(panel, index) {
        const content = panel.querySelector('.enhanced-panel-content');
        if (!content) return;
        
        // Анимация появления контента панели
        gsap.set(content, {
            y: 50,
            opacity: 0,
            scale: 0.9
        });
        
        // ScrollTrigger для анимации контента
        ScrollTrigger.create({
            trigger: panel,
            start: "left 80%",
            end: "right 20%",
            horizontal: true,
            onEnter: () => {
                gsap.to(content, {
                    duration: 1,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "back.out(1.7)",
                    delay: index * 0.1
                });
                
                console.log(`🎬 Панель ${index + 1} анимация запущена`);
            },
            onLeave: () => {
                if (this.config.reverseOnLeave) {
                    gsap.to(content, {
                        duration: 0.5,
                        y: -30,
                        opacity: 0.5,
                        scale: 0.95,
                        ease: "power2.in"
                    });
                }
            }
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
                0.1
            );
            
            // Ограничиваем максимальную velocity
            this.scrollVelocity = gsap.utils.clamp(
                -this.config.maxVelocity,
                this.config.maxVelocity,
                this.scrollVelocity
            );
            
            this.lastScrollY = currentScrollY;
            ticking = false;
            
            // Создаем velocity частицы
            this.createVelocityParticles();
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateVelocity);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Затухание velocity
        gsap.ticker.add(() => {
            this.scrollVelocity *= 0.95;
            this.momentumValue = Math.abs(this.scrollVelocity) / this.config.maxVelocity;
        });
    }
    
    setupMomentumIndicator() {
        const indicator = document.querySelector('.momentum-indicator');
        if (!indicator) {
            console.warn('⚠️ Momentum indicator не найден');
            return;
        }
        
        this.momentumFill = indicator.querySelector('.momentum-fill');
        console.log('✅ Momentum indicator настроен');
    }
    
    updateMomentumIndicator(progress) {
        if (!this.momentumFill) return;
        
        const combinedValue = Math.max(this.momentumValue, progress);
        const hue = 240 + (combinedValue * 120); // От синего к розовому
        
        gsap.set(this.momentumFill, {
            height: `${combinedValue * 100}%`,
            background: `linear-gradient(to top, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 70%))`
        });
    }
    
    setupVelocityParticles() {
        const section = document.querySelector('.enhanced-horizontal-demo-section');
        if (!section) return;
        
        // Создаем контейнер для частиц
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'velocity-particles-container';
        this.particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        section.appendChild(this.particleContainer);
        
        console.log('✅ Velocity particles контейнер создан');
    }
    
    createVelocityParticles() {
        if (!this.particleContainer || Math.abs(this.scrollVelocity) < 2) return;
        
        // Ограничиваем количество частиц
        if (this.velocityParticles.length >= this.config.particleCount) return;
        
        const particle = document.createElement('div');
        particle.className = 'velocity-particle';
        
        // Случайная позиция
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        
        this.particleContainer.appendChild(particle);
        this.velocityParticles.push(particle);
        
        // Анимация частицы
        const velocityDirection = this.scrollVelocity > 0 ? 1 : -1;
        const distance = Math.abs(this.scrollVelocity) * 10;
        
        gsap.fromTo(particle, {
            opacity: 0,
            scale: 0
        }, {
            duration: this.config.particleLifetime,
            opacity: 1,
            scale: 1.5,
            x: `+=${distance * velocityDirection}`,
            y: `+=${Math.random() * 100 - 50}`,
            ease: "power2.out",
            onComplete: () => {
                this.removeVelocityParticle(particle);
            }
        });
        
        // Fade out
        gsap.to(particle, {
            duration: this.config.particleLifetime * 0.7,
            opacity: 0,
            delay: this.config.particleLifetime * 0.3,
            ease: "power2.in"
        });
    }
    
    removeVelocityParticle(particle) {
        const index = this.velocityParticles.indexOf(particle);
        if (index > -1) {
            this.velocityParticles.splice(index, 1);
        }
        
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }
    
    onPanelChange(newPanel) {
        console.log(`🎯 Переход на панель ${newPanel + 1}`);
        
        // Дополнительные эффекты при смене панели
        const currentPanelElement = this.panels[newPanel];
        if (currentPanelElement) {
            // Pulse эффект для активной панели
            gsap.fromTo(currentPanelElement, {
                boxShadow: "0 0 0 rgba(255, 255, 255, 0.5)"
            }, {
                duration: 0.6,
                boxShadow: "0 0 50px rgba(255, 255, 255, 0.3)",
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
        
        // Интеграция с particle system если доступен
        if (window.particleSystem) {
            window.particleSystem.updateConfig({
                colors: this.getPanelColors(newPanel)
            });
        }
    }
    
    getPanelColors(panelIndex) {
        const colorSets = [
            ['#667eea', '#764ba2'],
            ['#764ba2', '#f093fb'],
            ['#f093fb', '#f5576c'],
            ['#f5576c', '#4facfe'],
            ['#4facfe', '#00f2fe']
        ];
        
        return colorSets[panelIndex % colorSets.length];
    }
    
    setupControls() {
        // Контролы для настройки горизонтального скролла
        const momentumSlider = document.getElementById('momentumValue');
        const smoothnessSlider = document.getElementById('smoothnessValue');
        const velocitySlider = document.getElementById('velocityMultiplier');
        const particleSlider = document.getElementById('particleCount');
        
        const momentumValue = document.getElementById('momentumDisplay');
        const smoothnessValue = document.getElementById('smoothnessDisplay');
        const velocityValue = document.getElementById('velocityDisplay');
        const particleValue = document.getElementById('particleDisplay');
        
        // Momentum control
        if (momentumSlider && momentumValue) {
            momentumSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.momentum = value;
                momentumValue.textContent = value.toFixed(1);
                console.log(`🎛️ Momentum: ${value}`);
            });
        }
        
        // Smoothness control
        if (smoothnessSlider && smoothnessValue) {
            smoothnessSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.smoothness = value;
                smoothnessValue.textContent = value.toFixed(1);
                
                // Обновляем ScrollTrigger
                if (this.scrollTrigger) {
                    this.scrollTrigger.vars.scrub = value;
                    this.scrollTrigger.refresh();
                }
                
                console.log(`🎛️ Smoothness: ${value}`);
            });
        }
        
        // Velocity multiplier control
        if (velocitySlider && velocityValue) {
            velocitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.velocityMultiplier = value;
                velocityValue.textContent = value.toFixed(3);
                console.log(`🎛️ Velocity multiplier: ${value}`);
            });
        }
        
        // Particle count control
        if (particleSlider && particleValue) {
            particleSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.config.particleCount = value;
                particleValue.textContent = value;
                console.log(`🎛️ Particle count: ${value}`);
            });
        }
        
        // Reset button
        const resetButton = document.getElementById('resetHorizontal');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
                console.log('🔄 Horizontal scroll настройки сброшены');
            });
        }
        
        console.log('🎛️ Enhanced Horizontal контролы настроены');
    }
    
    resetToDefaults() {
        // Сбрасываем настройки к значениям по умолчанию
        this.config = {
            momentum: 0.8,
            velocityMultiplier: 0.05,
            maxVelocity: 20,
            smoothness: 1.2,
            particleCount: 20,
            particleLifetime: 2.0,
            snapThreshold: 0.3
        };
        
        // Обновляем слайдеры
        const momentumSlider = document.getElementById('momentumValue');
        const smoothnessSlider = document.getElementById('smoothnessValue');
        const velocitySlider = document.getElementById('velocityMultiplier');
        const particleSlider = document.getElementById('particleCount');
        
        if (momentumSlider) momentumSlider.value = this.config.momentum;
        if (smoothnessSlider) smoothnessSlider.value = this.config.smoothness;
        if (velocitySlider) velocitySlider.value = this.config.velocityMultiplier;
        if (particleSlider) particleSlider.value = this.config.particleCount;
        
        // Обновляем отображаемые значения
        const momentumValue = document.getElementById('momentumDisplay');
        const smoothnessValue = document.getElementById('smoothnessDisplay');
        const velocityValue = document.getElementById('velocityDisplay');
        const particleValue = document.getElementById('particleDisplay');
        
        if (momentumValue) momentumValue.textContent = this.config.momentum.toFixed(1);
        if (smoothnessValue) smoothnessValue.textContent = this.config.smoothness.toFixed(1);
        if (velocityValue) velocityValue.textContent = this.config.velocityMultiplier.toFixed(3);
        if (particleValue) particleValue.textContent = this.config.particleCount;
        
        // Обновляем ScrollTrigger
        if (this.scrollTrigger) {
            this.scrollTrigger.vars.scrub = this.config.smoothness;
            this.scrollTrigger.refresh();
        }
    }
    
    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('🔧 Enhanced Horizontal конфигурация обновлена:', this.config);
    }
    
    goToPanel(panelIndex) {
        if (panelIndex < 0 || panelIndex >= this.totalPanels) return;
        
        const progress = panelIndex / (this.totalPanels - 1);
        
        if (this.scrollTrigger) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: this.scrollTrigger.start + (this.scrollTrigger.end - this.scrollTrigger.start) * progress
                },
                ease: "power2.inOut"
            });
        }
        
        console.log(`🎯 Переход к панели ${panelIndex + 1}`);
    }
    
    pause() {
        if (this.scrollTrigger) {
            this.scrollTrigger.disable();
        }
        console.log('⏸️ Enhanced Horizontal Scroll приостановлен');
    }
    
    resume() {
        if (this.scrollTrigger) {
            this.scrollTrigger.enable();
        }
        console.log('▶️ Enhanced Horizontal Scroll возобновлен');
    }
    
    destroy() {
        // Удаляем ScrollTrigger
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
        }
        
        // Очищаем velocity частицы
        this.velocityParticles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.velocityParticles = [];
        
        // Удаляем контейнер частиц
        if (this.particleContainer && this.particleContainer.parentNode) {
            this.particleContainer.parentNode.removeChild(this.particleContainer);
        }
        
        this.isInitialized = false;
        console.log('🗑️ Enhanced Horizontal Scroll уничтожен');
    }
    
    // Дебаг информация
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            totalPanels: this.totalPanels,
            currentPanel: this.currentPanel,
            scrollVelocity: this.scrollVelocity.toFixed(2),
            momentumValue: this.momentumValue.toFixed(2),
            velocityParticlesCount: this.velocityParticles.length,
            config: this.config
        };
    }
}

// Экспорт для использования в других модулях
window.EnhancedHorizontalScroll = EnhancedHorizontalScroll;

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация будет происходить в main.js
    });
}
