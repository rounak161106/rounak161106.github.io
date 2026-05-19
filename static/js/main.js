// ===================================
// MODERN DATA SCIENCE PORTFOLIO JS
// Author: Rounak Prasad
// ===================================

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Preloader is handled by preloader.js

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the main cursor
        cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`;
    });
    
    // Smooth follow for the follower cursor using rAF
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2; // Ease factor
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursorFollower.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0) ${isHovering ? 'scale(1.8)' : 'scale(1)'}`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor effects on hover
    const hoverElements = document.querySelectorAll('a, button, .project-card, .cert-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0) scale(1.5)`;
        });
        
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0) scale(1)`;
        });
    });

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded);
    });
}

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Active nav link via IntersectionObserver (High Performance)
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver((entries) => {
    // Find the intersecting entry that is taking up the most space
    let currentSection = null;
    let maxRatio = 0;
    
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            currentSection = entry.target.getAttribute('id');
        }
    });
    
    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}, { 
    threshold: [0.2, 0.5, 0.8],
    rootMargin: '-10% 0px -40% 0px' 
});

sections.forEach(section => {
    navObserver.observe(section);
});

// ===== TYPING EFFECT =====
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const texts = [
        'Aspiring Data Scientist',
        'Machine Learning Enthusiast',
        'Python Developer',
        'AI Researcher'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// ===== ANIMATED COUNTERS =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Trigger counter animation when in viewport
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

// Skill bars replaced with chip grid — no progress bars to animate


// ===== CERTIFICATION TABS =====
document.addEventListener('DOMContentLoaded', () => {
    const certTabs = document.querySelectorAll('.cert-tab');
    const certCategories = document.querySelectorAll('.cert-category');

    if (certTabs.length === 0 || certCategories.length === 0) return;

    certTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and categories
            certTabs.forEach(t => t.classList.remove('active'));
            certCategories.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding category
            const categoryElement = document.querySelector(`.cert-category[data-category="${targetCategory}"]`);
            
            if (categoryElement) {
                categoryElement.classList.add('active');
                categoryElement.style.display = 'block';
            }
            
            // Refresh AOS animations
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
});

// ===== CERTIFICATE MODAL =====
function openCertModal(imageSrc) {
    const modal = document.getElementById('certModal');
    const modalImage = document.getElementById('modalCertImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

// ===== CONTACT FORM WITH WEB3FORMS =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
                formStatus.style.display = 'block';
                contactForm.reset();
                // Celebration confetti
                if (typeof fireConfetti === 'function') fireConfetti(submitBtn);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send. Please try again.';
            formStatus.style.display = 'block';
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    });
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX EFFECT =====
// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parallax removed — CSS orb-morph animations handle movement now



// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Other scroll-heavy logic if needed (nav link logic moved to IntersectionObserver)
}, 100));



// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;

// ===== ANALYTICS (Optional - uncomment when ready) =====
/*
// Track page views
if (typeof gtag !== 'undefined') {
    gtag('config', 'YOUR-GA-ID', {
        page_path: window.location.pathname
    });
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'Button',
                event_label: btn.textContent.trim()
            });
        }
    });
});
*/

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modal when it opens
const modal = document.getElementById('certModal');
if (modal) {
    let focusTrapBound = false;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (modal.classList.contains('active') && !focusTrapBound) {
                    trapFocus(modal);
                    focusTrapBound = true;
                }
            }
        });
    });
    
    observer.observe(modal, { attributes: true });
}




// Theme Switcher Removed per user request to improve performance and code simplicity

// ===== SECTION DIVIDER DRAW-IN ANIMATION =====
const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            dividerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.section-divider').forEach(d => dividerObserver.observe(d));

// ===== STAGGERED CARD CASCADE REVEALS =====
const cascadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.project-card, .cert-card');
            cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                });
            });
            cascadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.projects-grid, .cert-grid').forEach(g => cascadeObserver.observe(g));

// ===== CONFETTI CELEBRATION (form success) =====
function fireConfetti(originEl) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#22c55e', '#fbbf24'];
    const particles = [];
    const rect = originEl ? originEl.getBoundingClientRect() : { left: canvas.width / 2, top: canvas.height / 2, width: 0, height: 0 };
    const cx = rect.left + (rect.width || 0) / 2;
    const cy = rect.top + (rect.height || 0) / 2;

    for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: 0.012 + Math.random() * 0.01,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    let frame;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
            if (p.alpha <= 0) return;
            alive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.alpha -= p.decay;
            p.rotation += p.rotSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });
        if (alive) frame = requestAnimationFrame(animate);
        else { cancelAnimationFrame(frame); canvas.remove(); }
    }
    animate();
}
window.fireConfetti = fireConfetti;
