// Utilities
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// Splash screen with dynamic title
(function splashInit() {
  const splash = $('#splash');
  const favicon = $('link[rel="icon"]');
  const titleBase = 'NaYanRajput Portfolio • begineer Developer';
  
  let dots = 0;
  const titleInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    document.title = `${titleBase}${'.'.repeat(dots)}`;
  }, 350);

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('hide');
      clearInterval(titleInterval);
      document.title = titleBase;
      if (favicon) favicon.href = 'pfp.png';
    }, 900);
  });
})();

// Fixed typing animation (no glitch on last letter)
const typingPhrases = [
  'Begineer Developer',
  'Discord Bot Creator',
  'Web Designer',
  'Begineer Engineer',
  'TeleGram Bots Creator'
];

(function typeInit() {
  const node = $('.typing-text');
  if (!node) return;
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeStep() {
    const currentPhrase = typingPhrases[phraseIndex];
    
    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      node.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex = Math.min(currentPhrase.length, charIndex + 1);
      node.textContent = currentPhrase.substring(0, charIndex);
    }
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      speed = 500; // Pause before next phrase
    }
    
    setTimeout(typeStep, speed);
  }
  
  setTimeout(typeStep, 300);
})();

// Enhanced mobile menu toggle
(function menuInit() {
  const burger = $('#hamburger');
  const menu = $('#menu');
  const overlay = $('#mobileOverlay');
  
  if (!burger || !menu || !overlay) return;
  
  function toggleMenu() {
    const isActive = menu.classList.toggle('active');
    burger.classList.toggle('active');
    overlay.classList.toggle('active');
    burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
  }
  
  function closeMenu() {
    menu.classList.remove('active');
    burger.classList.remove('active');
    overlay.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  
  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
})();

// Smooth section transitions
(function sectionTransitions() {
  const sections = $$('.section-content');
  let currentSection = $('#home');
  
  function showSection(targetSection) {
    if (currentSection === targetSection) return;
    
    // Fade out current section
    currentSection.classList.add('fade-out');
    
    setTimeout(() => {
      // Hide current section and show target section
      currentSection.classList.remove('active', 'fade-out');
      targetSection.classList.add('fade-in-right');
      
      setTimeout(() => {
        targetSection.classList.add('active');
        targetSection.classList.remove('fade-in-right');
        currentSection = targetSection;
      }, 50);
    }, 250);
  }
  
  // Handle navigation clicks
  $$('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-section');
      const targetSection = $(`#${targetId}`);
      
      if (targetSection) {
        e.preventDefault();
        
        // Update URL without jumping
        history.pushState(null, '', `#${targetId}`);
        
        // Show section transition
        showSection(targetSection);
        
        // Smooth scroll to section after transition
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 300);
      }
    });
  });
})();

// Intersection Observer for scroll animations
(function scrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate skills when skills section is visible
        if (entry.target.classList.contains('skills-content')) {
          animateSkills();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });
  
  $$('.fade-in, .slide-up, .skills-content').forEach(el => {
    observer.observe(el);
  });
})();

// Animate skill bars
function animateSkills() {
  $$('.skill-progress').forEach(bar => {
    const progress = parseInt(bar.getAttribute('data-progress')) || 0;
    requestAnimationFrame(() => {
      bar.style.width = progress + '%';
    });
  });
}

// Navbar background on scroll
(function navScroll() {
  let ticking = false;
  const nav = $('#navbar');
  
  function updateNavbar() {
    if (ticking) return;
    ticking = true;
    
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset > 96;
      nav.style.background = scrolled ? 'rgba(2,3,12,.92)' : 'rgba(0,0,0,.5)';
      ticking = false;
    });
  }
  
  window.addEventListener('scroll', updateNavbar, { passive: true });
})();

// 3D tilt effect on profile image
(function profileTilt() {
  const profileImg = $('.profile-img');
  if (!profileImg) return;
  
  let rafId = 0;
  
  profileImg.addEventListener('mousemove', (e) => {
    const rect = profileImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      profileImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
  });
  
  profileImg.addEventListener('mouseleave', () => {
    profileImg.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
})();

// Magnetic hover effect for social links
(function magneticEffect() {
  const magnets = $$('.magnetic');
  
  magnets.forEach(el => {
    let rafId;
    const strength = 12;
    
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      });
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
})();

// Particles animation
(function particlesInit() {
  const canvas = $('#particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w, h;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  function resize() {
    w = canvas.clientWidth = canvas.offsetWidth;
    h = canvas.clientHeight = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    hue: 200 + Math.random() * 60
  }));
  
  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > w) particle.vx *= -1;
      if (particle.y < 0 || particle.y > h) particle.vy *= -1;
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, 12
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0.9)`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 60%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();

// Ripple effect on click
(function rippleEffect() {
  function createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.28);
      transform: scale(0);
      pointer-events: none;
      opacity: 1;
      filter: blur(0.5px);
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.25);
      animation: ripple 0.6s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 650);
  }
  
  [...$$('.btn'), ...$$('.social-link')].forEach(el => {
    el.addEventListener('click', e => createRipple(el, e));
  });
  
  // Add ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Initial visibility check for above-the-fold elements
  $$('.fade-in, .slide-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.86) {
      el.classList.add('visible');
    }
  });
});

// Email click handler
document.querySelector('.contact-item .fas.fa-envelope').parentElement.addEventListener('click', function() {
  const email = 'nayansrajput265@gmail.com';
  window.location.href = `mailto:${email}`;
});

// location click handler
document.querySelector('.contact-item .fas.fa-map-marker-alt').parentElement.addEventListener('click', function() {
  const loc = 'https://www.google.com/maps/place/surat,+India';
  window.open(loc, '_blank');
});


(function(){
    // Instagram popup functionality (protected)
    const _storageKey = 'NayanRajput_popup_hide';
    if(localStorage.getItem(_storageKey)) return;

    // Create popup container
    const popup = document.createElement("div");
    popup.style.cssText = `
        position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
        background:rgba(10,10,20,0.65);backdrop-filter:blur(4px);
        z-index:999999;opacity:0;pointer-events:none;transition:opacity .3s ease;
    `;

    // Inner card
    const card = document.createElement("div");
    card.style.cssText = `
        background:linear-gradient(180deg,rgba(0, 0, 0, 0.44),rgba(0, 0, 0, 0.58));
        border:1px solid rgba(0, 0, 0, 0.05);
        padding:22px 24px;border-radius:16px;text-align:center;
        box-shadow:0 12px 40px rgba(0,0,0,0.6);color:#eaeaea;
        font-family:Poppins,system-ui,sans-serif;max-width:420px;width:90%;position:relative;
        animation:fadeIn .6s ease;
    `;

    // Title
    const title = document.createElement("h2");
    title.innerHTML = `Website made by <span style="text-shadow:0 0 10px #000000ff; font-weight: 700; font-size: 1.15rem; letter-spacing: .2px; background: linear-gradient(135deg, #6ea8ff, #2f60ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">NaYanRajput</span>`;
    title.style.margin = "8px 0 6px";
    title.style.fontSize = "1.3rem";

    // Description
    const text = document.createElement("p");
    text.innerText = "If you liked this site, follow me on Instagram for more updates!";
    text.style.color = "#a6b1c7";
    text.style.fontSize = "0.95rem";
    text.style.marginBottom = "18px";

    // Buttons container
    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.flexDirection = "column";
    actions.style.gap = "10px";
    actions.style.alignItems = "center";
    actions.style.justifyContent = "center";

    // Follow button
    const followBtn = document.createElement("button");
    followBtn.textContent = "Follow on Instagram";
    followBtn.style.cssText = `
        background:linear-gradient(180deg,rgba(20,30,60,.8),rgba(10,16,36,.8));
        color:#cfe0ff;border:0;outline:0;padding:10px 16px;border-radius:10px;
        font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;
    `;

    const _insta = ['https://instagram.com', 'nayan.withhat_'].join('/');
    followBtn.onclick = () => {
        window.open(_insta, '_blank');
        closePopup();
    };
    followBtn.onmouseover = () => followBtn.style.transform = "scale(1.05)";
    followBtn.onmouseleave = () => followBtn.style.transform = "scale(1)";

    // Checkbox
    const label = document.createElement("label");
    label.style.cssText = "font-size:0.9rem;color:#a6b1c7;display:flex;align-items:center;gap:6px;cursor:pointer;";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.width = "16px";
    checkbox.style.height = "16px";
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode("Don't show again"));

    // Close button
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
        position:absolute;right:12px;top:8px;color:#999;font-size:22px;
        cursor:pointer;transition:color .2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.color = "#fff";
    closeBtn.onmouseleave = () => closeBtn.style.color = "#999";
    closeBtn.onclick = () => closePopup();

    // Assemble
    actions.appendChild(followBtn);
    actions.appendChild(label);
    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(actions);
    popup.appendChild(card);
    document.body.appendChild(popup);

    // Animate show
    setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.pointerEvents = "auto";
    }, 800);

    // Close function
    function closePopup(){
        popup.style.opacity = "0";
        popup.style.pointerEvents = "none";
        if(checkbox.checked) localStorage.setItem(_storageKey,"1");
        setTimeout(()=> popup.remove(), 300);
    }

    // Close on click outside
    popup.addEventListener("click", e => {
        if(e.target === popup) closePopup();
    });

    // Escape key close
    document.addEventListener("keydown", e => {
        if(e.key === "Escape") closePopup();
    });
})();
