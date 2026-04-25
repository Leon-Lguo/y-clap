/* ============================================
   Y-CLAP Website — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     Mobile Navigation Toggle
     ============================================ */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================
     Header scroll effect
     ============================================ */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ============================================
     Scroll-triggered animations
     ============================================ */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  /* ============================================
     Active nav link based on current page
     ============================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================
     Contact form handling
     ============================================ */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Let Netlify Forms handle submission
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      }).then(() => {
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = 'var(--color-secondary)';
        btn.style.borderColor = 'var(--color-secondary)';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
        }, 3000);
      }).catch(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
    });
  }

  /* ============================================
     Smooth scroll for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================
     Counter animation for stats
     ============================================ */
  function animateCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.getAttribute('data-counter'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      update();
    });
  }

  // Trigger counter animation when hero is visible
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

});
