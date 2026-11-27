document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const preloader = document.getElementById('preloader');

    // =========================================
    // 1. INTRO PRELOADER -> TRIGGER HERO & LANYARD
    // =========================================
    body.classList.add('is-loading');

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
        }
        body.classList.remove('is-loading');
        body.classList.add('site-loaded');

        // Picu lanyard jatuh & berayun setelah intro selesai
        triggerLanyardDrop();

        setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
        }, 700);
    }, 2600);

    // =========================================
    // 2. INTERACTIVE CURSOR GLOW
    // =========================================
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // =========================================
    // 3. CUSTOM TYPEWRITER (TANPA LIBRARY LUAR)
    // =========================================
    const typeTarget = document.getElementById('typewriterText');
    const roles = [
        'Junior Programmer',
        'Frontend Enthusiast',
        'UI/UX Designer',
        'PPL Student — Gen 5'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function runTypewriter() {
        if (!typeTarget) return;
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(runTypewriter, 1600);
                return;
            }
            setTimeout(runTypewriter, 75);
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(runTypewriter, 350);
                return;
            }
            setTimeout(runTypewriter, 40);
        }
    }

    // Mulai mengetik tepat setelah preloader menutup
    setTimeout(runTypewriter, 2900);

    // =========================================
    // 4. PHYSICS LANYARD (DROP, SWING, DRAG & 3D TILT)
    // =========================================
    const lanyard = document.getElementById('lanyardAssembly');
    const card = document.getElementById('lanyardCard');

    let angle = -28;
    let angleVel = 0;
    let dropY = -680;
    let dropVel = 0;
    let hasDropped = false;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let targetDragAngle = 0;
    let targetDragY = 0;

    function triggerLanyardDrop() {
        hasDropped = true;
        dropY = -520;
        dropVel = 18;
        angle = -26;
        angleVel = 2.4;
    }

    if (lanyard && card) {
        const onDragStart = (e) => {
            isDragging = true;
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            lastX = point.clientX;
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            const point = e.touches ? e.touches[0] : e;
            const dx = point.clientX - startX;
            const dy = point.clientY - startY;
            const deltaX = point.clientX - lastX;
            lastX = point.clientX;

            targetDragAngle = Math.max(-42, Math.min(42, -dx * 0.22));
            targetDragY = Math.max(-35, Math.min(65, dy * 0.28));
            angleVel = -deltaX * 0.18;
        };

        const onDragEnd = () => {
            isDragging = false;
        };

        lanyard.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);

        lanyard.addEventListener('touchstart', onDragStart, { passive: true });
        window.addEventListener('touchmove', onDragMove, { passive: true });
        window.addEventListener('touchend', onDragEnd);

        card.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });

        function animateLanyard() {
            if (hasDropped) {
                if (isDragging) {
                    angle += (targetDragAngle - angle) * 0.25;
                    dropY += (targetDragY - dropY) * 0.25;
                } else {
                    angleVel += -angle * 0.042;
                    angleVel *= 0.935;
                    angle += angleVel;

                    dropVel += (0 - dropY) * 0.085;
                    dropVel *= 0.80;
                    dropY += dropVel;
                }
            }

            lanyard.style.transform = `translateY(${dropY.toFixed(2)}px) rotate(${angle.toFixed(2)}deg)`;
            requestAnimationFrame(animateLanyard);
        }

        animateLanyard();
    }

    // =========================================
    // 5. SCROLL REVEAL (UNTUK SECTION DI BAWAHNYA)
    // =========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach((el) => revealObserver.observe(el));
    }
    /* =========================================
       7. PORTFOLIO TABS (PROJECTS / CERT / TECH / CREATIVE)
       ========================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                tabBtns.forEach((b) => b.classList.remove('active'));
                tabPanes.forEach((p) => p.classList.remove('active'));

                btn.classList.add('active');

                const targetId = (btn.dataset.tab || btn.dataset.target || '').replace('#', '');
                const targetPane = targetId
                    ? document.getElementById(targetId)
                    : tabPanes[index];

                if (targetPane) targetPane.classList.add('active');
            });
        });
    }

    /* =========================================
       8. PROJECT MODAL (POP-UP DETAIL)
       ========================================= */
    const modal = document.querySelector('.modal-container');
    const openModalBtns = document.querySelectorAll('.details-link');
    const closeModalBtn = document.querySelector('.close-btn');

    if (modal) {
        const closeModal = () => {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        };

        openModalBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                body.classList.add('no-scroll');
            });
        });

        closeModalBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    }

    // Aktifkan efek kursor untuk elemen baru di tab portofolio
    document.querySelectorAll('.tab-btn, .tech-item, .project-card, .certificate-card, .close-btn').forEach((el) => {
        el.addEventListener('mouseenter', () => cursorRing?.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hovering'));
    });
});