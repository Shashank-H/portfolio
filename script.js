document.addEventListener('DOMContentLoaded', () => {
    // Create tech background
    const createTechBackground = () => {
        const hero = document.querySelector('#hero');
        const canvas = document.createElement('canvas');
        canvas.className = 'tech-background';
        hero.insertBefore(canvas, hero.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
            ctx.lineWidth = 0.5;
            const gridSize = 50;
            
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    };

    createTechBackground();
    const header = document.querySelector('header');
    const firstSection = document.querySelector('section:first-of-type');
    let lastScrollY = window.scrollY;

    // Initially hide the header
    header.style.transform = 'translateY(-100%)';
    header.style.opacity = '0';

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const firstSectionBottom = firstSection.offsetTop + firstSection.offsetHeight;

        if (currentScrollY > firstSectionBottom - 100) {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        } else {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Enhanced intersection observer for animations with better thresholds and timing
    const createObserver = (elements, animationClass, delayIncrement = 100, threshold = 0.15) => {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const delay = parseInt(target.dataset.delay || 0);
                    
                    // Clear any existing animation classes to prevent conflicts
                    target.classList.remove('animate', 'skill-animate', 'experience-animate', 'section-animate');
                    
                    // Add animation after a short delay
                    setTimeout(() => {
                        target.classList.add('animate', animationClass);
                    }, delay);
                    
                    // Stop observing after animation
                    observer.unobserve(target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, {
            threshold: threshold,
            rootMargin: '10px'
        });
        
        elements.forEach((el, index) => {
            // Remove any existing animation classes
            el.classList.remove('animate', 'skill-animate', 'experience-animate', 'section-animate');
            el.dataset.delay = index * delayIncrement;
            observer.observe(el);
        });
        
        return observer;
    };
    
    // Create separate observers for different element types
    const skillObserver = createObserver(
        document.querySelectorAll('.skill-category'),
        'skill-animate',
        150,
        0.2
    );
    
    const achievementObserver = createObserver(
        document.querySelectorAll('.experience-item'),
        'experience-animate',
        200,
        0.15
    );
    
    // Add staggered animation for list items in achievements
    const achievementItems = document.querySelectorAll('.experience-item li');
    achievementItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1 + 0.3}s`;
    });
    
    // Create a separate observer for achievement list items with staggered animation
    const achievementListObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parentItem = entry.target.closest('.experience-item');
                const items = parentItem.querySelectorAll('li');
                
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                
                achievementListObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.experience-item').forEach(item => {
        achievementListObserver.observe(item);
    });
    
    const sectionObserver = createObserver(
        document.querySelectorAll('section'),
        'section-animate',
        250,
        0.1
    );

    // Add parallax effect to hero section with smoother transitions
    const hero = document.querySelector('#hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const smoothFactor = 0.1;
        
        // Smooth animation function
        const smoothParallax = () => {
            targetX = mouseX * 5; // Reduced intensity for subtlety
            targetY = mouseY * 5;
            
            // Apply easing for smoother transitions
            const currentX = parseFloat(heroContent.dataset.rotateX || 0);
            const currentY = parseFloat(heroContent.dataset.rotateY || 0);
            
            const newX = currentX + (targetY - currentX) * smoothFactor;
            const newY = currentY + (targetX - currentY) * smoothFactor;
            
            heroContent.dataset.rotateX = newX;
            heroContent.dataset.rotateY = newY;
            
            heroContent.style.transform = `
                perspective(1000px)
                rotateX(${newX}deg)
                rotateY(${newY}deg)
                translateZ(0)
            `;
            
            requestAnimationFrame(smoothParallax);
        };
        
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX = (clientX - innerWidth / 2) / innerWidth;
            mouseY = (clientY - innerHeight / 2) / innerHeight;
        });
        
        // Start the animation loop
        smoothParallax();
        
        // Add subtle floating animation to particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const delay = index * 0.2;
            const duration = 3 + Math.random() * 2;
            
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
        });
    }
});
