/* ═══════════════════════════════════════════════
   NexGen Web Solutions — script.js
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     1. NAVBAR — Scroll + Mobile Menu
  ══════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    updateBackToTop();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  /* Active link on scroll */
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  /* ══════════════════════════════════
     2. REVEAL ANIMATIONS
  ══════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ══════════════════════════════════
     3. COUNTER ANIMATION
  ══════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = target / (duration / 16);
    let   current  = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ══════════════════════════════════
     4. PORTFOLIO FILTER
  ══════════════════════════════════ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity  = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity  = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  });

  /* ══════════════════════════════════
     5. TESTIMONIALS SLIDER
  ══════════════════════════════════ */
  const track     = document.getElementById('testimonials-track');
  const tPrev     = document.getElementById('tprev');
  const tNext     = document.getElementById('tnext');
  const dotsWrap  = document.getElementById('tcontrol-dots');

  const cards = track.querySelectorAll('.testimonial-card');
  let   currentSlide = 0;
  let   slidesPerView = getSlidesPerView();
  const totalSlides   = cards.length;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function maxSlide() { return Math.max(0, totalSlides - slidesPerView); }

  /* Build dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxSlide() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'tdot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.tdot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function goTo(index) {
    currentSlide = Math.max(0, Math.min(index, maxSlide()));
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    updateDots();
  }

  tPrev.addEventListener('click', () => goTo(currentSlide - 1));
  tNext.addEventListener('click', () => goTo(currentSlide + 1));

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    currentSlide  = Math.min(currentSlide, maxSlide());
    buildDots();
    goTo(currentSlide);
  });

  buildDots();

  /* Auto-advance */
  let autoSlide = setInterval(() => goTo(currentSlide < maxSlide() ? currentSlide + 1 : 0), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo(currentSlide < maxSlide() ? currentSlide + 1 : 0), 5000);
  });

  /* Touch swipe for testimonials */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }, { passive: true });

  /* ══════════════════════════════════
     6. BACK TO TOP
  ══════════════════════════════════ */
  const backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══════════════════════════════════
     7. CONTACT FORM VALIDATION
  ══════════════════════════════════ */
  const form        = document.getElementById('contact-form');
  const formFields  = document.getElementById('form-fields');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('form-submit-btn');
  const btnText     = submitBtn.querySelector('.btn-text');
  const btnLoader   = submitBtn.querySelector('.btn-loader');
  const btnIcon     = submitBtn.querySelector('.btn-icon');

  function showError(id, show) {
    const el = document.getElementById(id);
    const input = el.previousElementSibling || el.parentElement.querySelector('.form-input');
    if (el) el.classList.toggle('visible', show);
    if (input && input.classList.contains('form-input')) {
      input.classList.toggle('error', show);
    }
  }

  function validateForm() {
    let valid = true;

    const name    = document.getElementById('f-name');
    const email   = document.getElementById('f-email');
    const service = document.getElementById('f-service');
    const message = document.getElementById('f-message');

    // Name
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('err-name', true);
      valid = false;
    } else {
      showError('err-name', false);
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError('err-email', true);
      valid = false;
    } else {
      showError('err-email', false);
    }

    // Service
    if (!service.value) {
      showError('err-service', true);
      valid = false;
    } else {
      showError('err-service', false);
    }

    // Message
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('err-message', true);
      valid = false;
    } else {
      showError('err-message', false);
    }

    return valid;
  }

  // Real-time validation clear
  ['f-name', 'f-email', 'f-service', 'f-message'].forEach(id => {
    const el = document.getElementById(id);
    const errId = 'err-' + id.replace('f-', '');
    el.addEventListener('input', () => { showError(errId, false); el.classList.remove('error'); });
    el.addEventListener('change', () => { showError(errId, false); el.classList.remove('error'); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 🔴 REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyoRjk5IZWQjqzQWUfqd6iWQdL0gVgn_8rkYemSMY9JD4fS2SdabnA3yc2wrORoOGG0mA/exec'; 
    const formData = new FormData(form);

    // Show loading state
    btnText.style.display   = 'none';
    btnIcon.style.display   = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled      = true;

    if (scriptURL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
      // Simulate sending if URL is not yet set
      setTimeout(() => {
        formFields.style.display = 'none';
        formSuccess.classList.add('visible');
      }, 1800);
      console.warn("Please replace 'YOUR_GOOGLE_SCRIPT_URL_HERE' with your actual Google Script URL.");
      return;
    }

    fetch(scriptURL, { method: 'POST', body: new URLSearchParams(formData)})
      .then(response => {
        formFields.style.display = 'none';
        formSuccess.classList.add('visible');
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert('Oops! Something went wrong. Please try again.');
        // Reset button
        btnText.style.display   = 'block';
        btnIcon.style.display   = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled      = false;
      });
  });

  /* ══════════════════════════════════
     8. SMOOTH SCROLL FOR ANCHORS
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════
     9. HERO PARALLAX EFFECT
  ══════════════════════════════════ */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBgImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  /* Initial calls */
  updateBackToTop();
  updateActiveLink();
});
