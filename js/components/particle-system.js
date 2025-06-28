// Particle System - Интерактивная система частиц в стиле advida.com
class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas с ID "${canvasId}" не найден`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Настройки по умолчанию
        this.config = {
            particleCount: options.count || 100,
            connectionDistance: options.connectionDistance || 150,
            mouseRadius: options.mouseRadius || 200,
            colors: options.colors || ['#667eea', '#764ba2', '#f093fb'],
            speed: options.speed || 0.5,
            particleSize: options.particleSize || 2,
            maxParticleSize: options.maxParticleSize || 4,
            connectionOpacity: options.connectionOpacity || 0.3,
            mouseForce: options.mouseForce || 0.1
        };

        // Состояние системы
        this.particles = [];
        this.mouse = { x: 0, y: 0, isActive: false };
        this.isRunning = true;
        this.animationId = null;

        // Инициализация
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
        
        console.log('✅ Particle System инициализирован');
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    createParticles() {
        this.particles = [];
        const rect = this.canvas.getBoundingClientRect();
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                size: Math.random() * (this.config.maxParticleSize - this.config.particleSize) + this.config.particleSize,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                originalColor: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: Math.random() * 0.5 + 0.5,
                originalX: 0,
                originalY: 0,
                isAffectedByMouse: false
            });
        }
    }

    setupEventListeners() {
        const canvas = this.canvas;
        
        // Mouse move
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.isActive = true;
        });

        // Mouse enter
        canvas.addEventListener('mouseenter', () => {
            this.mouse.isActive = true;
        });

        // Mouse leave
        canvas.addEventListener('mouseleave', () => {
            this.mouse.isActive = false;
            // Возвращаем частицы к нормальному состоянию
            this.particles.forEach(particle => {
                particle.isAffectedByMouse = false;
            });
        });

        // Click effect
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            this.createClickEffect(clickX, clickY);
        });
    }

    createClickEffect(x, y) {
        console.log(`🎯 Click эффект в точке: (${x.toFixed(1)}, ${y.toFixed(1)})`);
        
        let affectedParticles = 0;
        
        // Создаем "взрыв" частиц от точки клика
        this.particles.forEach(particle => {
            const dx = particle.x - x;
            const dy = particle.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                affectedParticles++;
                const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                particle.vx += Math.cos(angle) * force * 5;
                particle.vy += Math.sin(angle) * force * 5;
                
                // Временно увеличиваем размер и меняем цвет
                particle.size = Math.min(particle.size * 2, this.config.maxParticleSize * 2);
                particle.color = '#f093fb';
                
                // Возвращаем к нормальному состоянию через время
                setTimeout(() => {
                    particle.size = Math.random() * (this.config.maxParticleSize - this.config.particleSize) + this.config.particleSize;
                    particle.color = particle.originalColor;
                }, 1000);
            }
        });
        
        console.log(`💥 Затронуто частиц: ${affectedParticles} из ${this.particles.length}`);
    }

    updateParticles() {
        const rect = this.canvas.getBoundingClientRect();
        
        this.particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Отскок от границ
            if (particle.x < 0 || particle.x > rect.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(rect.width, particle.x));
            }
            if (particle.y < 0 || particle.y > rect.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(rect.height, particle.y));
            }

            // Взаимодействие с мышью
            if (this.mouse.isActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.mouseRadius) {
                    particle.isAffectedByMouse = true;
                    
                    // Притяжение к мыши
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.vx += Math.cos(angle) * force * this.config.mouseForce;
                    particle.vy += Math.sin(angle) * force * this.config.mouseForce;
                    
                    // Изменение цвета при приближении
                    const colorIntensity = 1 - (distance / this.config.mouseRadius);
                    particle.opacity = 0.5 + colorIntensity * 0.5;
                    particle.size = this.config.particleSize + colorIntensity * 2;
                } else {
                    particle.isAffectedByMouse = false;
                    particle.opacity = Math.max(0.3, particle.opacity - 0.02);
                    particle.size = Math.max(this.config.particleSize, particle.size - 0.05);
                }
            }

            // Затухание скорости
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = particle1.color;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        if (!this.isRunning) return;

        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Обновляем и рисуем
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();

        // Следующий кадр
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Публичные методы для управления
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        
        // Пересоздаем частицы если изменилось их количество
        if (newConfig.particleCount && newConfig.particleCount !== this.particles.length) {
            this.createParticles();
        }
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.resume();
        }
    }

    destroy() {
        this.pause();
        // Event listeners будут удалены автоматически при удалении canvas
        console.log('🗑️ Particle System уничтожен');
    }
}

// Экспорт для использования в других модулях
window.ParticleSystem = ParticleSystem;
