// LucrativeLegal - Главный JavaScript файл (без анимаций)

console.log('🚀 Инициализация LucrativeLegal (без анимаций)...');

// Проверка загрузки GSAP
function checkGSAP() {
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP не загружен!');
        return false;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger не загружен!');
        return false;
    }
    
    console.log('✅ GSAP и ScrollTrigger загружены успешно');
    return true;
}

// Инициализация всех компонентов
function initializeAll() {
    console.log('🎯 Запуск инициализации без анимаций...');
    
    // Проверяем GSAP
    if (!checkGSAP()) {
        console.error('❌ Не удалось инициализировать - GSAP не загружен');
        return;
    }
    
    // Регистрируем плагины
    gsap.registerPlugin(ScrollTrigger, Observer);

    // ОТКЛЮЧЕНО: ScrollSmoother (для корректной работы snap через ScrollTrigger)
    // if (typeof ScrollSmoother !== 'undefined') {
    //     window.smoother = ScrollSmoother.create({
    //         wrapper: '#smooth-wrapper',
    //         content: '#smooth-content',
    //         smooth: 1.2,
    //         effects: true,
    //         normalizeScroll: true
    //     });
    //     console.log('✅ ScrollSmoother инициализирован (без snap)');
    // } else {
    //     console.warn('⚠️ ScrollSmoother не найден');
    // }

    // Snap-скролл отключён по требованию пользователя

    // Инициализируем горизонтальный скролл (без анимаций)
    if (typeof initializeHorizontalScroll === 'function') {
        initializeHorizontalScroll();
    } else {
        console.warn('⚠️ Функция initializeHorizontalScroll не найдена');
    }
    
    // Загружаем анимированный SVG космонавта поверх статичного
    if (typeof createAstronautSVG === 'function') {
        const astronautContainer = document.getElementById('astronaut-container');
        if (astronautContainer) {
            // Добавляем анимированный SVG поверх статичного (не заменяем содержимое)
            astronautContainer.insertAdjacentHTML('beforeend', createAstronautSVG());
            console.log('✅ Анимированный SVG космонавта добавлен поверх статичного');
        }
    } else {
        console.warn('⚠️ Функция createAstronautSVG не найдена');
    }
    
    // Инициализируем анимацию космонавта
    if (typeof initializeAstronautDrawing === 'function') {
        initializeAstronautDrawing();
    } else {
        console.warn('⚠️ Функция initializeAstronautDrawing не найдена');
    }
    
    // Инициализируем глобус
    if (typeof GlobeAnimation === 'function') {
        const globeAnimation = new GlobeAnimation('globeCanvas');
        console.log('✅ Глобус инициализирован');
        
        // Сохраняем ссылку для возможного использования
        window.globeAnimation = globeAnimation;
    } else {
        console.warn('⚠️ Класс GlobeAnimation не найден');
    }
    
    // Инициализируем Particle System для экспериментальной секции
    if (typeof ParticleSystem === 'function') {
        const particleCanvas = document.getElementById('particleCanvas');
        if (particleCanvas) {
            window.particleSystem = new ParticleSystem('particleCanvas', {
                count: 100,
                connectionDistance: 150,
                mouseRadius: 200,
                colors: ['#667eea', '#764ba2', '#f093fb'],
                speed: 0.5
            });
            
            // Настраиваем интерактивные контролы
            setupParticleControls();
            console.log('✅ Particle System инициализирован');
        }
    } else {
        console.warn('⚠️ Класс ParticleSystem не найден');
    }
    
    // Инициализируем Enhanced Parallax
    if (typeof EnhancedParallax === 'function') {
        window.enhancedParallax = new EnhancedParallax();
        console.log('✅ Enhanced Parallax инициализирован');
    } else {
        console.warn('⚠️ Класс EnhancedParallax не найден');
    }
    
    // Инициализируем Reveal Animations
    if (typeof RevealAnimations === 'function') {
        window.revealAnimations = new RevealAnimations();
        console.log('✅ Reveal Animations инициализированы');
    } else {
        console.warn('⚠️ Класс RevealAnimations не найден');
    }
    
    // Инициализируем Enhanced Horizontal Scroll
    if (typeof EnhancedHorizontalScroll === 'function') {
        window.enhancedHorizontalScroll = new EnhancedHorizontalScroll();
        console.log('✅ Enhanced Horizontal Scroll инициализирован');
    } else {
        console.warn('⚠️ Класс EnhancedHorizontalScroll не найден');
    }
    
    // Инициализируем Interactive Mouse Effects
    if (typeof MouseEffects === 'function') {
        window.mouseEffects = new MouseEffects();
        console.log('✅ Interactive Mouse Effects инициализированы');
    } else {
        console.warn('⚠️ Класс MouseEffects не найден');
    }
    
    // Инициализируем Advanced Transitions
    if (typeof AdvancedTransitions === 'function') {
        window.advancedTransitions = new AdvancedTransitions();
        console.log('✅ Advanced Transitions инициализированы');
    } else {
        console.warn('⚠️ Класс AdvancedTransitions не найден');
    }
    
    // (Удалено) Инициализация анимации видимости глобуса
    
    console.log('🎉 LucrativeLegal инициализирован с Advanced Transitions!');
}

// Ждем загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Обновляем ScrollTrigger при изменении размера окна
window.addEventListener('resize', () => {
    console.log('📐 Обновление ScrollTrigger при изменении размера окна...');
    ScrollTrigger.refresh();
});

// Настройка интерактивных контролов для Particle System
function setupParticleControls() {
    const particleSlider = document.getElementById('particleSlider');
    const radiusSlider = document.getElementById('radiusSlider');
    const toggleButton = document.getElementById('toggleParticles');
    const particleCountSpan = document.getElementById('particleCount');
    const mouseRadiusSpan = document.getElementById('mouseRadius');

    // Контроль количества частиц
    if (particleSlider && particleCountSpan) {
        particleSlider.addEventListener('input', (e) => {
            const count = parseInt(e.target.value);
            particleCountSpan.textContent = count;
            
            if (window.particleSystem) {
                window.particleSystem.updateConfig({ particleCount: count });
            }
        });
    }

    // Контроль радиуса взаимодействия
    if (radiusSlider && mouseRadiusSpan) {
        radiusSlider.addEventListener('input', (e) => {
            const radius = parseInt(e.target.value);
            mouseRadiusSpan.textContent = radius;
            
            if (window.particleSystem) {
                window.particleSystem.updateConfig({ mouseRadius: radius });
            }
        });
    }

    // Кнопка паузы/возобновления
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (window.particleSystem) {
                window.particleSystem.toggle();
                toggleButton.textContent = window.particleSystem.isRunning ? 'Pause' : 'Resume';
            }
        });
    }

    // Magnetic эффект для кнопок
    if (typeof gsap !== 'undefined') {
        const magneticButtons = document.querySelectorAll('.magnetic');
        magneticButtons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                gsap.to(e.target, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(e.target, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mouseleave', (e) => {
                gsap.to(e.target, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
        
        console.log('✅ Magnetic эффекты настроены');
    } else {
        console.warn('⚠️ GSAP не загружен - magnetic эффекты отключены');
    }

    console.log('✅ Particle Controls настроены');
}

// Дебаг информация
console.log('📊 LucrativeLegal Debug Info:', {
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString()
});
