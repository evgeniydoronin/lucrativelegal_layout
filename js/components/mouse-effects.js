// Interactive Mouse Effects - Кастомный курсор, mouse trail и magnetic эффекты
class MouseEffects {
    constructor() {
        this.cursor = null;
        this.trailContainer = null;
        this.rippleContainer = null;
        this.trail = [];
        this.mousePosition = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.velocityMagnitude = 0;
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 768;
        
        // Настройки эффектов
        this.config = {
            trailLength: 20,
            trailLifetime: 1.0,
            magneticStrength: 0.3,
            rippleSize: 100,
            cursorSize: 20,
            velocitySmoothing: 0.1,
            maxVelocity: 50
        };
        
        this.init();
    }
    
    init() {
        console.log('🖱️ Инициализация Interactive Mouse Effects...');
        
        // Пропускаем инициализацию на мобильных устройствах
        if (this.isMobile) {
            console.log('📱 Мобильное устройство - mouse effects отключены');
            return;
        }
        
        this.createCustomCursor();
        this.createTrailContainer();
        this.createRippleContainer();
        this.setupMouseTracking();
        this.setupMagneticElements();
        this.setupControls();
        this.createVelocityIndicator();
        
        this.isInitialized = true;
        console.log('✅ Interactive Mouse Effects инициализированы');
    }
    
    createCustomCursor() {
        // Создаем кастомный курсор
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        console.log('✅ Кастомный курсор создан');
    }
    
    createTrailContainer() {
        // Создаем контейнер для mouse trail
        this.trailContainer = document.createElement('div');
        this.trailContainer.className = 'mouse-trail-container';
        document.body.appendChild(this.trailContainer);
        
        console.log('✅ Mouse trail контейнер создан');
    }
    
    createRippleContainer() {
        // Создаем контейнер для ripple эффектов
        this.rippleContainer = document.createElement('div');
        this.rippleContainer.className = 'ripple-container';
        document.body.appendChild(this.rippleContainer);
        
        console.log('✅ Ripple контейнер создан');
    }
    
    setupMouseTracking() {
        let ticking = false;
        
        // Отслеживание движения мыши
        document.addEventListener('mousemove', (e) => {
            this.lastMousePosition = { ...this.mousePosition };
            this.mousePosition = { x: e.clientX, y: e.clientY };
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateCursor();
                    this.updateVelocity();
                    this.createTrailParticle();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Обработка кликов
        document.addEventListener('mousedown', (e) => {
            this.onMouseDown(e);
        });
        
        document.addEventListener('mouseup', (e) => {
            this.onMouseUp(e);
        });
        
        // Обработка hover эффектов
        document.addEventListener('mouseover', (e) => {
            this.onMouseOver(e);
        });
        
        document.addEventListener('mouseout', (e) => {
            this.onMouseOut(e);
        });
        
        console.log('✅ Mouse tracking настроен');
    }
    
    updateCursor() {
        if (!this.cursor) return;
        
        // Обновляем позицию курсора
        gsap.set(this.cursor, {
            left: this.mousePosition.x,
            top: this.mousePosition.y
        });
    }
    
    updateVelocity() {
        // Вычисляем velocity
        const rawVelocity = {
            x: this.mousePosition.x - this.lastMousePosition.x,
            y: this.mousePosition.y - this.lastMousePosition.y
        };
        
        // Сглаживаем velocity
        this.velocity.x = gsap.utils.interpolate(
            this.velocity.x,
            rawVelocity.x,
            this.config.velocitySmoothing
        );
        
        this.velocity.y = gsap.utils.interpolate(
            this.velocity.y,
            rawVelocity.y,
            this.config.velocitySmoothing
        );
        
        // Вычисляем magnitude
        this.velocityMagnitude = Math.sqrt(
            this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
        );
        
        // Ограничиваем максимальную velocity
        this.velocityMagnitude = Math.min(this.velocityMagnitude, this.config.maxVelocity);
        
        // Обновляем velocity индикатор
        this.updateVelocityIndicator();
    }
    
    createTrailParticle() {
        if (!this.trailContainer) return;
        
        // Ограничиваем количество частиц
        if (this.trail.length >= this.config.trailLength) {
            const oldParticle = this.trail.shift();
            if (oldParticle && oldParticle.parentNode) {
                oldParticle.parentNode.removeChild(oldParticle);
            }
        }
        
        // Создаем новую частицу
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        
        // Определяем класс в зависимости от velocity
        if (this.velocityMagnitude > 30) {
            particle.classList.add('velocity-high');
        } else if (this.velocityMagnitude > 15) {
            particle.classList.add('velocity-medium');
        } else {
            particle.classList.add('velocity-low');
        }
        
        // Устанавливаем позицию
        gsap.set(particle, {
            left: this.mousePosition.x,
            top: this.mousePosition.y,
            opacity: 1
        });
        
        this.trailContainer.appendChild(particle);
        this.trail.push(particle);
        
        // Анимация исчезновения
        gsap.to(particle, {
            duration: this.config.trailLifetime,
            opacity: 0,
            scale: 0.5,
            ease: "power2.out",
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                const index = this.trail.indexOf(particle);
                if (index > -1) {
                    this.trail.splice(index, 1);
                }
            }
        });
    }
    
    onMouseDown(e) {
        if (!this.cursor) return;
        
        // Анимация клика
        this.cursor.classList.add('click');
        
        // Создаем ripple эффект
        this.createRipple(e.clientX, e.clientY);
    }
    
    onMouseUp(e) {
        if (!this.cursor) return;
        
        // Убираем класс клика
        this.cursor.classList.remove('click');
    }
    
    onMouseOver(e) {
        if (!this.cursor) return;
        
        // Проверяем, является ли элемент интерактивным
        const target = e.target;
        if (this.isInteractiveElement(target)) {
            this.cursor.classList.add('hover');
        }
    }
    
    onMouseOut(e) {
        if (!this.cursor) return;
        
        // Убираем hover класс
        this.cursor.classList.remove('hover');
    }
    
    isInteractiveElement(element) {
        // Проверяем, является ли элемент интерактивным
        const interactiveSelectors = [
            '.magnetic-element',
            '.magnetic-card',
            '.interactive-btn',
            '.control-btn',
            'button',
            'a',
            'input',
            'textarea',
            'select'
        ];
        
        return interactiveSelectors.some(selector => 
            element.matches && element.matches(selector)
        );
    }
    
    createRipple(x, y) {
        if (!this.rippleContainer) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        gsap.set(ripple, {
            left: x,
            top: y,
            width: 0,
            height: 0,
            opacity: 1
        });
        
        this.rippleContainer.appendChild(ripple);
        
        // Анимация ripple
        gsap.to(ripple, {
            duration: 0.6,
            width: this.config.rippleSize,
            height: this.config.rippleSize,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }
        });
    }
    
    setupMagneticElements() {
        const magneticElements = document.querySelectorAll('.magnetic-element, .magnetic-card');
        
        magneticElements.forEach(element => {
            this.setupMagneticEffect(element);
        });
        
        console.log(`✅ Настроено ${magneticElements.length} magnetic элементов`);
    }
    
    setupMagneticEffect(element) {
        let isHovering = false;
        
        element.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        element.addEventListener('mouseleave', () => {
            isHovering = false;
            
            // Возвращаем элемент в исходное положение
            gsap.to(element, {
                duration: 0.5,
                x: 0,
                y: 0,
                rotation: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        element.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = Math.max(rect.width, rect.height) / 2;
            
            if (distance < maxDistance) {
                const strength = this.config.magneticStrength;
                const moveX = deltaX * strength;
                const moveY = deltaY * strength;
                const rotation = (deltaX / maxDistance) * 5; // Максимум 5 градусов
                
                gsap.to(element, {
                    duration: 0.3,
                    x: moveX,
                    y: moveY,
                    rotation: rotation,
                    ease: "power2.out"
                });
            }
        });
    }
    
    createVelocityIndicator() {
        // Проверяем, есть ли уже индикатор
        let indicator = document.querySelector('.velocity-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'velocity-indicator';
            indicator.innerHTML = `
                <h4>Mouse Velocity</h4>
                <div class="velocity-bar">
                    <div class="velocity-fill"></div>
                </div>
            `;
            document.body.appendChild(indicator);
        }
        
        this.velocityIndicator = indicator.querySelector('.velocity-fill');
        console.log('✅ Velocity индикатор создан');
    }
    
    updateVelocityIndicator() {
        if (!this.velocityIndicator) return;
        
        const normalizedVelocity = this.velocityMagnitude / this.config.maxVelocity;
        const percentage = Math.min(normalizedVelocity * 100, 100);
        
        gsap.set(this.velocityIndicator, {
            height: `${percentage}%`
        });
    }
    
    setupControls() {
        // Контролы для настройки mouse effects
        const trailLengthSlider = document.getElementById('trailLength');
        const magneticStrengthSlider = document.getElementById('magneticStrength');
        const rippleSizeSlider = document.getElementById('rippleSize');
        const cursorSizeSlider = document.getElementById('cursorSize');
        
        const trailLengthValue = document.getElementById('trailLengthValue');
        const magneticStrengthValue = document.getElementById('magneticStrengthValue');
        const rippleSizeValue = document.getElementById('rippleSizeValue');
        const cursorSizeValue = document.getElementById('cursorSizeValue');
        
        // Trail Length control
        if (trailLengthSlider && trailLengthValue) {
            trailLengthSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.config.trailLength = value;
                trailLengthValue.textContent = value;
                console.log(`🎛️ Trail length: ${value}`);
            });
        }
        
        // Magnetic Strength control
        if (magneticStrengthSlider && magneticStrengthValue) {
            magneticStrengthSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.magneticStrength = value;
                magneticStrengthValue.textContent = value.toFixed(2);
                console.log(`🎛️ Magnetic strength: ${value}`);
            });
        }
        
        // Ripple Size control
        if (rippleSizeSlider && rippleSizeValue) {
            rippleSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.config.rippleSize = value;
                rippleSizeValue.textContent = value + 'px';
                console.log(`🎛️ Ripple size: ${value}px`);
            });
        }
        
        // Cursor Size control
        if (cursorSizeSlider && cursorSizeValue) {
            cursorSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.config.cursorSize = value;
                cursorSizeValue.textContent = value + 'px';
                
                if (this.cursor) {
                    gsap.set(this.cursor, {
                        width: value,
                        height: value
                    });
                }
                
                console.log(`🎛️ Cursor size: ${value}px`);
            });
        }
        
        // Toggle Trail button
        const toggleTrailButton = document.getElementById('toggleTrail');
        if (toggleTrailButton) {
            toggleTrailButton.addEventListener('click', () => {
                this.toggleTrail();
            });
        }
        
        // Toggle Magnetic button
        const toggleMagneticButton = document.getElementById('toggleMagnetic');
        if (toggleMagneticButton) {
            toggleMagneticButton.addEventListener('click', () => {
                this.toggleMagnetic();
            });
        }
        
        // Reset button
        const resetButton = document.getElementById('resetMouseEffects');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
                console.log('🔄 Mouse effects настройки сброшены');
            });
        }
        
        console.log('🎛️ Mouse effects контролы настроены');
    }
    
    toggleTrail() {
        if (this.trailContainer) {
            const isVisible = this.trailContainer.style.display !== 'none';
            this.trailContainer.style.display = isVisible ? 'none' : 'block';
            console.log(`🎛️ Trail ${isVisible ? 'отключен' : 'включен'}`);
        }
    }
    
    toggleMagnetic() {
        const magneticElements = document.querySelectorAll('.magnetic-element, .magnetic-card');
        magneticElements.forEach(element => {
            const isDisabled = element.classList.contains('magnetic-disabled');
            if (isDisabled) {
                element.classList.remove('magnetic-disabled');
                this.setupMagneticEffect(element);
            } else {
                element.classList.add('magnetic-disabled');
                // Возвращаем в исходное положение
                gsap.set(element, { x: 0, y: 0, rotation: 0 });
            }
        });
        
        console.log('🎛️ Magnetic эффекты переключены');
    }
    
    resetToDefaults() {
        // Сбрасываем настройки к значениям по умолчанию
        this.config = {
            trailLength: 20,
            trailLifetime: 1.0,
            magneticStrength: 0.3,
            rippleSize: 100,
            cursorSize: 20,
            velocitySmoothing: 0.1,
            maxVelocity: 50
        };
        
        // Обновляем слайдеры
        const trailLengthSlider = document.getElementById('trailLength');
        const magneticStrengthSlider = document.getElementById('magneticStrength');
        const rippleSizeSlider = document.getElementById('rippleSize');
        const cursorSizeSlider = document.getElementById('cursorSize');
        
        if (trailLengthSlider) trailLengthSlider.value = this.config.trailLength;
        if (magneticStrengthSlider) magneticStrengthSlider.value = this.config.magneticStrength;
        if (rippleSizeSlider) rippleSizeSlider.value = this.config.rippleSize;
        if (cursorSizeSlider) cursorSizeSlider.value = this.config.cursorSize;
        
        // Обновляем отображаемые значения
        const trailLengthValue = document.getElementById('trailLengthValue');
        const magneticStrengthValue = document.getElementById('magneticStrengthValue');
        const rippleSizeValue = document.getElementById('rippleSizeValue');
        const cursorSizeValue = document.getElementById('cursorSizeValue');
        
        if (trailLengthValue) trailLengthValue.textContent = this.config.trailLength;
        if (magneticStrengthValue) magneticStrengthValue.textContent = this.config.magneticStrength.toFixed(2);
        if (rippleSizeValue) rippleSizeValue.textContent = this.config.rippleSize + 'px';
        if (cursorSizeValue) cursorSizeValue.textContent = this.config.cursorSize + 'px';
        
        // Обновляем размер курсора
        if (this.cursor) {
            gsap.set(this.cursor, {
                width: this.config.cursorSize,
                height: this.config.cursorSize
            });
        }
    }
    
    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('🔧 Mouse effects конфигурация обновлена:', this.config);
    }
    
    pause() {
        if (this.cursor) this.cursor.style.display = 'none';
        if (this.trailContainer) this.trailContainer.style.display = 'none';
        if (this.rippleContainer) this.rippleContainer.style.display = 'none';
        console.log('⏸️ Mouse effects приостановлены');
    }
    
    resume() {
        if (this.cursor) this.cursor.style.display = 'block';
        if (this.trailContainer) this.trailContainer.style.display = 'block';
        if (this.rippleContainer) this.rippleContainer.style.display = 'block';
        console.log('▶️ Mouse effects возобновлены');
    }
    
    destroy() {
        // Удаляем все созданные элементы
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        if (this.trailContainer && this.trailContainer.parentNode) {
            this.trailContainer.parentNode.removeChild(this.trailContainer);
        }
        
        if (this.rippleContainer && this.rippleContainer.parentNode) {
            this.rippleContainer.parentNode.removeChild(this.rippleContainer);
        }
        
        // Очищаем trail частицы
        this.trail.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.trail = [];
        
        this.isInitialized = false;
        console.log('🗑️ Mouse Effects уничтожены');
    }
    
    // Дебаг информация
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            isMobile: this.isMobile,
            trailParticlesCount: this.trail.length,
            velocityMagnitude: this.velocityMagnitude.toFixed(2),
            mousePosition: this.mousePosition,
            config: this.config
        };
    }
}

// Экспорт для использования в других модулях
window.MouseEffects = MouseEffects;

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация будет происходить в main.js
    });
}
