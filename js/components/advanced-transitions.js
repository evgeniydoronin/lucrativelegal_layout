// Advanced Transitions - Page transitions, element morphing и scroll-based анимации
class AdvancedTransitions {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 4;
        this.transitionType = 'slide';
        this.isTransitioning = false;
        this.flipStates = new Map();
        this.morphStates = new Map();
        this.stateStates = new Map();
        this.timelineItems = [];
        this.scrollSequence = null;
        
        // Настройки переходов
        this.config = {
            pageTransition: {
                duration: 1.0,
                ease: "power2.inOut"
            },
            elementTransition: {
                duration: 0.8,
                stagger: 0.1,
                elastic: 1.5
            },
            scrollTransition: {
                duration: 1.2,
                stagger: 0.2
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🎭 Инициализация Advanced Transitions...');
        
        this.setupPageTransitions();
        this.setupElementTransitions();
        this.setupScrollTransitions();
        this.setupControls();
        
        console.log('✅ Advanced Transitions инициализированы');
    }
    
    setupPageTransitions() {
        // Инициализация виртуальных страниц
        const pages = document.querySelectorAll('.virtual-page');
        if (pages.length === 0) return;
        
        // Устанавливаем начальное состояние
        pages.forEach((page, index) => {
            if (index === 0) {
                page.classList.add('active');
                this.animatePageContent(page, true);
            } else {
                gsap.set(page, { 
                    opacity: 0, 
                    x: '100%' 
                });
            }
        });
        
        // Настраиваем навигацию
        const navButtons = document.querySelectorAll('.page-nav-btn');
        navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.transitionToPage(index + 1);
                }
            });
            
            if (index === 0) {
                btn.classList.add('active');
            }
        });
        
        // Настраиваем типы переходов
        const transitionButtons = document.querySelectorAll('.transition-type-btn');
        transitionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                transitionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.transitionType = btn.textContent.toLowerCase();
                console.log(`🎭 Тип перехода изменен на: ${this.transitionType}`);
            });
        });
        
        // Устанавливаем активный тип по умолчанию
        if (transitionButtons.length > 0) {
            transitionButtons[0].classList.add('active');
        }
        
        console.log('✅ Page Transitions настроены');
    }
    
    transitionToPage(pageNumber) {
        if (pageNumber === this.currentPage || this.isTransitioning) return;
        
        this.isTransitioning = true;
        const currentPageEl = document.querySelector(`.virtual-page-${this.currentPage}`);
        const nextPageEl = document.querySelector(`.virtual-page-${pageNumber}`);
        
        if (!currentPageEl || !nextPageEl) {
            this.isTransitioning = false;
            return;
        }
        
        // Обновляем навигацию
        this.updateNavigation(pageNumber);
        
        // Выполняем переход в зависимости от типа
        switch (this.transitionType) {
            case 'slide':
                this.slideTransition(currentPageEl, nextPageEl, pageNumber);
                break;
            case 'fade':
                this.fadeTransition(currentPageEl, nextPageEl);
                break;
            case 'morph':
                this.morphTransition(currentPageEl, nextPageEl);
                break;
            case 'liquid':
                this.liquidTransition(currentPageEl, nextPageEl);
                break;
            default:
                this.slideTransition(currentPageEl, nextPageEl, pageNumber);
        }
        
        this.currentPage = pageNumber;
    }
    
    slideTransition(currentPage, nextPage, pageNumber) {
        const direction = pageNumber > this.currentPage ? 1 : -1;
        
        // Подготавливаем следующую страницу
        gsap.set(nextPage, { 
            opacity: 1, 
            x: `${direction * 100}%` 
        });
        
        const tl = gsap.timeline({
            duration: this.config.pageTransition.duration,
            ease: this.config.pageTransition.ease,
            onComplete: () => {
                currentPage.classList.remove('active');
                nextPage.classList.add('active');
                this.animatePageContent(nextPage, true);
                this.isTransitioning = false;
            }
        });
        
        tl.to(currentPage, { 
            x: `${-direction * 100}%`,
            duration: this.config.pageTransition.duration 
        })
        .to(nextPage, { 
            x: '0%',
            duration: this.config.pageTransition.duration 
        }, 0);
    }
    
    fadeTransition(currentPage, nextPage) {
        const tl = gsap.timeline({
            onComplete: () => {
                currentPage.classList.remove('active');
                nextPage.classList.add('active');
                this.animatePageContent(nextPage, true);
                this.isTransitioning = false;
            }
        });
        
        tl.to(currentPage, { 
            opacity: 0,
            scale: 0.9,
            duration: this.config.pageTransition.duration / 2,
            ease: "power2.in"
        })
        .set(nextPage, { 
            opacity: 0, 
            x: '0%', 
            scale: 1.1 
        })
        .to(nextPage, { 
            opacity: 1,
            scale: 1,
            duration: this.config.pageTransition.duration / 2,
            ease: "power2.out"
        });
    }
    
    morphTransition(currentPage, nextPage) {
        const tl = gsap.timeline({
            onComplete: () => {
                currentPage.classList.remove('active');
                nextPage.classList.add('active');
                this.animatePageContent(nextPage, true);
                this.isTransitioning = false;
            }
        });
        
        tl.to(currentPage, { 
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: this.config.pageTransition.duration / 2,
            ease: "back.in(1.7)"
        })
        .set(nextPage, { 
            opacity: 0, 
            x: '0%', 
            scale: 0, 
            rotation: -180 
        })
        .to(nextPage, { 
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: this.config.pageTransition.duration / 2,
            ease: "back.out(1.7)"
        });
    }
    
    liquidTransition(currentPage, nextPage) {
        // Создаем liquid эффект с помощью clip-path
        const tl = gsap.timeline({
            onComplete: () => {
                currentPage.classList.remove('active');
                nextPage.classList.add('active');
                this.animatePageContent(nextPage, true);
                this.isTransitioning = false;
                
                // Сбрасываем clip-path
                gsap.set([currentPage, nextPage], { clipPath: 'none' });
            }
        });
        
        gsap.set(nextPage, { 
            opacity: 1, 
            x: '0%' 
        });
        
        tl.to(currentPage, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: this.config.pageTransition.duration,
            ease: "power2.inOut"
        })
        .fromTo(nextPage, {
            clipPath: 'circle(0% at 50% 50%)'
        }, {
            clipPath: 'circle(150% at 50% 50%)',
            duration: this.config.pageTransition.duration,
            ease: "power2.inOut"
        }, 0.2);
    }
    
    animatePageContent(page, isEntering) {
        const title = page.querySelector('.page-title');
        const description = page.querySelector('.page-description');
        
        if (!title || !description) return;
        
        if (isEntering) {
            const tl = gsap.timeline({ delay: 0.3 });
            
            tl.fromTo(title, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            })
            .fromTo(description, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, 0.2);
        } else {
            gsap.set([title, description], {
                y: 0,
                opacity: 0
            });
        }
    }
    
    updateNavigation(activeIndex) {
        const navButtons = document.querySelectorAll('.page-nav-btn');
        navButtons.forEach((btn, index) => {
            if (index === activeIndex - 1) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    setupElementTransitions() {
        // Flip анимации
        this.setupFlipAnimations();
        
        // Morphing элементы
        this.setupMorphingElements();
        
        // State changes
        this.setupStateChanges();
        
        console.log('✅ Element Transitions настроены');
    }
    
    setupFlipAnimations() {
        const flipItems = document.querySelectorAll('.flip-item');
        
        flipItems.forEach((item, index) => {
            this.flipStates.set(index, false);
            
            item.addEventListener('click', () => {
                const isFlipped = this.flipStates.get(index);
                
                if (isFlipped) {
                    // Возвращаем в исходное состояние
                    gsap.to(item, {
                        rotationY: 0,
                        duration: this.config.elementTransition.duration,
                        ease: `elastic.out(${this.config.elementTransition.elastic}, 0.3)`
                    });
                    item.classList.remove('flipped');
                } else {
                    // Переворачиваем
                    gsap.to(item, {
                        rotationY: 180,
                        duration: this.config.elementTransition.duration,
                        ease: `elastic.out(${this.config.elementTransition.elastic}, 0.3)`
                    });
                    item.classList.add('flipped');
                }
                
                this.flipStates.set(index, !isFlipped);
                console.log(`🔄 Flip item ${index}: ${!isFlipped ? 'flipped' : 'normal'}`);
            });
        });
    }
    
    setupMorphingElements() {
        const morphShapes = document.querySelectorAll('.morph-shape');
        const shapes = ['square', 'circle', 'triangle', 'star'];
        
        morphShapes.forEach((shape, index) => {
            this.morphStates.set(index, 0);
            
            shape.addEventListener('click', () => {
                const currentState = this.morphStates.get(index);
                const nextState = (currentState + 1) % shapes.length;
                
                // Удаляем все классы форм
                shapes.forEach(shapeClass => {
                    shape.classList.remove(shapeClass);
                });
                
                // Анимация трансформации
                const tl = gsap.timeline();
                
                tl.to(shape, {
                    scale: 0.8,
                    rotation: 90,
                    duration: 0.2,
                    ease: "power2.in"
                })
                .call(() => {
                    if (nextState > 0) {
                        shape.classList.add(shapes[nextState]);
                    }
                })
                .to(shape, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.4,
                    ease: "elastic.out(1.2, 0.3)"
                });
                
                this.morphStates.set(index, nextState);
                console.log(`🔄 Morph shape ${index}: ${shapes[nextState]}`);
            });
        });
    }
    
    setupStateChanges() {
        const stateCards = document.querySelectorAll('.state-card');
        
        stateCards.forEach((card, index) => {
            this.stateStates.set(index, false);
            
            card.addEventListener('click', () => {
                const isExpanded = this.stateStates.get(index);
                
                if (isExpanded) {
                    // Сжимаем
                    gsap.to(card, {
                        width: 250,
                        height: 150,
                        duration: this.config.elementTransition.duration,
                        ease: "power2.inOut"
                    });
                    card.classList.remove('expanded');
                } else {
                    // Расширяем
                    gsap.to(card, {
                        width: 350,
                        height: 200,
                        duration: this.config.elementTransition.duration,
                        ease: "power2.inOut"
                    });
                    card.classList.add('expanded');
                }
                
                this.stateStates.set(index, !isExpanded);
                console.log(`📏 State card ${index}: ${!isExpanded ? 'expanded' : 'normal'}`);
            });
        });
    }
    
    setupScrollTransitions() {
        // Timeline анимации
        this.setupTimelineAnimations();
        
        // Scroll sequence
        this.setupScrollSequence();
        
        console.log('✅ Scroll Transitions настроены');
    }
    
    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineProgress = document.querySelector('.timeline-progress');
        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        if (timelineItems.length === 0) return;
        
        this.timelineItems = Array.from(timelineItems);
        
        // Создаем ScrollTrigger для каждого элемента timeline
        this.timelineItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: "top 80%",
                end: "bottom 20%",
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: this.config.scrollTransition.duration,
                        ease: "power2.out"
                    });
                    
                    // Активируем dot
                    if (timelineDots[index]) {
                        timelineDots[index].classList.add('active');
                    }
                },
                onLeave: () => {
                    if (timelineDots[index]) {
                        timelineDots[index].classList.remove('active');
                    }
                },
                onEnterBack: () => {
                    if (timelineDots[index]) {
                        timelineDots[index].classList.add('active');
                    }
                },
                onLeaveBack: () => {
                    gsap.to(item, {
                        opacity: 0,
                        y: 50,
                        duration: 0.5,
                        ease: "power2.in"
                    });
                    
                    if (timelineDots[index]) {
                        timelineDots[index].classList.remove('active');
                    }
                }
            });
        });
        
        // Progress bar для timeline
        if (timelineProgress) {
            ScrollTrigger.create({
                trigger: ".timeline-container",
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    gsap.to(timelineProgress, {
                        height: `${self.progress * 100}%`,
                        duration: 0.1,
                        ease: "none"
                    });
                }
            });
        }
    }
    
    setupScrollSequence() {
        const sequenceElements = document.querySelectorAll('.sequence-element');
        
        if (sequenceElements.length === 0) return;
        
        // Создаем scroll-triggered sequence
        ScrollTrigger.create({
            trigger: ".advanced-scroll-transitions-section",
            start: "top center",
            end: "bottom center",
            onUpdate: (self) => {
                const progress = self.progress;
                const activeIndex = Math.floor(progress * sequenceElements.length);
                
                sequenceElements.forEach((element, index) => {
                    if (index <= activeIndex) {
                        element.classList.add('active');
                    } else {
                        element.classList.remove('active');
                    }
                });
            }
        });
        
        // Клик по элементам sequence для прокрутки
        sequenceElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                const section = document.querySelector('.advanced-scroll-transitions-section');
                if (section) {
                    const targetScroll = section.offsetTop + (section.offsetHeight * index / sequenceElements.length);
                    gsap.to(window, {
                        scrollTo: targetScroll,
                        duration: 1,
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }
    
    setupControls() {
        // Page transition controls уже настроены в setupPageTransitions
        
        // Element transition controls
        this.setupElementControls();
        
        // Scroll transition controls
        this.setupScrollControls();
        
        console.log('🎛️ Advanced Transitions контролы настроены');
    }
    
    setupElementControls() {
        // Duration control
        const durationSlider = document.getElementById('elementDuration');
        const durationValue = document.getElementById('elementDurationValue');
        
        if (durationSlider && durationValue) {
            durationSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.elementTransition.duration = value;
                durationValue.textContent = value.toFixed(1) + 's';
                console.log(`🎛️ Element duration: ${value}s`);
            });
        }
        
        // Stagger control
        const staggerSlider = document.getElementById('elementStagger');
        const staggerValue = document.getElementById('elementStaggerValue');
        
        if (staggerSlider && staggerValue) {
            staggerSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.elementTransition.stagger = value;
                staggerValue.textContent = value.toFixed(2) + 's';
                console.log(`🎛️ Element stagger: ${value}s`);
            });
        }
        
        // Elastic control
        const elasticSlider = document.getElementById('elementElastic');
        const elasticValue = document.getElementById('elementElasticValue');
        
        if (elasticSlider && elasticValue) {
            elasticSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.config.elementTransition.elastic = value;
                elasticValue.textContent = value.toFixed(1);
                console.log(`🎛️ Element elastic: ${value}`);
            });
        }
        
        // Control buttons
        const resetElementsBtn = document.getElementById('resetElements');
        const flipAllBtn = document.getElementById('flipAll');
        const morphAllBtn = document.getElementById('morphAll');
        
        if (resetElementsBtn) {
            resetElementsBtn.addEventListener('click', () => {
                this.resetAllElements();
            });
        }
        
        if (flipAllBtn) {
            flipAllBtn.addEventListener('click', () => {
                this.flipAllElements();
            });
        }
        
        if (morphAllBtn) {
            morphAllBtn.addEventListener('click', () => {
                this.morphAllElements();
            });
        }
    }
    
    setupScrollControls() {
        const scrollControlButtons = document.querySelectorAll('.scroll-control-btn');
        
        scrollControlButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent.toLowerCase();
                
                switch (action) {
                    case 'smooth scroll':
                        this.toggleSmoothScroll();
                        break;
                    case 'reset timeline':
                        this.resetTimeline();
                        break;
                    case 'auto scroll':
                        this.autoScrollTimeline();
                        break;
                }
                
                // Обновляем активное состояние
                scrollControlButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    resetAllElements() {
        // Сбрасываем flip элементы
        const flipItems = document.querySelectorAll('.flip-item');
        flipItems.forEach((item, index) => {
            gsap.to(item, {
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
            item.classList.remove('flipped');
            this.flipStates.set(index, false);
        });
        
        // Сбрасываем morph элементы
        const morphShapes = document.querySelectorAll('.morph-shape');
        const shapes = ['circle', 'triangle', 'star'];
        morphShapes.forEach((shape, index) => {
            shapes.forEach(shapeClass => {
                shape.classList.remove(shapeClass);
            });
            gsap.to(shape, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "power2.out"
            });
            this.morphStates.set(index, 0);
        });
        
        // Сбрасываем state элементы
        const stateCards = document.querySelectorAll('.state-card');
        stateCards.forEach((card, index) => {
            gsap.to(card, {
                width: 250,
                height: 150,
                duration: 0.5,
                ease: "power2.out"
            });
            card.classList.remove('expanded');
            this.stateStates.set(index, false);
        });
        
        console.log('🔄 Все элементы сброшены');
    }
    
    flipAllElements() {
        const flipItems = document.querySelectorAll('.flip-item');
        
        flipItems.forEach((item, index) => {
            gsap.to(item, {
                rotationY: 180,
                duration: this.config.elementTransition.duration,
                delay: index * this.config.elementTransition.stagger,
                ease: `elastic.out(${this.config.elementTransition.elastic}, 0.3)`
            });
            item.classList.add('flipped');
            this.flipStates.set(index, true);
        });
        
        console.log('🔄 Все элементы перевернуты');
    }
    
    morphAllElements() {
        const morphShapes = document.querySelectorAll('.morph-shape');
        const shapes = ['square', 'circle', 'triangle', 'star'];
        
        morphShapes.forEach((shape, index) => {
            const targetShape = shapes[(index + 1) % shapes.length];
            
            const tl = gsap.timeline({ delay: index * this.config.elementTransition.stagger });
            
            tl.to(shape, {
                scale: 0.8,
                rotation: 90,
                duration: 0.2,
                ease: "power2.in"
            })
            .call(() => {
                shapes.forEach(shapeClass => {
                    shape.classList.remove(shapeClass);
                });
                if (targetShape !== 'square') {
                    shape.classList.add(targetShape);
                }
            })
            .to(shape, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "elastic.out(1.2, 0.3)"
            });
            
            this.morphStates.set(index, shapes.indexOf(targetShape));
        });
        
        console.log('🔄 Все формы трансформированы');
    }
    
    toggleSmoothScroll() {
        // Переключение smooth scroll (если используется ScrollSmoother)
        if (window.smoother) {
            const isEnabled = window.smoother.smooth();
            window.smoother.smooth(!isEnabled);
            console.log(`🔄 Smooth scroll: ${!isEnabled ? 'enabled' : 'disabled'}`);
        }
    }
    
    resetTimeline() {
        // Сбрасываем timeline анимации
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        timelineItems.forEach(item => {
            gsap.set(item, {
                opacity: 0,
                y: 50
            });
        });
        
        timelineDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Прокручиваем к началу timeline
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            gsap.to(window, {
                scrollTo: timelineContainer.offsetTop,
                duration: 1,
                ease: "power2.inOut"
            });
        }
        
        console.log('🔄 Timeline сброшен');
    }
    
    autoScrollTimeline() {
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) return;
        
        const startY = timelineContainer.offsetTop;
        const endY = startY + timelineContainer.offsetHeight;
        const duration = 5; // 5 секунд для полной прокрутки
        
        gsap.to(window, {
            scrollTo: endY,
            duration: duration,
            ease: "none",
            onComplete: () => {
                console.log('🔄 Auto scroll завершен');
            }
        });
        
        console.log('🔄 Auto scroll timeline запущен');
    }
    
    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        console.log('🔧 Advanced Transitions конфигурация обновлена:', this.config);
    }
    
    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages) {
            this.transitionToPage(pageNumber);
        }
    }
    
    nextPage() {
        const nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : 1;
        this.transitionToPage(nextPage);
    }
    
    prevPage() {
        const prevPage = this.currentPage > 1 ? this.currentPage - 1 : this.totalPages;
        this.transitionToPage(prevPage);
    }
    
    setTransitionType(type) {
        const validTypes = ['slide', 'fade', 'morph', 'liquid'];
        if (validTypes.includes(type)) {
            this.transitionType = type;
            
            // Обновляем UI
            const buttons = document.querySelectorAll('.transition-type-btn');
            buttons.forEach(btn => {
                if (btn.textContent.toLowerCase() === type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            console.log(`🎭 Тип перехода установлен: ${type}`);
        }
    }
    
    // Дебаг информация
    getDebugInfo() {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            transitionType: this.transitionType,
            isTransitioning: this.isTransitioning,
            flipStates: Object.fromEntries(this.flipStates),
            morphStates: Object.fromEntries(this.morphStates),
            stateStates: Object.fromEntries(this.stateStates),
            config: this.config
        };
    }
}

// Экспорт для использования в других модулях
window.AdvancedTransitions = AdvancedTransitions;

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация будет происходить в main.js
    });
}
