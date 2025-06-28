// GSAP Horizontal Scroll - точно как в лендинге, но без анимаций

function initializeHorizontalScroll() {
    console.log('↔️ Инициализация Horizontal Scroll...');
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ GSAP или ScrollTrigger не загружены');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Горизонтальный скролл панелей
    const horizontalContainer = document.querySelector('.horizontal-container');
    const panels = gsap.utils.toArray('.horizontal-panel');
    
    if (horizontalContainer && panels.length > 0) {
        console.log(`📱 Найдено ${panels.length} панелей`);
        
        // Создаем горизонтальную анимацию для каждой панели
        panels.forEach((panel, index) => {
            gsap.set(panel, { x: index * window.innerWidth });
        });
        
        // Анимация всех панелей при скролле
        gsap.to(panels, {
            x: (index) => -(panels.length - 1) * window.innerWidth + index * window.innerWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: '.horizontal-scroll-section',
                pin: true,
                scrub: 1,
                snap: 1 / (panels.length - 1),
                end: () => '+=' + (panels.length - 1) * window.innerWidth,
                invalidateOnRefresh: true
            }
        });

        console.log('✅ Horizontal Scroll инициализирован');
    }

    console.log('✅ Horizontal Scroll инициализирован');
}

// Экспорт для использования в других модулях
if (typeof window !== 'undefined') {
    window.initializeHorizontalScroll = initializeHorizontalScroll;
}
