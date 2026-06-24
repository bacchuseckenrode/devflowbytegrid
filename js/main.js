/* ==========================================================================
   devflowbytegrid.com - Main JavaScript
   Rich Interactions & Animations
   ========================================================================== */

(function() {
    'use strict';

    /* =====================================================
       1. PRELOADER
       ===================================================== */
    const initPreloader = () => {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 600);
            }, 500);
        });

        // Fallback in case load event takes too long
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                if (preloader.parentNode) preloader.remove();
            }, 600);
        }, 3000);
    };

    /* =====================================================
       2. HEADER SCROLL BEHAVIOR
       ===================================================== */
    const initHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScrollY = 0;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Auto-hide on scroll down (optional - off by default)
            // if (scrollY > lastScrollY && scrollY > 200) {
            //     header.style.transform = 'translateY(-100%)';
            // } else {
            //     header.style.transform = 'translateY(0)';
            // }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    };

    /* =====================================================
       3. MOBILE NAVIGATION
       ===================================================== */
    const initMobileNav = () => {
        const toggle = document.querySelector('.mobile-toggle');
        const menu = document.querySelector('.nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            const isActive = menu.classList.contains('active');
            toggle.setAttribute('aria-expanded', isActive);
            toggle.innerHTML = isActive
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    };

    /* =====================================================
       4. SCROLL REVEAL ANIMATIONS
       ===================================================== */
    const initScrollReveal = () => {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        if (!elements.length) return;

        // Set staggered delays for grouped elements
        document.querySelectorAll('.stagger').forEach(group => {
            Array.from(group.children).forEach((child, index) => {
                child.style.setProperty('--i', index);
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    /* =====================================================
       5. ANIMATED COUNTERS
       ===================================================== */
    const initCounters = () => {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseFloat(el.dataset.counter);
            const duration = parseInt(el.dataset.duration || '2000');
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const decimals = parseInt(el.dataset.decimals || '0');
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;

                el.textContent = prefix + current.toFixed(decimals) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = prefix + target.toFixed(decimals) + suffix;
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    };

    /* =====================================================
       6. PARALLAX EFFECT
       ===================================================== */
    const initParallax = () => {
        const elements = document.querySelectorAll('[data-parallax]');
        if (!elements.length) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const offset = (scrollY - elementTop) * speed;

                el.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    };

    /* =====================================================
       7. SMOOTH SCROLL
       ===================================================== */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const offset = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    /* =====================================================
       8. TYPEWRITER EFFECT
       ===================================================== */
    const initTypewriter = () => {
        const elements = document.querySelectorAll('[data-typewriter]');
        if (!elements.length) return;

        elements.forEach(el => {
            const text = el.dataset.typewriter;
            const speed = parseInt(el.dataset.typewriterSpeed || '80');
            const delay = parseInt(el.dataset.typewriterDelay || '0');
            el.textContent = '';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            let i = 0;
                            const interval = setInterval(() => {
                                el.textContent += text.charAt(i);
                                i++;
                                if (i >= text.length) clearInterval(interval);
                            }, speed);
                        }, delay);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(el);
        });
    };

    /* =====================================================
       9. TILT 3D EFFECT
       ===================================================== */
    const initTilt3D = () => {
        const elements = document.querySelectorAll('.tilt-3d');
        if (!elements.length) return;

        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    };

    /* =====================================================
       10. MAGNETIC BUTTONS
       ===================================================== */
    const initMagnetic = () => {
        const elements = document.querySelectorAll('.magnetic');
        if (!elements.length) return;

        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    };

    /* =====================================================
       11. PROGRESS BAR ANIMATION
       ===================================================== */
    const initProgressBars = () => {
        const bars = document.querySelectorAll('.progress-bar-fill');
        if (!bars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.dataset.progress || '0';
                    bar.style.width = targetWidth + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(bar => observer.observe(bar));
    };

    /* =====================================================
       12. PARTICLES BACKGROUND
       ===================================================== */
    const initParticles = () => {
        const canvas = document.querySelector('.particles-canvas');
        if (!canvas || window.innerWidth < 768) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.update();
                p.draw();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener('resize', () => {
            resize();
            init();
        });
    };

    /* =====================================================
       13. CURSOR EFFECT (Desktop)
       ===================================================== */
    const initCustomCursor = () => {
        if (window.innerWidth < 1024) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateRing);
        };
        animateRing();

        document.querySelectorAll('a, button, .card, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    };

    /* =====================================================
       14. LIVE TIME / CLOCK
       ===================================================== */
    const initLiveClock = () => {
        const clockElements = document.querySelectorAll('[data-live-clock]');
        if (!clockElements.length) return;

        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            clockElements.forEach(el => {
                el.textContent = time;
            });
        };

        update();
        setInterval(update, 1000);
    };

    /* =====================================================
       15. FORM VALIDATION & SUBMIT
       ===================================================== */
    const initContactForm = () => {
        const form = document.querySelector('#contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="dots-loader"><span></span><span></span><span></span></span> Sending...';

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            submitBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message Sent Successfully
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            // Reset after 3 seconds
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                if (field.required && !field.value.trim()) {
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            field.addEventListener('input', () => {
                field.classList.remove('error');
            });
        });
    };

    /* =====================================================
       16. THEME TOGGLE (Optional - dark is default)
       ===================================================== */
    const initThemeToggle = () => {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        if (!toggles.length) return;

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    };

    /* =====================================================
       17. CODE SYNTAX HIGHLIGHTING (Light)
       ===================================================== */
    const initCodeHighlight = () => {
        const codeBlocks = document.querySelectorAll('pre code');
        if (!codeBlocks.length) return;

        codeBlocks.forEach(block => {
            const html = block.innerHTML;
            // Simple syntax highlighting
            let highlighted = html
                .replace(/(\/\/.*$)/gm, '<span style="color:#6b6b6b">$1</span>')
                .replace(/("[^&]*"|&#039;[^&]*&#039;)/g, '<span style="color:#10b981">$1</span>')
                .replace(/\b(function|const|let|var|return|if|else|for|while|class|import|export|from|async|await|new)\b/g, '<span style="color:#7c3aed">$1</span>')
                .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#f59e0b">$1</span>')
                .replace(/\b(\d+)\b/g, '<span style="color:#06b6d4">$1</span>');
            block.innerHTML = highlighted;
        });
    };

    /* =====================================================
       18. LIVE STATUS / DATA STATUS
       ===================================================== */
    const initLiveStatus = () => {
        const statusElements = document.querySelectorAll('[data-status]');
        if (!statusElements.length) return;

        statusElements.forEach(el => {
            const dot = el.querySelector('.status-dot');
            const label = el.querySelector('.status-label');

            if (dot) {
                dot.style.background = '#10b981';
                dot.style.boxShadow = '0 0 12px #10b981';
            }
            if (label) {
                label.textContent = 'All Systems Operational';
            }
        });
    };

    /* =====================================================
       19. PERFORMANCE: LAZY LOAD IMAGES
       ===================================================== */
    const initLazyLoad = () => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
        }
    };

    /* =====================================================
       20. EASTER EGG: KONAMI CODE
       ===================================================== */
    const initKonamiCode = () => {
        const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let current = 0;

        document.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === pattern[current]) {
                current++;
                if (current === pattern.length) {
                    document.body.style.animation = 'glitch 1s';
                    console.log('%c🎉 Konami Code Activated!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
                    console.log('%cWelcome to devflowbytegrid.com - Privacy First, Innovation Always.', 'color: #7c3aed; font-size: 14px;');
                    setTimeout(() => {
                        document.body.style.animation = '';
                    }, 1000);
                    current = 0;
                }
            } else {
                current = 0;
            }
        });
    };

    /* =====================================================
       21. BACK TO TOP BUTTON
       ===================================================== */
    const initBackToTop = () => {
        const button = document.querySelector('[data-back-to-top]');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    /* =====================================================
       22. TAB SYSTEM
       ===================================================== */
    const initTabs = () => {
        document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
            const triggers = tabGroup.querySelectorAll('[data-tab-trigger]');
            const panels = tabGroup.querySelectorAll('[data-tab-panel]');

            triggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    const target = trigger.dataset.tabTrigger;

                    triggers.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));

                    trigger.classList.add('active');
                    const panel = tabGroup.querySelector(`[data-tab-panel="${target}"]`);
                    if (panel) panel.classList.add('active');
                });
            });
        });
    };

    /* =====================================================
       23. SEARCH FUNCTIONALITY (Simple)
       ===================================================== */
    const initSearch = () => {
        const searchInput = document.querySelector('[data-search]');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('[data-searchable]').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    };

    /* =====================================================
       24. ACCORDION
       ===================================================== */
    const initAccordion = () => {
        document.querySelectorAll('[data-accordion]').forEach(accordion => {
            const items = accordion.querySelectorAll('[data-accordion-item]');

            items.forEach(item => {
                const trigger = item.querySelector('[data-accordion-trigger]');
                const content = item.querySelector('[data-accordion-content]');

                if (!trigger || !content) return;

                trigger.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');

                    items.forEach(i => {
                        i.classList.remove('active');
                        const c = i.querySelector('[data-accordion-content]');
                        if (c) c.style.maxHeight = null;
                    });

                    if (!isOpen) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            });
        });
    };

    /* =====================================================
       INITIALIZATION
       ===================================================== */
    const init = () => {
        initPreloader();
        initHeader();
        initMobileNav();
        initScrollReveal();
        initCounters();
        initParallax();
        initSmoothScroll();
        initTypewriter();
        initTilt3D();
        initMagnetic();
        initProgressBars();
        initParticles();
        initCustomCursor();
        initLiveClock();
        initContactForm();
        initThemeToggle();
        initCodeHighlight();
        initLiveStatus();
        initLazyLoad();
        initKonamiCode();
        initBackToTop();
        initTabs();
        initSearch();
        initAccordion();

        console.log('%c⚡ devflowbytegrid.com', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
        console.log('%cPrivacy First. Innovation Always.', 'color: #7c3aed; font-size: 14px; font-style: italic;');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
