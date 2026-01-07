/* 
   Nydex Capital - Interactive Experience 
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Canvas Chart Animation (Wave Physics) ---
    const canvas = document.getElementById('chart-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrame;

        // Wave Parameters
        const waves = [
            { y: 0.5, length: 0.01, amp: 100, speed: 0.002, color: 'rgba(6, 182, 212, 0.05)' },
            { y: 0.5, length: 0.02, amp: 50, speed: 0.004, color: 'rgba(59, 130, 246, 0.05)' },
            { y: 0.6, length: 0.015, amp: 80, speed: 0.003, color: 'rgba(6, 182, 212, 0.03)' } // Subtle third wave
        ];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function drawWave(time, wave) {
            ctx.beginPath();
            ctx.moveTo(0, height * wave.y);

            for (let i = 0; i < width; i++) {
                // Sine wave equation with time offset
                const y = height * wave.y +
                    Math.sin(i * wave.length + time * wave.speed) * wave.amp +
                    Math.sin(i * wave.length * 0.5 + time * wave.speed * 0.5) * (wave.amp / 2); // fractal noiseish
                ctx.lineTo(i, y);
            }
            // Fill bottom
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.fillStyle = wave.color;
            ctx.fill();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            const time = Date.now();

            waves.forEach(wave => {
                drawWave(time, wave);
            });

            animationFrame = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // --- 2. Advanced Scroll Reveal (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger counter if exists
                const counter = entry.target.querySelector('.counter');
                if (counter) runCounter(counter);

                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-width').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3. Number Counter Animation ---
    function runCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000; // 2s
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target;
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current);
            }
        }, stepTime);
    }

    // --- 4. Spotlight / Magnetic Card Effect ---
    const cards = document.querySelectorAll('.spotlight-card');

    // We update mouse coordinates on the container or cards
    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for the radial gradient center
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- 5. Navigation Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 6. Mobile Menu ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open'); // Add CSS for burger to X if needed

            // Simple toggle for now, in prod you'd want a slide-over
            const isFlex = navLinks.style.display === 'flex';
            if (!isFlex && window.innerWidth < 768) {
                navLinks.style.display = 'flex';
                // Inline styles for mobile drawer (simplified)
                Object.assign(navLinks.style, {
                    flexDirection: 'column',
                    position: 'absolute',
                    top: '70px',
                    left: '0',
                    width: '100%',
                    background: '#050505',
                    padding: '24px',
                    borderBottom: '1px solid #333'
                });
            } else {
                navLinks.style.display = '';
            }
        });
    }

    // --- 7. FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;

            // Close others
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle('active');
            const content = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

});
