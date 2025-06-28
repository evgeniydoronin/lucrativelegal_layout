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
    
    // (Удалено) Инициализация анимации видимости глобуса
    
    console.log('🎉 LucrativeLegal инициализирован (без анимаций)!');
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

// Дебаг информация
console.log('📊 LucrativeLegal Debug Info:', {
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString()
});
