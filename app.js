document.addEventListener('DOMContentLoaded', () => {
    // Ikon SVG untuk Tema
    const sunIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    // 1. Pengaturan Tema (Dark / Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    const applyTheme = (theme) => {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = moonIcon;
        } else {
            htmlElement.removeAttribute('data-theme');
            themeToggle.innerHTML = sunIcon;
        }
    };

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isLight = htmlElement.getAttribute('data-theme') === 'light';
        const nextTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });

    // 2. Helper Toast Notification
    const toastEl = document.getElementById('toast');
    let toastTimeout;

    const showToast = (message) => {
        toastEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2800);
    };

    // 3. Tahun Otomatis di Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 4. Efek Spotlight Hover pada Kartu
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Filter Proyek
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 6. Modal Detail Proyek (termasuk pratinjau gambar)
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalImgWrap = document.getElementById('modal-img-wrap');
    const modalImg = document.getElementById('modal-img');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = card.getAttribute('data-title');
            document.getElementById('modal-year').textContent = card.getAttribute('data-year');
            document.getElementById('modal-role').textContent = card.getAttribute('data-role');
            document.getElementById('modal-stack').textContent = card.getAttribute('data-stack');
            document.getElementById('modal-desc').textContent = card.getAttribute('data-desc');
            document.getElementById('modal-link').href = card.getAttribute('data-link');

            const imgSrc = card.getAttribute('data-image');
            if (imgSrc) {
                modalImgWrap.style.display = 'block';
                modalImg.src = imgSrc;
                modalImg.onerror = () => {
                    modalImgWrap.style.display = 'none';
                };
            } else {
                modalImgWrap.style.display = 'none';
            }
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const hideModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    closeModal.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            hideModal();
        }
    });

    // 7. Salin Alamat Email
    const copyBtn = document.getElementById('copy-btn');
    const email = 'muhaiminmahmud06@gmail.com';

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Alamat email disalin ke clipboard');
        });
    });

    // 8. Integrasi Formulir Kontak (WhatsApp & Gmail Web)
    const sendWaBtn = document.getElementById('send-wa-btn');
    const contactForm = document.getElementById('contact-form');

    sendWaBtn.addEventListener('click', () => {
        const name = document.getElementById('sender-name').value.trim();
        const message = document.getElementById('sender-message').value.trim();

        if (!name || !message) {
            showToast('Mohon isi nama dan pesan terlebih dahulu.');
            return;
        }

        const phoneNumber = '6285137375672'; 
        const text = `Halo Muhaimin, saya *${name}*.\n\n${message}`;
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        
        window.open(waUrl, '_blank', 'noopener');
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value.trim();
        const message = document.getElementById('sender-message').value.trim();

        if (!name || !message) {
            showToast('Mohon isi nama dan pesan terlebih dahulu.');
            return;
        }

        const subject = encodeURIComponent(`Pesan Portofolio dari ${name}`);
        const body = encodeURIComponent(`Halo Muhaimin,\n\nNama: ${name}\n\nPesan:\n${message}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
        
        window.open(gmailUrl, '_blank', 'noopener');
    });

    // 9. Scroll Reveal & Active Nav Spy
    const revealElements = document.querySelectorAll('.reveal');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});