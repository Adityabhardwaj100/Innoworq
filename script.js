/**
 * AI Generalist Landing Page - JavaScript
 * Scroll animations, counters, FAQ accordion, mobile navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initScrollAnimations();
    initCounterAnimations();
    initFAQAccordion();
    initMobileNavigation();
    initSmoothScroll();
    initTiltEffect();

});

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animated number counters
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

/**
 * FAQ Accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Mobile Navigation toggle
 */
function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add parallax effect to hero gradient orbs
 */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        orbs.forEach((orb, index) => {
            const intensity = (index + 1) * 0.5;
            orb.style.transform = `translate(${moveX * intensity}px, ${moveY * intensity}px)`;
        });
    });
}

// Optional: Initialize parallax on larger screens only
if (window.innerWidth > 1024) {
    initParallax();
}

/**
 * Navbar background on scroll
 */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }
});

/**
 * Contact Modal functionality
 */
function openContactModal() {
    const modal = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    // Reset to form view
    if (form) form.style.display = 'flex';
    if (success) success.style.display = 'none';

    // Reset form fields
    if (form) form.reset();

    // Show modal
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value || 'No message provided'
    };

    // Basic validation (HTML5 required handles most of it)
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    // ============================================
    // EMAILJS CONFIGURATION
    // Replace these with your actual EmailJS credentials:
    // 1. Go to https://www.emailjs.com/ and create a free account
    // 2. Add an email service (Gmail, Outlook, etc.)
    // 3. Create an email template with variables: {{name}}, {{email}}, {{phone}}, {{message}}
    // 4. Get your Public Key, Service ID, and Template ID
    // ============================================
    const EMAILJS_PUBLIC_KEY = 'it1n8lwTOFybvJb1x';
    const EMAILJS_SERVICE_ID = 'service_ld22ohj';
    const EMAILJS_TEMPLATE_ID = 'template_gk53aw5';

    // Initialize EmailJS (only needed once, but safe to call multiple times)
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Send the email
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        // You can add more template variables here
        to_name: 'Innoworq Academy Team',
        reply_to: formData.email
    })
        .then(function (response) {
            console.log('Email sent successfully!', response.status, response.text);
            // Show success message
            if (form) form.style.display = 'none';
            if (success) success.style.display = 'block';
        })
        .catch(function (error) {
            console.error('Failed to send email:', error);
            alert('Sorry, there was an error sending your enquiry. Please try again or contact us directly.');
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Submit Enquiry</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>`;
        });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) {
        closeContactModal();
    }
});

// Make functions globally available
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.handleFormSubmit = handleFormSubmit;

/**
 * 3D Tilt Effect for Tool Cards
 */
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            // Adjust glow position
            const glow = card.querySelector('.tool-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--glow-color), transparent 70%)`;
                glow.style.opacity = '0.3';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';

            const glow = card.querySelector('.tool-glow');
            if (glow) {
                glow.style.opacity = '0';
                // Reset gradient position after a delay for smoothness
                setTimeout(() => {
                    glow.style.background = `radial-gradient(circle at 50% 0%, var(--glow-color), transparent 70%)`;
                }, 300);
            }
        });
    });
}
