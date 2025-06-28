/**
 * Enhanced Character-by-Character Text Reveals
 * YOOY Style SplitText Animations с GSAP
 */

class EnhancedTextReveals {
    constructor() {
        this.container = document.querySelector('.enhanced-text-reveals-demo-section');
        this.textElements = [];
        this.currentAnimation = 'elastic';
        this.isAnimating = false;
        
        // Настройки по умолчанию
        this.settings = {
            charDuration: 0.8,
            charStagger: 0.02,
            wordStagger: 0.1,
            lineStagger: 0.15,
            elasticStrength: 1.5
        };
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.createDemoContent();
        this.setupSplitText();
        this.setupControls();
        this.setupScrollTrigger();
        
        console.log('Enhanced Text Reveals initialized');
    }
    
    createDemoContent() {
        // Создаем контент для демонстрации
        const content = `
            <div class="enhanced-text-content">
                <h1 class="enhanced-reveal-title" data-split="chars,words">
                    Enhanced Text Reveals
                </h1>
                <h2 class="enhanced-reveal-subtitle" data-split="chars,words">
                    Character-by-Character Magic
                </h2>
                <p class="enhanced-reveal-paragraph" data-split="chars,words,lines">
                    Демонстрация продвинутых анимаций текста с использованием GSAP SplitText. 
                    Каждый символ, слово и строка анимируются индивидуально для создания 
                    впечатляющих reveal эффектов в стиле YOOY.
                </p>
                
                <div class="demo-samples-container">
                    <div class="text-sample">
                        <h3>Elastic Reveal</h3>
                        <p class="sample-text-1" data-split="chars">
                            It's Time to Finally Make Money From Your Marketing
                        </p>
                    </div>
                    
                    <div class="text-sample">
                        <h3>Bounce Effect</h3>
                        <p class="sample-text-2" data-split="chars">
                            The Future of Lead Generation Marketing
                        </p>
                    </div>
                    
                    <div class="text-sample">
                        <h3>Rotate Animation</h3>
                        <p class="sample-text-3" data-split="chars">
                            Professional Legal Marketing Solutions
                        </p>
                    </div>
                    
                    <div class="text-sample">
                        <h3>Word Stagger</h3>
                        <p class="sample-text-4" data-split="words">
                            Transform Your Practice With Proven Strategies
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Enhanced Text Controls -->
            <div class="enhanced-text-controls">
                <h3>Text Animation Settings</h3>
                
                <div class="animation-type-selector">
                    <button class="animation-type-btn active" data-type="elastic">Elastic</button>
                    <button class="animation-type-btn" data-type="bounce">Bounce</button>
                    <button class="animation-type-btn" data-type="rotate">Rotate</button>
                    <button class="animation-type-btn" data-type="slide">Slide</button>
                </div>
                
                <div class="enhanced-control-row">
                    <label>Duration:</label>
                    <span id="charDurationValue">0.8s</span>
                    <input type="range" id="charDuration" min="0.3" max="2" step="0.1" value="0.8">
                </div>
                
                <div class="enhanced-control-row">
                    <label>Char Stagger:</label>
                    <span id="charStaggerValue">0.02s</span>
                    <input type="range" id="charStagger" min="0.01" max="0.1" step="0.01" value="0.02">
                </div>
                
                <div class="enhanced-control-row">
                    <label>Word Stagger:</label>
                    <span id="wordStaggerValue">0.10s</span>
                    <input type="range" id="wordStagger" min="0.05" max="0.5" step="0.01" value="0.1">
                </div>
                
                <div class="enhanced-control-row">
                    <label>Elastic Strength:</label>
                    <span id="elasticStrengthValue">1.5</span>
                    <input type="range" id="elasticStrength" min="1" max="3" step="0.1" value="1.5">
                </div>
                
                <div class="enhanced-control-buttons">
                    <button id="replayTextAnimation" class="enhanced-control-btn">Replay Animation</button>
                    <button id="resetTextSettings" class="enhanced-control-btn">Reset Settings</button>
                    <button id="toggleGlow" class="enhanced-control-btn">Toggle Glow</button>
                    <button id="toggleRainbow" class="enhanced-control-btn">Rainbow Mode</button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = content;
    }
    
    setupSplitText() {
        // Проверяем наличие SplitText
        if (typeof SplitText === 'undefined') {
            console.warn('SplitText plugin not loaded. Using fallback animations.');
            this.setupFallbackAnimations();
            return;
        }
        
        // Находим все элементы с data-split атрибутом
        const splitElements = this.container.querySelectorAll('[data-split]');
        
        splitElements.forEach(element => {
            const splitTypes = element.getAttribute('data-split');
            
            const splitText = new SplitText(element, {
                type: splitTypes,
                charsClass: 'char',
                wordsClass: 'word',
                linesClass: 'line'
            });
            
            this.textElements.push({
                element: element,
                splitText: splitText,
                chars: splitText.chars,
                words: splitText.words,
                lines: splitText.lines
            });
            
            // Устанавливаем начальное состояние
            if (splitText.chars) {
                gsap.set(splitText.chars, {
                    opacity: 0,
                    y: 50,
                    rotationX: 90,
                    transformOrigin: 'center bottom'
                });
            }
            
            if (splitText.words) {
                gsap.set(splitText.words, {
                    opacity: 0,
                    x: -30
                });
            }
        });
    }
    
    setupFallbackAnimations() {
        // Fallback для случаев когда SplitText недоступен
        const textElements = this.container.querySelectorAll('[data-split]');
        
        textElements.forEach(element => {
            const text = element.textContent;
            const chars = text.split('').map(char => 
                char === ' ' ? '<span class="char">&nbsp;</span>' : `<span class="char">${char}</span>`
            ).join('');
            
            element.innerHTML = chars;
            
            const charElements = element.querySelectorAll('.char');
            this.textElements.push({
                element: element,
                chars: charElements
            });
            
            gsap.set(charElements, {
                opacity: 0,
                y: 50,
                rotationX: 90
            });
        });
    }
    
    setupScrollTrigger() {
        // Регистрируем ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Создаем ScrollTrigger для запуска анимаций
        ScrollTrigger.create({
            trigger: this.container,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => this.playAllAnimations(),
            onLeave: () => this.resetAllAnimations(),
            onEnterBack: () => this.playAllAnimations(),
            onLeaveBack: () => this.resetAllAnimations()
        });
    }
    
    playAllAnimations() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.textElements.forEach((textElement, index) => {
            setTimeout(() => {
                this.animateTextElement(textElement);
            }, index * 200);
        });
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.textElements.length * 200 + 2000);
    }
    
    animateTextElement(textElement) {
        const { chars, words, element } = textElement;
        
        if (chars && chars.length > 0) {
            this.animateChars(chars);
        } else if (words && words.length > 0) {
            this.animateWords(words);
        }
        
        // Добавляем специальные эффекты
        if (element.classList.contains('text-glow')) {
            this.addGlowEffect(element);
        }
    }
    
    animateChars(chars) {
        const timeline = gsap.timeline();
        
        switch (this.currentAnimation) {
            case 'elastic':
                timeline.to(chars, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: this.settings.charDuration,
                    stagger: this.settings.charStagger,
                    ease: `elastic.out(${this.settings.elasticStrength}, 0.3)`
                });
                break;
                
            case 'bounce':
                timeline.to(chars, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: this.settings.charDuration * 0.8,
                    stagger: this.settings.charStagger,
                    ease: 'bounce.out'
                });
                break;
                
            case 'rotate':
                timeline.to(chars, {
                    opacity: 1,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: this.settings.charDuration,
                    stagger: this.settings.charStagger,
                    ease: 'back.out(1.7)'
                });
                break;
                
            case 'slide':
                timeline.to(chars, {
                    opacity: 1,
                    x: 0,
                    duration: this.settings.charDuration,
                    stagger: this.settings.charStagger,
                    ease: 'power2.out'
                });
                break;
        }
        
        return timeline;
    }
    
    animateWords(words) {
        return gsap.to(words, {
            opacity: 1,
            x: 0,
            duration: this.settings.charDuration,
            stagger: this.settings.wordStagger,
            ease: 'power2.out'
        });
    }
    
    resetAllAnimations() {
        this.textElements.forEach(textElement => {
            const { chars, words } = textElement;
            
            if (chars) {
                gsap.set(chars, {
                    opacity: 0,
                    y: 50,
                    x: 0,
                    rotationX: 90,
                    rotation: this.currentAnimation === 'rotate' ? -180 : 0,
                    scale: this.currentAnimation === 'bounce' ? 0.3 : 1
                });
            }
            
            if (words) {
                gsap.set(words, {
                    opacity: 0,
                    x: -30
                });
            }
        });
    }
    
    setupControls() {
        // Настройка контролов
        this.setupRangeControl('charDuration', 'charDuration', (value) => `${value}s`);
        this.setupRangeControl('charStagger', 'charStagger', (value) => `${value}s`);
        this.setupRangeControl('wordStagger', 'wordStagger', (value) => `${value}s`);
        this.setupRangeControl('elasticStrength', 'elasticStrength', (value) => value);
        
        // Animation type buttons
        const typeButtons = this.container.querySelectorAll('.animation-type-btn');
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentAnimation = button.getAttribute('data-type');
                this.resetAllAnimations();
            });
        });
        
        // Control buttons
        const replayBtn = this.container.querySelector('#replayTextAnimation');
        const resetBtn = this.container.querySelector('#resetTextSettings');
        const glowBtn = this.container.querySelector('#toggleGlow');
        const rainbowBtn = this.container.querySelector('#toggleRainbow');
        
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                this.resetAllAnimations();
                setTimeout(() => this.playAllAnimations(), 100);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
        
        if (glowBtn) {
            glowBtn.addEventListener('click', () => this.toggleGlow());
        }
        
        if (rainbowBtn) {
            rainbowBtn.addEventListener('click', () => this.toggleRainbow());
        }
    }
    
    setupRangeControl(inputId, settingKey, formatter) {
        const input = this.container.querySelector(`#${inputId}`);
        const display = this.container.querySelector(`#${inputId}Value`);
        
        if (input && display) {
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.settings[settingKey] = value;
                display.textContent = formatter(value);
            });
        }
    }
    
    toggleGlow() {
        this.textElements.forEach(textElement => {
            textElement.element.classList.toggle('text-glow');
        });
    }
    
    toggleRainbow() {
        this.textElements.forEach(textElement => {
            textElement.element.classList.toggle('text-rainbow');
        });
    }
    
    resetSettings() {
        this.settings = {
            charDuration: 0.8,
            charStagger: 0.02,
            wordStagger: 0.1,
            lineStagger: 0.15,
            elasticStrength: 1.5
        };
        
        // Обновляем UI
        const controls = [
            { id: 'charDuration', value: 0.8, format: (v) => `${v}s` },
            { id: 'charStagger', value: 0.02, format: (v) => `${v}s` },
            { id: 'wordStagger', value: 0.1, format: (v) => `${v}s` },
            { id: 'elasticStrength', value: 1.5, format: (v) => v }
        ];
        
        controls.forEach(control => {
            const input = this.container.querySelector(`#${control.id}`);
            const display = this.container.querySelector(`#${control.id}Value`);
            
            if (input && display) {
                input.value = control.value;
                display.textContent = control.format(control.value);
            }
        });
        
        console.log('Text Reveals settings reset');
    }
    
    addGlowEffect(element) {
        gsap.to(element, {
            textShadow: '0 0 20px rgba(79, 172, 254, 0.8), 0 0 40px rgba(79, 172, 254, 0.6)',
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: 'power2.inOut'
        });
    }
    
    // Публичные методы
    getCurrentAnimation() {
        return this.currentAnimation;
    }
    
    setAnimation(type) {
        this.currentAnimation = type;
        this.resetAllAnimations();
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    destroy() {
        // Очистка ScrollTrigger
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.container) {
                trigger.kill();
            }
        });
        
        // Очистка SplitText
        this.textElements.forEach(textElement => {
            if (textElement.splitText && textElement.splitText.revert) {
                textElement.splitText.revert();
            }
        });
        
        console.log('Enhanced Text Reveals destroyed');
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие GSAP
    if (typeof gsap !== 'undefined') {
        window.enhancedTextReveals = new EnhancedTextReveals();
    } else {
        console.warn('GSAP not loaded. Enhanced Text Reveals disabled.');
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedTextReveals;
}
