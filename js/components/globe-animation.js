// Класс для управления анимацией глобуса (перенос с лендинга)
// Подробные комментарии для редактирования параметров

class GlobeAnimation {
    constructor(canvasId) {
        // Получаем canvas по id
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas с id "${canvasId}" не найден.`);
            return;
        }

        // Создаем сцену Three.js
        this.scene = new THREE.Scene();

        // Камера (можно менять угол обзора и расстояние)
        this.camera = new THREE.PerspectiveCamera(
            75, // угол обзора
            this.canvas.clientWidth / this.canvas.clientHeight, // соотношение сторон
            0.1, // ближняя плоскость
            1000 // дальняя плоскость
        );

        // Рендерер с проверкой WebGL контекста
        try {
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
            this.renderer.setClearColor(0x000000, 0);
        } catch (error) {
            console.error('Ошибка создания WebGL контекста:', error);
            return;
        }

        this.particles = null; // Объект частиц глобуса
        this.isRotating = true; // Флаг вращения

        this.init();
    }

    init() {
        this.addLights();
        this.createEarthSphere();
        this.animate();

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    addLights() {
        // Мягкий свет для всей сцены
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Направленный свет для объема
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
    }

    createEarthSphere() {
        const loader = new THREE.FileLoader();
        loader.load('resources/images/World-map-SVG.svg', (data) => {
            const paths = new DOMParser().parseFromString(data, 'image/svg+xml').querySelectorAll('path');

            // === Основные параметры для редактирования ===
            const radius = 5; // Радиус сферы (глобуса)
            const landParticleCount = 10000; // Количество точек суши
            const seaParticleCount = 1000;   // Количество точек моря (20% от суши)
            // ============================================

            const svgWidth = 1099;
            const svgHeight = 953;

            // Временный холст для получения точек из SVG
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = svgWidth;
            offscreenCanvas.height = svgHeight;
            const ctx = offscreenCanvas.getContext('2d');
            ctx.fillStyle = 'black';

            // Рисуем все пути (кроме фона)
            paths.forEach(path => {
                if (path.getAttribute('fill') === '#ffffff') return;
                const path2d = new Path2D(path.getAttribute('d'));
                ctx.fill(path2d);
            });

            const imageData = ctx.getImageData(0, 0, svgWidth, svgHeight);
            const pixelData = imageData.data;
            const landPoints = [];
            const seaPoints = [];
            const step = 2; // Чем меньше, тем больше точек (и нагрузка)

            // Собираем точки суши и моря
            for (let y = 0; y < svgHeight; y += step) {
                for (let x = 0; x < svgWidth; x += step) {
                    const alpha = pixelData[(y * svgWidth + x) * 4 + 3];
                    if (alpha > 0) {
                        landPoints.push({ x: x, y: y });
                    } else {
                        seaPoints.push({ x: x, y: y });
                    }
                }
            }

            const totalParticleCount = landParticleCount + seaParticleCount;
            const positions = new Float32Array(totalParticleCount * 3);
            const colors = new Float32Array(totalParticleCount * 3);

            for (let i = 0; i < totalParticleCount; i++) {
                let point;
                const color = new THREE.Color();

                if (i < landParticleCount) {
                    // === Цвет точек суши ===
                    if (landPoints.length === 0) continue;
                    point = landPoints[Math.floor(Math.random() * landPoints.length)];
                    color.set(0x4682b4); // Стальной синий (можно поменять)
                } else {
                    // === Цвет точек моря ===
                    if (seaPoints.length === 0) continue;
                    point = seaPoints[Math.floor(Math.random() * seaPoints.length)];
                    color.set(0x4682b4); // Тоже синий (можно поменять)
                }

                if (!point) continue;

                // Преобразование координат SVG в сферические
                const u = (point.x / 1099);
                const v = (point.y / 953);

                const theta = u * 2 * Math.PI;
                const phi = v * Math.PI;

                // === Формула для размещения точек на сфере ===
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = -radius * Math.sin(phi) * Math.sin(theta);

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            // === PointsMaterial с обычным смешиванием (NormalBlending) ===
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.NormalBlending // Обычное смешивание, фронт ярче тыла
            });

            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);

            // === Положение камеры (чем меньше z, тем ближе глобус) ===
            this.camera.position.z = 15;
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // === Управление вращением глобуса ===
        if (this.particles && this.isRotating) {
            this.particles.rotation.y += 0.002;   // Скорость вращения по оси Y (увеличить/уменьшить)
            this.particles.rotation.x += 0;  // Покачивание по оси X (можно убрать для чистого вращения)
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

// УДАЛЕНО: Автоинициализация глобуса (вызывается из main.js для избежания двойной инициализации)

/*
=== Кратко где что менять ===

- Радиус глобуса:         const radius = 5;
- Количество точек:       landParticleCount, seaParticleCount
- Цвета точек:            color.set(0x4682b4)
- Размер точек:           size: 0.05
- Прозрачность:           opacity: 0.9
- Положение камеры:       this.camera.position.z = 15;
- Скорость вращения:      this.particles.rotation.y += 0.002;
- Покачивание:            this.particles.rotation.x += 0.0005; (убрать если не нужно)
*/
