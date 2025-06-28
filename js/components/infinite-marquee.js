// Infinite Marquee Animations - YOOY Style Continuous Scrolling
// Система бесконечных marquee анимаций с интерактивными контролами

class InfiniteMarquee {
    constructor() {
        this.marquees = [];
        this.config = {
            // Основные настройки
            speed: 1.0,
            direction: 1, // 1 = влево, -1 = вправо
            pauseOnHover: true,
            iconRotation: true,
            
            // Скорости для разных marquee
            speeds: {
                awards: 1.0,
                partners: 0.8,
                services: 1.2,
                testimonials: 0.9
            },
            
            // Направления для разных marquee
            directions: {
                awards: 1,    // влево
                partners: -1, // вправо
                services: 1,  // влево
                testimonials: -1 // вправо
            }
        };
        
        this.isInitialized = false;
        this.animations = [];
        this.floatingIcons = [];
        
        this.init();
    }
    
    init() {
        console.log('🎠 Инициализация Infinite Marquee...');
        
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.createMarqueeContent();
        this.setupMarquees();
        this.setupFloatingIcons();
        this.setupControls();
        this.startAnimations();
        
        this.isInitialized = true;
        console.log('✅ Infinite Marquee инициализирован');
    }
    
    createMarqueeContent() {
        const section = document.querySelector('.infinite-marquee-demo-section');
        if (!section) return;
        
        // Создаем основную структуру
        section.innerHTML = `
            <!-- Floating Icons Background -->
            <div class="floating-icons-container">
                <div class="floating-icon">🏆</div>
                <div class="floating-icon">⚖️</div>
                <div class="floating-icon">📊</div>
                <div class="floating-icon">💼</div>
                <div class="floating-icon">🎯</div>
                <div class="floating-icon">⭐</div>
            </div>
            
            <!-- Main Content -->
            <div class="marquee-content">
                <h1 class="marquee-demo-title">Infinite Marquee</h1>
                <h2 class="marquee-demo-subtitle">YOOY Style Continuous Animations</h2>
                
                <!-- Awards Marquee -->
                <div class="marquee-container">
                    <div class="marquee-wrapper awards-marquee">
                        <div class="marquee-label">Awards & Recognition</div>
                        <div class="marquee-track" id="awards-track">
                            ${this.generateMarqueeItems('awards')}
                        </div>
                    </div>
                </div>
                
                <!-- Partners Marquee -->
                <div class="marquee-container">
                    <div class="marquee-wrapper partners-marquee">
                        <div class="marquee-label">Partners & Clients</div>
                        <div class="marquee-track" id="partners-track">
                            ${this.generateMarqueeItems('partners')}
                        </div>
                    </div>
                </div>
                
                <!-- Services Marquee -->
                <div class="marquee-container">
                    <div class="marquee-wrapper services-marquee">
                        <div class="marquee-label">Legal Services</div>
                        <div class="marquee-track" id="services-track">
                            ${this.generateMarqueeItems('services')}
                        </div>
                    </div>
                </div>
                
                <!-- Testimonials Marquee -->
                <div class="marquee-container">
                    <div class="marquee-wrapper testimonials-marquee">
                        <div class="marquee-label">Client Reviews</div>
                        <div class="marquee-track" id="testimonials-track">
                            ${this.generateMarqueeItems('testimonials')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Marquee Controls -->
            <div class="marquee-controls">
                <h3>Marquee Settings</h3>
                
                <div class="marquee-control-row">
                    <label>Global Speed:</label>
                    <span id="globalSpeedValue">1.0x</span>
                    <input type="range" id="globalSpeed" min="0.1" max="3" step="0.1" value="1.0">
                </div>
                
                <div class="marquee-control-row">
                    <label>Icon Rotation:</label>
                    <span id="iconRotationValue">360°</span>
                    <input type="range" id="iconRotation" min="0" max="720" step="30" value="360">
                </div>
                
                <div class="direction-toggle">
                    <button class="direction-btn active" data-direction="1">← Left</button>
                    <button class="direction-btn" data-direction="-1">Right →</button>
                </div>
                
                <div class="marquee-control-buttons">
                    <button id="pauseAll" class="marquee-control-btn">Pause All</button>
                    <button id="resumeAll" class="marquee-control-btn">Resume All</button>
                    <button id="toggleHover" class="marquee-control-btn active">Hover Pause</button>
                    <button id="rainbowMode" class="marquee-control-btn">Rainbow Mode</button>
                    <button id="resetMarquee" class="marquee-control-btn">Reset Settings</button>
                </div>
            </div>
        `;
    }
    
    generateMarqueeItems(type) {
        const items = {
            awards: [
                { icon: '🏆', text: 'Best Law Firm 2024' },
                { icon: '⭐', text: 'Top Legal Marketing' },
                { icon: '🥇', text: 'Excellence Award' },
                { icon: '🎖️', text: 'Industry Leader' },
                { icon: '🏅', text: 'Client Choice Award' },
                { icon: '👑', text: 'Premium Service' },
                { icon: '💎', text: 'Quality Recognition' },
                { icon: '🌟', text: 'Outstanding Results' }
            ],
            partners: [
                { icon: '🏢', text: 'Corporate Partners' },
                { icon: '🤝', text: 'Strategic Alliance' },
                { icon: '💼', text: 'Business Network' },
                { icon: '🌐', text: 'Global Reach' },
                { icon: '📈', text: 'Growth Partners' },
                { icon: '🔗', text: 'Strong Connections' },
                { icon: '🎯', text: 'Targeted Solutions' },
                { icon: '💡', text: 'Innovation Hub' }
            ],
            services: [
                { icon: '⚖️', text: 'Legal Consultation' },
                { icon: '📋', text: 'Document Review' },
                { icon: '🛡️', text: 'Legal Protection' },
                { icon: '📊', text: 'Case Analysis' },
                { icon: '💬', text: 'Client Advisory' },
                { icon: '🔍', text: 'Legal Research' },
                { icon: '📝', text: 'Contract Drafting' },
                { icon: '⚡', text: 'Quick Response' }
            ],
            testimonials: [
                { icon: '💬', text: '"Excellent Service"' },
                { icon: '⭐', text: '"5 Star Experience"' },
                { icon: '👥', text: '"Professional Team"' },
                { icon: '🎯', text: '"Results Delivered"' },
                { icon: '💯', text: '"100% Satisfied"' },
                { icon: '🚀', text: '"Outstanding Work"' },
                { icon: '💪', text: '"Strong Support"' },
                { icon: '🏆', text: '"Top Quality"' }
            ]
        };
        
        const typeItems = items[type] || items.awards;
        
        // Дублируем элементы для бесконечного скролла
        const duplicatedItems = [...typeItems, ...typeItems, ...typeItems];
        
        return duplicatedItems.map(item => `
            <div class="marquee-item">
                <div class="marquee-item-icon">${item.icon}</div>
                <div class="marquee-item-text">${item.text}</div>
            </div>
        `).join('');
    }
    
    setupMarquees() {
        const tracks = document.querySelectorAll('.marquee-track');
        
        tracks.forEach((track, index) => {
            const wrapper = track.closest('.marquee-wrapper');
            const type = this.getMarqueeType(track.id);
            
            // Настройка hover эффектов
            if (this.config.pauseOnHover) {
                wrapper.addEventListener('mouseenter', () => {
                    wrapper.classList.add('paused');
                });
                
                wrapper.addEventListener('mouseleave', () => {
                    wrapper.classList.remove('paused');
                });
            }
            
            // Сохраняем ссылку на marquee
            this.marquees.push({
                track,
                wrapper,
                type,
                animation: null
            });
        });
    }
    
    getMarqueeType(trackId) {
        if (trackId.includes('awards')) return 'awards';
        if (trackId.includes('partners')) return 'partners';
        if (trackId.includes('services')) return 'services';
        if (trackId.includes('testimonials')) return 'testimonials';
        return 'default';
    }
    
    setupFloatingIcons() {
        const icons = document.querySelectorAll('.floating-icon');
        
        icons.forEach((icon, index) => {
            // Случайная позиция
            const x = Math.random() * 80 + 10; // 10-90%
            const y = Math.random() * 80 + 10; // 10-90%
            
            icon.style.left = `${x}%`;
            icon.style.top = `${y}%`;
            
            // Случайная задержка анимации
            icon.style.animationDelay = `${Math.random() * 6}s`;
            
            this.floatingIcons.push(icon);
        });
    }
    
    setupControls() {
        // Global Speed Control
        const globalSpeedSlider = document.getElementById('globalSpeed');
        const globalSpeedValue = document.getElementById('globalSpeedValue');
        
        if (globalSpeedSlider) {
            globalSpeedSlider.addEventListener('input', (e) => {
                this.config.speed = parseFloat(e.target.value);
                globalSpeedValue.textContent = `${this.config.speed.toFixed(1)}x`;
                this.updateAnimationSpeeds();
            });
        }
        
        // Icon Rotation Control
        const iconRotationSlider = document.getElementById('iconRotation');
        const iconRotationValue = document.getElementById('iconRotationValue');
        
        if (iconRotationSlider) {
            iconRotationSlider.addEventListener('input', (e) => {
                const rotation = parseInt(e.target.value);
                iconRotationValue.textContent = `${rotation}°`;
                this.updateIconRotations(rotation);
            });
        }
        
        // Direction Toggle
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                directionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.config.direction = parseInt(btn.dataset.direction);
                this.updateAnimationDirections();
            });
        });
        
        // Control Buttons
        this.setupControlButtons();
    }
    
    setupControlButtons() {
        // Pause All
        const pauseBtn = document.getElementById('pauseAll');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseAllAnimations();
            });
        }
        
        // Resume All
        const resumeBtn = document.getElementById('resumeAll');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                this.resumeAllAnimations();
            });
        }
        
        // Toggle Hover
        const hoverBtn = document.getElementById('toggleHover');
        if (hoverBtn) {
            hoverBtn.addEventListener('click', () => {
                this.config.pauseOnHover = !this.config.pauseOnHover;
                hoverBtn.classList.toggle('active', this.config.pauseOnHover);
                this.updateHoverBehavior();
            });
        }
        
        // Rainbow Mode
        const rainbowBtn = document.getElementById('rainbowMode');
        if (rainbowBtn) {
            rainbowBtn.addEventListener('click', () => {
                this.toggleRainbowMode();
                rainbowBtn.classList.toggle('active');
            });
        }
        
        // Reset Settings
        const resetBtn = document.getElementById('resetMarquee');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }
    
    startAnimations() {
        this.marquees.forEach(marquee => {
            this.createMarqueeAnimation(marquee);
        });
        
        console.log('🎬 Marquee анимации запущены');
    }
    
    createMarqueeAnimation(marquee) {
        const { track, type } = marquee;
        const speed = this.config.speeds[type] * this.config.speed;
        const direction = this.config.directions[type] * this.config.direction;
        
        // Останавливаем предыдущую анимацию
        if (marquee.animation) {
            marquee.animation.kill();
        }
        
        // Создаем новую анимацию
        marquee.animation = gsap.to(track, {
            x: direction > 0 ? "-100%" : "100%",
            duration: 20 / speed,
            ease: "none",
            repeat: -1,
            onComplete: () => {
                // Сброс позиции для бесшовного цикла
                gsap.set(track, { x: direction > 0 ? "100%" : "-100%" });
            }
        });
        
        this.animations.push(marquee.animation);
    }
    
    updateAnimationSpeeds() {
        this.marquees.forEach(marquee => {
            if (marquee.animation) {
                const speed = this.config.speeds[marquee.type] * this.config.speed;
                marquee.animation.timeScale(speed);
            }
        });
    }
    
    updateAnimationDirections() {
        this.marquees.forEach(marquee => {
            this.createMarqueeAnimation(marquee);
        });
    }
    
    updateIconRotations(rotation) {
        const icons = document.querySelectorAll('.marquee-item-icon');
        
        icons.forEach(icon => {
            gsap.to(icon, {
                rotation: rotation,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
    
    pauseAllAnimations() {
        this.animations.forEach(animation => {
            if (animation) animation.pause();
        });
        
        console.log('⏸️ Все marquee анимации приостановлены');
    }
    
    resumeAllAnimations() {
        this.animations.forEach(animation => {
            if (animation) animation.resume();
        });
        
        console.log('▶️ Все marquee анимации возобновлены');
    }
    
    updateHoverBehavior() {
        const wrappers = document.querySelectorAll('.marquee-wrapper');
        
        wrappers.forEach(wrapper => {
            // Удаляем старые обработчики
            wrapper.removeEventListener('mouseenter', this.pauseHandler);
            wrapper.removeEventListener('mouseleave', this.resumeHandler);
            
            if (this.config.pauseOnHover) {
                wrapper.addEventListener('mouseenter', this.pauseHandler);
                wrapper.addEventListener('mouseleave', this.resumeHandler);
            }
        });
    }
    
    pauseHandler = (e) => {
        e.currentTarget.classList.add('paused');
    }
    
    resumeHandler = (e) => {
        e.currentTarget.classList.remove('paused');
    }
    
    toggleRainbowMode() {
        const section = document.querySelector('.infinite-marquee-demo-section');
        if (section) {
            section.classList.toggle('marquee-rainbow');
        }
        
        console.log('🌈 Rainbow mode переключен');
    }
    
    resetSettings() {
        // Сброс конфигурации
        this.config = {
            speed: 1.0,
            direction: 1,
            pauseOnHover: true,
            iconRotation: true,
            speeds: {
                awards: 1.0,
                partners: 0.8,
                services: 1.2,
                testimonials: 0.9
            },
            directions: {
                awards: 1,
                partners: -1,
                services: 1,
                testimonials: -1
            }
        };
        
        // Обновление UI
        const globalSpeedSlider = document.getElementById('globalSpeed');
        const globalSpeedValue = document.getElementById('globalSpeedValue');
        const iconRotationSlider = document.getElementById('iconRotation');
        const iconRotationValue = document.getElementById('iconRotationValue');
        
        if (globalSpeedSlider) {
            globalSpeedSlider.value = 1.0;
            globalSpeedValue.textContent = '1.0x';
        }
        
        if (iconRotationSlider) {
            iconRotationSlider.value = 360;
            iconRotationValue.textContent = '360°';
        }
        
        // Сброс направления
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => btn.classList.remove('active'));
        directionBtns[0]?.classList.add('active');
        
        // Сброс кнопок
        const hoverBtn = document.getElementById('toggleHover');
        const rainbowBtn = document.getElementById('rainbowMode');
        
        if (hoverBtn) hoverBtn.classList.add('active');
        if (rainbowBtn) rainbowBtn.classList.remove('active');
        
        // Сброс rainbow mode
        const section = document.querySelector('.infinite-marquee-demo-section');
        if (section) section.classList.remove('marquee-rainbow');
        
        // Перезапуск анимаций
        this.startAnimations();
        this.updateIconRotations(360);
        
        console.log('🔄 Настройки marquee сброшены');
    }
    
    // Публичные методы для внешнего управления
    pause() {
        this.pauseAllAnimations();
    }
    
    resume() {
        this.resumeAllAnimations();
    }
    
    setSpeed(speed) {
        this.config.speed = speed;
        this.updateAnimationSpeeds();
        
        const slider = document.getElementById('globalSpeed');
        const value = document.getElementById('globalSpeedValue');
        
        if (slider) slider.value = speed;
        if (value) value.textContent = `${speed.toFixed(1)}x`;
    }
    
    setDirection(direction) {
        this.config.direction = direction;
        this.updateAnimationDirections();
        
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.direction) === direction);
        });
    }
    
    destroy() {
        // Останавливаем все анимации
        this.animations.forEach(animation => {
            if (animation) animation.kill();
        });
        
        // Очищаем массивы
        this.animations = [];
        this.marquees = [];
        this.floatingIcons = [];
        
        console.log('🗑️ Infinite Marquee уничтожен');
    }
}

// Глобальная переменная для управления
let infiniteMarquee;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие секции
    const section = document.querySelector('.infinite-marquee-demo-section');
    if (section) {
        infiniteMarquee = new InfiniteMarquee();
        
        // Добавляем в глобальную область видимости для отладки
        window.infiniteMarquee = infiniteMarquee;
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteMarquee;
}

// Глобальные функции для управления (для консоли браузера)
window.pauseMarquee = () => infiniteMarquee?.pause();
window.resumeMarquee = () => infiniteMarquee?.resume();
window.setMarqueeSpeed = (speed) => infiniteMarquee?.setSpeed(speed);
window.setMarqueeDirection = (direction) => infiniteMarquee?.setDirection(direction);

console.log('📦 Infinite Marquee модуль загружен');
