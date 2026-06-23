/* ==========================================================================
   JAVASCRIPT LOGIC - La Maison du Bosquet
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PAGE LOADER & HERO ANIMATION INIT
  const pageLoader = document.querySelector('.page-loader');
  
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hide');
      document.body.classList.add('loaded'); // Déclenche les anims Hero
      setTimeout(() => pageLoader.remove(), 800); // Nettoyage
    }, 1200);
  } else {
    document.body.classList.add('loaded');
  }

  // Split H1 text into words for stagger animation
  const h1 = document.querySelector('.hero-title');
  if (h1) {
    const text = h1.textContent.trim();
    h1.innerHTML = '';
    text.split(/\s+/).forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.className = 'word';
      span.style.animationDelay = `${0.8 + (index * 0.1)}s`;
      h1.appendChild(span);
      // Add explicit whitespace node to fix spacing bug
      h1.appendChild(document.createTextNode(' '));
    });
  }

  // 2. STICKY HEADER
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // init

  // 3. INTERSECTION OBSERVER (REVEAL & COMPTEURS)
  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(easeProgress * target) + (el.getAttribute('data-suffix') || '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + (el.getAttribute('data-suffix') || '');
      }
    };
    window.requestAnimationFrame(step);
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Handle stagger for children if they exist
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
        });

        // Handle counters
        const counters = entry.target.querySelectorAll('.counter-val');
        counters.forEach(counter => {
          if (!counter.classList.contains('counted')) {
            runCounter(counter);
            counter.classList.add('counted');
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal-section').forEach(section => {
    revealObserver.observe(section);
  });

  // 4. PARALLAX EXPERIENCES (Cinematic & Planning)
  const planningSection = document.querySelector('.section-planning');
  const heroScene = document.getElementById('heroImgScene');
  const heroImg = document.getElementById('heroImgContent');
  const heroTextWrapper = document.querySelector('.hero-text-wrapper');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // A. Cinematic Hero Parallax
    if (heroScene && heroImg && heroTextWrapper) {
      if (scrollY < window.innerHeight * 1.5) { // Active only near top
        // Image scene glides up faster
        heroScene.style.transform = `translateY(-${scrollY * 0.3}px)`;
        // Image content slightly moving inside
        heroImg.style.transform = `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0003})`;
        
        // Text fades out
        heroTextWrapper.style.opacity = Math.max(0, 1 - (scrollY / 600));
        heroTextWrapper.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    }

    // B. Planning Section Parallax
    if (planningSection) {
      const rect = planningSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.2;
        planningSection.style.backgroundPosition = `center ${offset}px`;
      }
    }
  }, { passive: true });

  // 5. CAROUSEL TÉMOIGNAGES
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  if (track && dots.length > 0) {
    let currentSlide = 0;
    const updateCarousel = (index) => {
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
      const slides = track.querySelectorAll('.carousel-slide');
      slides.forEach(s => s.classList.remove('active'));
      const width = slides[0].clientWidth;
      track.style.transform = `translateX(-${index * width}px)`;
      slides[index].classList.add('active');
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel(currentSlide);
      });
    });

    let autoPlay = setInterval(() => {
      currentSlide = (currentSlide + 1) % dots.length;
      updateCarousel(currentSlide);
    }, 5000);

    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', () => clearInterval(autoPlay));
    container.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateCarousel(currentSlide);
      }, 5000);
    });

    // Handle Resize
    window.addEventListener('resize', () => updateCarousel(currentSlide));
  }

  // 6. SCROLL INDICATOR
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      }
    }, { once: true });
  }

  // 7. MENU BURGER
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = burgerBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      
      const items = mobileMenu.querySelectorAll('li');
      items.forEach((item, index) => {
        if(isOpen) {
          item.style.transitionDelay = `${index * 0.05}s`;
        } else {
          item.style.transitionDelay = '0s';
        }
      });
    });
  }

  // 8. LAZY LOADING IMAGES BLUR
  const lazyImages = document.querySelectorAll('img.lazy-image');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });

  // 9. PAGE TRANSITIONS (INTERNE LINKS)
  const transitionEl = document.querySelector('.page-transition');
  document.querySelectorAll('a[href^="/"], a[href^="."]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('target') === '_blank' || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const targetUrl = link.href;
      if(transitionEl) {
        transitionEl.classList.add('active');
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 400); // Correspond à la transition CSS
      } else {
         window.location.href = targetUrl;
      }
    });
  });

  // 10. CUSTOM CURSOR (DESKTOP LERP)
  if (window.innerWidth >= 1024) {
    document.body.classList.add('custom-cursor-active');
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorText = document.createElement('span');
    cursorText.className = 'custom-cursor-text';
    cursor.appendChild(cursorText);
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor.style.opacity === '0' || cursor.style.opacity === '') {
        cursor.style.opacity = '1';
      }
    });

    const render = () => {
      // Lerp
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(render);
    };
    render();

    // Hover effects on links & btns
    const hoverElements = document.querySelectorAll('a, button, .card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        if(el.classList.contains('btn-cta') || el.classList.contains('card-btn')) {
          cursorText.textContent = 'Go';
        } else if (el.classList.contains('card')) {
          cursorText.textContent = 'Voir';
        } else {
          cursorText.textContent = '';
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
  }

  // 11. CANVAS PARTICLES HERO
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 30;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

});
