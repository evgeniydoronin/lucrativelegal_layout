// Reveal Animations - SplitText анимации и morphing эффекты
class RevealAnimations {
    constructor() {
        this.elements = [];
        this.splitTextInstances = [];
        this.morphingShapes = [];
        this.isInitialized = false;
        
        // Настройки анимаций
        this.config = {
            revealDuration: 1.0,
            staggerDelay: 0.1,
            characterDelay: 0.05,
            wordDelay: 0.1,
            lineDelay: 0.2,
            elasticStrength: 1.5,
            morphingDuration: 3.0
        };
        
        this.init();
    }
    
    init() {
        console.log('✨ Инициализация Reveal Animations...');
        
        // Проверяем наличие GSAP и SplitText
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP не найден для Reveal Animations');
            return;
        }
        
        if (typeof SplitText === 'undefined') {
            console.warn('⚠️ SplitText не найден - используем базовые анимации');
        }
        
        this.findRevealElements();
        this.setupRevealTriggers();
        this.setupMorphingShapes();
        this.setupStaggerAnimations();
        this.setupControls();
        
        this.isInitialized = true;
        console.log('✅ Reveal Animations инициализированы');
    }
    
    findRevealElements() {
        // Находим все элементы для reveal анимаций
        this.elements = {
            titles: Array.from(document.querySelectorAll('.reveal-title')),
            subtitles: Array.from(document.querySelectorAll('.reveal-subtitle')),
            paragraphs: Array.from(document.querySelectorAll('.reveal-paragraph')),
            staggerItems: Array.from(document.querySelectorAll('.stagger-item'))
        };
        
        console.log(`🎯 Найдено элементов для анимации:`, {
            titles: this.elements.titles.length,
            subtitles: this.elements.subtitles.length,
            paragraphs: this.elements.paragraphs.length,
            staggerItems: this.elements.staggerItems.length
        });
    }
    
    setupRevealTriggers() {
        const section = document.querySelector('.text-reveal-demo-section');
        if (!section) {
            console.warn('⚠️ Text reveal demo section не найдена');
            return;
        }
        
        // Анимации для заголовков
        this.elements.titles.forEach((title, index) => {
            this.createTextReveal(title, 'title', index);
        });
        
        // Анимации для подзаголовков
        this.elements.subtitles.forEach((subtitle, index) => {
            this.createTextReveal(subtitle, 'subtitle', index);
        });
        
        // Анимации для параграфов
        this.elements.paragraphs.forEach((paragraph, index) => {
            this.createTextReveal(paragraph, 'paragraph', index);
        });
    }
    
    createTextReveal(element, type, index) {
        if (!element) return;
        
        // Проверяем доступность SplitText
        if (typeof SplitText !== 'undefined') {
            this.createSplitTextReveal(element, type, index);
        } else {
            this.createBasicReveal(element, type, index);
        }
    }
    
    createSplitTextReveal(element, type, index) {
        // Создаем SplitText instance
        const splitText = new SplitText(element, {
            type: "chars,words,lines",
            linesClass: "reveal-line",
            wordsClass: "reveal-word",
            charsClass: "reveal-char"
        });
        
        this.splitTextInstances.push(splitText);
        
        // Настройки анимации в зависимости от типа
        let animationConfig = {};
        
        switch (type) {
            case 'title':
                animationConfig = {
                    duration: this.config.revealDuration * 1.2,
                    stagger: this.config.characterDelay,
                    ease: "elastic.out(" + this.config.elasticStrength + ", 0.3)",
                    delay: index * 0.2
                };
                break;
            case 'subtitle':
                animationConfig = {
                    duration: this.config.revealDuration,
                    stagger: this.config.wordDelay,
                    ease: "power3.out",
                    delay: index * 0.3
                };
                break;
            case 'paragraph':
                animationConfig = {
                    duration: this.config.revealDuration * 0.8,
                    stagger: this.config.lineDelay,
                    ease: "power2.out",
                    delay: index * 0.4
                };
                break;
        }
        
        // Устанавливаем начальное состояние
        gsap.set(splitText.chars, {
            y: 100,
            opacity: 0,
            rotationX: -90,
            transformOrigin: "0% 50% -50"
        });
        
        // Создаем ScrollTrigger для анимации
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                gsap.to(splitText.chars, {
                    duration: animationConfig.duration,
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    ease: animationConfig.ease,
                    stagger: animationConfig.stagger,
                    delay: animationConfig.delay
                });
                
                console.log(`🎬 ${type} reveal анимация запущена`);
            },
            onLeave: () => {
                // Опционально: анимация при выходе
                if (this.config.reverseOnLeave) {
                    gsap.to(splitText.chars, {
                        duration: 0.5,
                        y: -50,
                        opacity: 0,
                        ease: "power2.in",
                        stagger: 0.02
                    });
                }
            }
        });
    }
    
    createBasicReveal(element, type, index) {
        // Базовая анимация без SplitText
        gsap.set(element, {
            y: 50,
            opacity: 0
        });
        
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            onEnter: () => {
                gsap.to(element, {
                    duration: this.config.revealDuration,
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                    delay: index * 0.2
                });
                
                console.log(`🎬 Базовая ${type} анимация запущена`);
            }
        });
    }
    
    setupStaggerAnimations() {
        if (this.elements.staggerItems.length === 0) return;
        
        // Устанавливаем начальное состояние для stagger элементов
        gsap.set(this.elements.staggerItems, {
            y: 50,
            opacity: 0,
            scale: 0.8,
            rotationY: -15
        });
        
        // Создаем ScrollTrigger для stagger анимации
        ScrollTrigger.create({
            trigger: '.stagger-container',
            start: "top 70%",
            onEnter: () => {
                gsap.to(this.elements.staggerItems, {
                    duration: this.config.revealDuration,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    ease: "back.out(1.7)",
                    stagger: {
                        amount: this.config.staggerDelay * this.elements.staggerItems.length,
                        from: "start"
                    }
                });
                
                console.log(`🎬 Stagger анимация запущена для ${this.elements.staggerItems.length} элементов`);
            }
        });
    }
    
    setupMorphingShapes() {
        this.morphingShapes = Array.from(document.querySelectorAll('.morphing-shape'));
        
        this.morphingShapes.forEach((shape, index) => {
            // Создаем SVG для morphing
            this.createMorphingSVG(shape, index);
            
            // Анимация появления
            gsap.set(shape, {
                scale: 0,
                rotation: -180,
                opacity: 0
            });
            
            ScrollTrigger.create({
                trigger: shape,
                start: "top 90%",
                onEnter: () => {
                    gsap.to(shape, {
                        duration: 1.5,
                        scale: 1,
                        rotation: 0,
                        opacity: 0.6,
                        ease: "elastic.out(1, 0.3)",
                        delay: index * 0.3
                    });
                    
                    // Запускаем morphing анимацию
                    this.startMorphingAnimation(shape, index);
                }
            });
        });
    }
    
    createMorphingSVG(container, index) {
        // Создаем SVG элемент
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.style.width = "100%";
        svg.style.height = "100%";
        
        // Создаем path для morphing
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        // Разные формы для разных элементов
        const shapes = [
            "M50,10 L90,90 L10,90 Z", // Треугольник
            "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10", // Круг
            "M10,10 L90,10 L90,90 L10,90 Z", // Квадрат
            "M50,10 L80,30 L80,70 L50,90 L20,70 L20,30 Z" // Шестиугольник
        ];
        
        path.setAttribute("d", shapes[index % shapes.length]);
        path.setAttribute("fill", "currentColor");
        path.setAttribute("opacity", "0.8");
        
        svg.appendChild(path);
        container.appendChild(svg);
        
        // Сохраняем ссылку на path для morphing
        container.morphPath = path;
        container.shapes = shapes;
        container.currentShapeIndex = index % shapes.length;
    }
    
    startMorphingAnimation(container, index) {
        if (!container.morphPath || !container.shapes) return;
        
        const morphToNextShape = () => {
            const nextIndex = (container.currentShapeIndex + 1) % container.shapes.length;
            const nextShape = container.shapes[nextIndex];
            
            if (typeof MorphSVGPlugin !== 'undefined') {
                // Используем MorphSVG если доступен
                gsap.to(container.morphPath, {
                    duration: this.config.morphingDuration,
                    morphSVG: nextShape,
                    ease: "power2.inOut",
                    onComplete: () => {
                        container.currentShapeIndex = nextIndex;
                        // Запускаем следующую морфинг анимацию
                        gsap.delayedCall(1, morphToNextShape);
                    }
                });
            } else {
                // Базовая анимация без MorphSVG
                gsap.to(container, {
                    duration: this.config.morphingDuration,
                    rotation: "+=360",
                    scale: 1.2,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        container.currentShapeIndex = nextIndex;
                        container.morphPath.setAttribute("d", nextShape);
                        gsap.delayedCall(1, morphToNextShape);
                    }
                });
            }
        };
        
        // Запускаем первую морфинг анимацию с задержкой
        gsap.delayedCall(2 + (index * 0.5), morphToNextShape);
    }
    
    setupControls() {
        // Контролы для настройки reveal анимаций
        const durationSlider = document.getElementById('revealDuration');
        const staggerSlider = document.getElementById('staggerDelay');
        const elasticSlider = document.getElementById('elasticStrength');
        const morphingSlider = document.getElementById('morphingDuration');
        
        const durationValue = document.getElementById('durationValue');
        const staggerValue = document.getElementById('staggerValue');
        const elasticValue = document.getElementById('elasticValue');
        const morphingValue = document.getElementById('morphingValue');
        
        // Duration control
        if (durationSlider && durationValue) {
            durationSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.revealDuration = value;
                durationValue.textContent = value.toFixed(1) + 's';
                console.log(`🎛️ Reveal duration: ${value}s`);
            });
        }
        
        // Stagger control
        if (staggerSlider && staggerValue) {
            staggerSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.staggerDelay = value;
                staggerValue.textContent = value.toFixed(2) + 's';
                console.log(`🎛️ Stagger delay: ${value}s`);
            });
        }
        
        // Elastic control
        if (elasticSlider && elasticValue) {
            elasticSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.elasticStrength = value;
                elasticValue.textContent = value.toFixed(1);
                console.log(`🎛️ Elastic strength: ${value}`);
            });
        }
        
        // Morphing control
        if (morphingSlider && morphingValue) {
            morphingSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.morphingDuration = value;
                morphingValue.textContent = value.toFixed(1) + 's';
                console.log(`🎛️ Morphing duration: ${value}s`);
            });
        }
        
        // Replay button
        const replayButton = document.getElementById('replayReveal');
        if (replayButton) {
            replayButton.addEventListener('click', () => {
                this.replayAnimations();
                console.log('🔄 Reveal анимации перезапущены');
            });
        }
        
        // Reset button
        const resetButton = document.getElementById('resetReveal');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
                console.log('🔄 Reveal настройки сброшены');
            });
        }
        
        console.log('🎛️ Reveal контролы настроены');
    }
    
    replayAnimations() {
        // Сбрасываем все анимации и запускаем заново
        this.splitTextInstances.forEach(splitText => {
            gsap.set(splitText.chars, {
                y: 100,
                opacity: 0,
                rotationX: -90
            });
        });
        
        gsap.set(this.elements.staggerItems, {
            y: 50,
            opacity: 0,
            scale: 0.8,
            rotationY: -15
        });
        
        // Перезапускаем анимации
        gsap.delayedCall(0.5, () => {
            ScrollTrigger.refresh();
        });
    }
    
    resetToDefaults() {
        // Сбрасываем настройки к значениям по умолчанию
        this.config = {
            revealDuration: 1.0,
            staggerDelay: 0.1,
            characterDelay: 0.05,
            wordDelay: 0.1,
            lineDelay: 0.2,
            elasticStrength: 1.5,
            morphingDuration: 3.0
        };
        
        // Обновляем слайдеры
        const durationSlider = document.getElementById('revealDuration');
        const staggerSlider = document.getElementById('staggerDelay');
        const elasticSlider = document.getElementById('elasticStrength');
        const morphingSlider = document.getElementById('morphingDuration');
        
        if (durationSlider) durationSlider.value = this.config.revealDuration;
        if (staggerSlider) staggerSlider.value = this.config.staggerDelay;
        if (elasticSlider) elasticSlider.value = this.config.elasticStrength;
        if (morphingSlider) morphingSlider.value = this.config.morphingDuration;
        
        // Обновляем отображаемые значения
        const durationValue = document.getElementById('durationValue');
        const staggerValue = document.getElementById('staggerValue');
        const elasticValue = document.getElementById('elasticValue');
        const morphingValue = document.getElementById('morphingValue');
        
        if (durationValue) durationValue.textContent = this.config.revealDuration.toFixed(1) + 's';
        if (staggerValue) staggerValue.textContent = this.config.staggerDelay.toFixed(2) + 's';
        if (elasticValue) elasticValue.textContent = this.config.elasticStrength.toFixed(1);
        if (morphingValue) morphingValue.textContent = this.config.morphingDuration.toFixed(1) + 's';
    }
    
    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('🔧 Reveal конфигурация обновлена:', this.config);
    }
    
    pause() {
        gsap.globalTimeline.pause();
        console.log('⏸️ Reveal анимации приостановлены');
    }
    
    resume() {
        gsap.globalTimeline.resume();
        console.log('▶️ Reveal анимации возобновлены');
    }
    
    destroy() {
        // Очищаем SplitText instances
        this.splitTextInstances.forEach(splitText => {
            splitText.revert();
        });
        this.splitTextInstances = [];
        
        // Удаляем ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger && trigger.trigger.closest('.text-reveal-demo-section')) {
                trigger.kill();
            }
        });
        
        this.isInitialized = false;
        console.log('🗑️ Reveal Animations уничтожены');
    }
    
    // Дебаг информация
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            splitTextInstances: this.splitTextInstances.length,
            morphingShapes: this.morphingShapes.length,
            elementsCount: {
                titles: this.elements.titles.length,
                subtitles: this.elements.subtitles.length,
                paragraphs: this.elements.paragraphs.length,
                staggerItems: this.elements.staggerItems.length
            },
            config: this.config
        };
    }
}

// Экспорт для использования в других модулях
window.RevealAnimations = RevealAnimations;

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация будет происходить в main.js
    });
}
