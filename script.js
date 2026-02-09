/**
 * AI Generalist Landing Page - JavaScript
 * Scroll animations, counters, FAQ accordion, mobile navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimations();
    initFAQAccordion();
    initMobileNavigation();
    initSmoothScroll();
    initTiltEffect();
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);

    animatedElements.forEach(element => observer.observe(element));
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

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

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    window.addEventListener('mousemove', e => {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        orbs.forEach((orb, i) => {
            orb.style.transform = `translate(${moveX * (i + 1)}px, ${moveY * (i + 1)}px)`;
        });
    });
}
if (window.innerWidth > 1024) initParallax();

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.background = window.scrollY > 50
        ? 'rgba(10,10,10,0.95)'
        : 'rgba(10,10,10,0.8)';
});

function openContactModal() {
    const modal = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form) form.style.display = 'flex';
    if (success) success.style.display = 'none';
    if (form) form.reset();

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

/* ✅ UPDATED FUNCTION ONLY */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('button[type="submit"]');

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value || 'No message provided'
    };

    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    /* SEND TO GOOGLE SHEET */
    fetch("https://script.google.com/macros/s/AKfycbyO4qpoAFef3EcLG5SVbsnbjoqXMEHsR--glWIY2J1wpS8UwuTE01j9r-_MvCGcPxAz/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData)
    });

    /* EMAILJS */
    const EMAILJS_PUBLIC_KEY = 'it1n8lwTOFybvJb1x';
    const EMAILJS_SERVICE_ID = 'service_ld22ohj';
    const EMAILJS_TEMPLATE_ID = 'template_gk53aw5';

    emailjs.init(EMAILJS_PUBLIC_KEY);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_name: 'Innoworq Academy Team',
        reply_to: formData.email
    })
        .then(function () {
            if (form) form.style.display = 'none';
            if (success) success.style.display = 'block';
        })
        .catch(function (error) {
            console.error('Failed to send email:', error);
            alert('Sorry, there was an error sending your enquiry.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Enquiry';
        });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactModal();
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) closeContactModal();
});

window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.handleFormSubmit = handleFormSubmit;

function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / rect.height) * -5;
            const rotateY = ((x - rect.width / 2) / rect.width) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/* ==========================================
   Sticky Offer Bar Logic
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    initOfferBar();
});

function initOfferBar() {
    const offerBar = document.getElementById('stickyOfferBar');
    if (!offerBar) return;

    // FORCE SHOW for debugging - bypassing checks
    // if (isOfferExpired()) return;
    // if (!localStorage.getItem('offerClosed')) ...

    setTimeout(() => {
        offerBar.classList.add('visible');
    }, 500);
}

function closeOfferBar() {
    const offerBar = document.getElementById('stickyOfferBar');
    if (offerBar) {
        offerBar.classList.remove('visible');
        localStorage.setItem('offerClosed', 'true');
    }
}
window.closeOfferBar = closeOfferBar;

function isOfferExpired() {
    // 3 Days Rule: logic to check if current time > expiry
    // If we want a fixed 3 days from "now" (simulated) or a rolling 3 days?
    // User said "After 3 days (till Thursday)".
    // I will use the same 'Next Thursday' logic but tailored.
    const expiryDate = getNextThursday();
    const now = new Date();
    return now > expiryDate;
}

function getNextThursday() {
    const now = new Date();
    const resultDate = new Date(now.getTime());

    const day = now.getDay();
    let daysUntilThursday = 4 - day;

    if (daysUntilThursday <= 0) {
        daysUntilThursday += 7;
    }

    resultDate.setDate(now.getDate() + daysUntilThursday);
    resultDate.setHours(23, 59, 59, 999);

    return resultDate;
}
