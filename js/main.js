// ==========================================================================
// Main JavaScript for Biveen Shajilal Portfolio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- Hamburger Menu Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('is-active');
            navToggle.classList.toggle('is-active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });

        // Close menu when clicking any link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Active Navigation Link Highlight ----
    const currentPath = window.location.pathname;
    const page = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    document.querySelectorAll('.nav-menu .nav-link, .navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ---- Scroll Progress Bar ----
    const progress = document.getElementById('scroll-progress');
    if (progress) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
            progress.style.width = Math.min(Math.max(scrolled * 100, 0), 100) + '%';
        }, { passive: true });
    }

    // ---- Reveal on Scroll ----
    const revealElements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (revealElements.length > 0) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => io.observe(el));
    }

    // ---- Animated Counters (for Stats) ----
    const statElements = document.querySelectorAll('.stat-num');
    if (statElements.length > 0) {
        const counterIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const decimals = parseInt(el.dataset.decimals || '0', 10);
                const suffix = el.dataset.suffix || '';
                const dur = 1400; 
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = (target * eased).toFixed(decimals) + (p === 1 ? suffix : '');
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = target.toFixed(decimals) + suffix;
                }
                requestAnimationFrame(tick);
                counterIO.unobserve(el);
            });
        }, { threshold: 0.4 });
        statElements.forEach(el => counterIO.observe(el));
    }

    // ---- Footer Year ----
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ---- Rubidium Bohr Atom Simulation (Z=37, shells 2,8,18,8,1) ----
    const host = document.getElementById('atomShells');
    if (host) {
        const SHELLS = [2, 8, 18, 8, 1];
        const durations = [14, 20, 28, 36, 48];
        function buildAtom() {
            host.innerHTML = '';
            const vmax = Math.max(window.innerWidth, window.innerHeight);
            const innerR = 90;                 // closest orbit hugs the photo
            const outerR = vmax * 0.62 * 0.6;   // outermost orbit
            const n = SHELLS.length;
            SHELLS.forEach((count, i) => {
                const r = innerR + (outerR - innerR) * (i / (n - 1));
                const shell = document.createElement('span');
                shell.className = 'shell' + (i % 2 ? ' rev' : '');
                shell.style.width = shell.style.height = (r * 2) + 'px';
                shell.style.setProperty('--dur', durations[i] + 's');
                const isValence = (i === n - 1);
                for (let k = 0; k < count; k++) {
                    const e = document.createElement('i');
                    e.className = 'electron' + (isValence ? ' valence' : '');
                    e.style.setProperty('--a', (360 / count * k) + 'deg');
                    e.style.setProperty('--r', r + 'px');
                    shell.appendChild(e);
                }
                host.appendChild(shell);
            });
        }
        buildAtom();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildAtom, 200);
        });
    }
});
