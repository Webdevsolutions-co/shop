/* ============================================================
   THE CROWN CUT — MAIN SITE JS
   ============================================================ */

// ---- PAGE NAVIGATION ----
const PAGES = ['home', 'services', 'about', 'testimonials', 'contact'];

function goPage(name) {
  if (!PAGES.includes(name)) return;

  // Deactivate all
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });

  // Close mobile menu
  closeMobileMenu();

  // Activate target
  const target = document.getElementById('page-' + name);
  if (!target) return;
  target.classList.add('active');

  // Update nav active states
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(a => {
    if (a.getAttribute('onclick') && a.getAttribute('onclick').includes("'" + name + "'")) {
      a.classList.add('active');
    }
  });

  // Update mobile nav active
  updateMobileNavActive(name);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Trigger page-specific animations
  setTimeout(() => {
    if (name === 'home') initHeroAnimation();
    triggerReveal();
    if (name === 'services') renderServices();
    if (name === 'testimonials') renderTestimonials();
  }, 80);
}

// ---- MOBILE MENU ----
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (!menu) return;
  const isOpen = menu.style.display === 'flex';
  menu.style.display = isOpen ? 'none' : 'flex';
  if (ham) ham.classList.toggle('open', !isOpen);
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (menu) menu.style.display = 'none';
  if (ham) ham.classList.remove('open');
}

// ---- NAV SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  triggerReveal();
});

// ---- HERO ANIMATION ----
function initHeroAnimation() {
  const hero = document.getElementById('hero');
  if (hero) {
    setTimeout(() => hero.classList.add('visible'), 100);
  }
}

// ---- SCROLL REVEAL ----
function triggerReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.visible), .service-card:not(.visible), .testimonial-card:not(.visible), .barber-card:not(.visible)');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// ---- SERVICES DATA ----
const SERVICES = [
  {
    name: 'Signature Cut',
    desc: 'Our hallmark haircut experience. Includes consultation, relaxing shampoo, precision cut, blow-dry, and styling.',
    price: '$45',
    duration: '45 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 4l3 3-9.5 9.5-3-3L14.5 4z"/><path d="M5 15l-2 4 4-2"/><circle cx="18" cy="6" r="2"/></svg>`
  },
  {
    name: 'Hot Towel Shave',
    desc: 'Traditional straight-razor shave with pre-shave oil, hot towel treatment, premium cream, and nourishing aftercare.',
    price: '$55',
    duration: '60 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"/><path d="M8 14h8"/></svg>`
  },
  {
    name: 'Beard Sculpt',
    desc: 'Expert beard shaping, edging, and trimming tailored to your face shape, finished with conditioning beard oil.',
    price: '$35',
    duration: '30 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`
  },
  {
    name: 'Cut + Beard Combo',
    desc: 'The complete package — our signature cut paired with a full beard sculpt for a totally sharp, cohesive look.',
    price: '$70',
    duration: '75 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
  },
  {
    name: 'Hair Coloring',
    desc: 'From subtle highlights to bold transformations. Performed by our specialist colorists using premium professional products.',
    price: 'From $85',
    duration: '90+ min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
  },
  {
    name: 'Kids Cut',
    desc: "A comfortable, fun experience for boys under 12. Patient barbers and kid-friendly styling for your little one's best look.",
    price: '$28',
    duration: '30 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  {
    name: 'Scalp Treatment',
    desc: 'Deep-cleansing scalp massage with nourishing oils and actives to promote healthy hair growth and eliminate buildup.',
    price: '$40',
    duration: '30 min',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
  },
  {
    name: 'Royal Experience',
    desc: 'The full works — cut, hot towel shave, beard sculpt, scalp treatment, and a premium facial. The ultimate grooming experience.',
    price: '$120',
    duration: '2 hrs',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

function renderServices() {
  const grid = document.querySelector('#page-services .services-grid');
  if (!grid || grid.children.length > 0) return;

  SERVICES.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.style.transitionDelay = (i * 0.08) + 's';
    card.innerHTML = `
      <div class="service-icon">${s.icon}</div>
      <div class="service-name">${s.name}</div>
      <div class="service-desc">${s.desc}</div>
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div class="service-price">${s.price} <span>/ ${s.duration}</span></div>
        <button onclick="openBookingWithService('${s.name}')" style="padding:8px 18px; background:transparent; border:1px solid rgba(201,168,76,0.25); color:var(--gold); font-family:var(--font-body); font-size:0.65rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; border-radius:1px; transition:all 0.25s;">Book</button>
      </div>
    `;
    // Add hover listener to "Book" btn
    const bookBtn = card.querySelector('button');
    bookBtn.addEventListener('mouseenter', () => {
      bookBtn.style.background = 'rgba(201,168,76,0.1)';
      bookBtn.style.borderColor = 'var(--gold)';
    });
    bookBtn.addEventListener('mouseleave', () => {
      bookBtn.style.background = 'transparent';
      bookBtn.style.borderColor = 'rgba(201,168,76,0.25)';
    });
    grid.appendChild(card);
  });

  setTimeout(() => triggerReveal(), 100);
}

// ---- TESTIMONIALS DATA ----
const TESTIMONIALS = [
  { name: 'Marcus Williams', role: 'Regular Client', rating: 5, img: 'https://i.pravatar.cc/80?img=11', text: "Best barbershop I've been to in Toronto. The attention to detail is unmatched — left looking sharper than ever. Marcus Reid is an absolute wizard with scissors." },
  { name: 'David Chen', role: 'Monthly Member', rating: 5, img: 'https://i.pravatar.cc/80?img=3', text: "From the moment you walk in, the whole experience is premium. These guys are artists. The atmosphere, the service, the results — everything is top tier." },
  { name: 'James Carter', role: 'VIP Member', rating: 5, img: 'https://i.pravatar.cc/80?img=7', text: "The hot towel shave is an experience every man needs to try at least once. Incredibly relaxing, and the results speak for themselves. I'm a client for life." },
  { name: 'Andre Brown', role: 'First-Time Client', rating: 5, img: 'https://i.pravatar.cc/80?img=14', text: "I was nervous coming in not knowing what to expect, but the barbers were so professional and made me feel welcome immediately. The cut was perfect." },
  { name: 'Kevin Park', role: 'Regular Client', rating: 5, img: 'https://i.pravatar.cc/80?img=5', text: "I've been to barbershops all over the city — nothing compares. The precision fades, the beard work, the whole vibe. This is the gold standard." },
  { name: 'Tyler Morrison', role: 'Monthly Member', rating: 5, img: 'https://i.pravatar.cc/80?img=9', text: "Booked the Royal Experience for my birthday and it was genuinely one of the best hours of my life. Felt like a completely different person walking out." },
];

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid || grid.children.length > 0) return;

  TESTIMONIALS.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.style.transitionDelay = (i * 0.1) + 's';
    card.innerHTML = `
      <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
      <div class="testimonial-quote">"${t.text}"</div>
      <div class="testimonial-author">
        <div class="testimonial-avatar"><img src="${t.img}" alt="${t.name}"/></div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  setTimeout(() => triggerReveal(), 100);
}

// ---- BOOKING MODAL ----
function openBooking() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('open');
  // Set min date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

function openBookingWithService(serviceName) {
  openBooking();
  setTimeout(() => {
    const sel = document.getElementById('bookService');
    if (!sel) return;
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text.startsWith(serviceName)) {
        sel.selectedIndex = i;
        break;
      }
    }
  }, 100);
}

function closeBooking() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  const modal = document.getElementById('bookingModal');
  if (modal && e.target === modal) closeBooking();
});

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

function confirmBooking() {
  const service = document.getElementById('bookService')?.value;
  const date    = document.getElementById('bookDate')?.value;
  const time    = document.getElementById('bookTime')?.value;

  if (!service) return showToast('Please select a service.', 'error');
  if (!date)    return showToast('Please select a date.', 'error');
  if (!time)    return showToast('Please select a time.', 'error');

  closeBooking();
  showToast('✓ Booking confirmed! See you soon.', 'success');
}

// ---- CONTACT FORM ----
function submitContactForm() {
  const first   = document.getElementById('cfFirst')?.value.trim();
  const last    = document.getElementById('cfLast')?.value.trim();
  const email   = document.getElementById('cfEmail')?.value.trim();
  const message = document.getElementById('cfMessage')?.value.trim();

  if (!first || !last) return showToast('Please enter your name.', 'error');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('Please enter a valid email.', 'error');
  if (!message) return showToast('Please enter a message.', 'error');

  // Clear form
  ['cfFirst','cfLast','cfEmail','cfPhone','cfSubject','cfMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  showToast('✓ Message sent! We\'ll be in touch within 24 hours.', 'success');
}

// ---- TOAST ----
function showToast(msg, type = '') {
  const t = document.getElementById('mainToast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  renderServices();
  renderTestimonials();
  triggerReveal();
  initChatbot();
  initScrollTopBtn();
  initLazyImages();
  updateMobileNavActive('home');
});

window.addEventListener('scroll', () => {
  triggerReveal();
  updateScrollTopBtn();
});

/* ============================================================
   AI CHATBOT
   ============================================================ */

const chatHistory = [];
let chatOpen = false;
let isTyping = false;

function initChatbot() {
  // Already injected in HTML, just bind events
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
}

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chatPanel');
  const btn = document.getElementById('chatBtn');
  if (!panel || !btn) return;

  if (chatOpen) {
    panel.classList.add('open');
    btn.classList.add('active');
    // Show welcome message if first open
    if (chatHistory.length === 0) {
      setTimeout(() => addBotMessage("Hey there! I'm **Crown**, your personal assistant here at The Crown Cut. ✂️\n\nI can help you with our services, hours, pricing, booking info, or anything else about the shop. What can I do for you?"), 300);
    }
    setTimeout(() => document.getElementById('chatInput')?.focus(), 400);
  } else {
    panel.classList.remove('open');
    btn.classList.remove('active');
  }
}

function addBotMessage(text) {
  chatHistory.push({ role: 'assistant', content: text });
  renderMessages();
}

function renderMessages() {
  const feed = document.getElementById('chatFeed');
  if (!feed) return;
  feed.innerHTML = '';

  chatHistory.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot');

    // Simple markdown: **bold**, newlines
    let html = msg.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    div.innerHTML = `<div class="chat-bubble">${html}</div>`;
    feed.appendChild(div);
  });

  // Scroll to bottom
  feed.scrollTop = feed.scrollHeight;
}

function showTypingIndicator() {
  const feed = document.getElementById('chatFeed');
  if (!feed) return;
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg-bot';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('typingIndicator')?.remove();
}

async function sendChatMessage() {
  if (isTyping) return;
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  chatHistory.push({ role: 'user', content: text });
  renderMessages();
  isTyping = true;
  showTypingIndicator();

  // Disable send btn
  const sendBtn = document.getElementById('chatSend');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatHistory.filter(m => m.role === 'user' || m.role === 'assistant')
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    if (data.reply) {
      addBotMessage(data.reply);
    } else {
      addBotMessage("Sorry, I didn't catch that. Try asking again, or call us at **(416) 555-0100**!");
    }
  } catch (err) {
    removeTypingIndicator();
    addBotMessage("Sorry, something went wrong on my end. Call us at **(416) 555-0100** or email **hello@thecrowncut.ca** and we'll help you out!");
  }

  isTyping = false;
  if (sendBtn) sendBtn.disabled = false;
  document.getElementById('chatInput')?.focus();
}

// Auto-resize textarea
document.addEventListener('input', e => {
  if (e.target && e.target.id === 'chatInput') {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }
});

function quickPrompt(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
  // Hide quick prompts after first use
  const qp = document.getElementById('chatQuickPrompts');
  if (qp) qp.style.display = 'none';
}

/* ============================================================
   SCROLL TO TOP BUTTON
   ============================================================ */
function initScrollTopBtn() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.id = 'scrollTopBtn';
  btn.title = 'Back to top';
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>`;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
}

function updateScrollTopBtn() {
  const btn = document.getElementById('scrollTopBtn');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

/* ============================================================
   MOBILE NAV ACTIVE STATE
   ============================================================ */
function updateMobileNavActive(pageName) {
  const menuLinks = document.querySelectorAll('#mobileMenu a');
  menuLinks.forEach(a => {
    a.classList.remove('mob-active');
    const oc = a.getAttribute('onclick') || '';
    if (oc.includes("'" + pageName + "'")) a.classList.add('mob-active');
  });
}

/* ============================================================
   LAZY IMAGE LOADING
   ============================================================ */
function initLazyImages() {
  const imgs = document.querySelectorAll('img');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener('load', () => img.classList.add('loaded'));
          if (img.complete) img.classList.add('loaded');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    imgs.forEach(img => obs.observe(img));
  } else {
    imgs.forEach(img => img.classList.add('loaded'));
  }
}

/* ============================================================
   CLOSE MOBILE MENU ON OUTSIDE TAP
   ============================================================ */
document.addEventListener('click', e => {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (menu && menu.style.display === 'flex') {
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      closeMobileMenu();
    }
  }
});
