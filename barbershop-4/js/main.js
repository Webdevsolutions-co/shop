/* ============================================================
   THE CROWN CUT — MAIN SITE JS (Updated for Gemini AI)
   ============================================================ */

// ---- PAGE NAVIGATION ----
const PAGES = ['home', 'services', 'about', 'testimonials', 'contact'];

function goPage(name) {
  if (!PAGES.includes(name)) return;
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  closeMobileMenu();
  const target = document.getElementById('page-' + name);
  if (!target) return;
  target.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(a => {
    if (a.getAttribute('onclick') && a.getAttribute('onclick').includes("'" + name + "'")) {
      a.classList.add('active');
    }
  });
  updateMobileNavActive(name);
  window.scrollTo({ top: 0, behavior: 'instant' });
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
  { name: 'Signature Cut', desc: 'Consultation, shampoo, precision cut, and styling.', price: '$45', duration: '45 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 4l3 3-9.5 9.5-3-3L14.5 4z"/><path d="M5 15l-2 4 4-2"/><circle cx="18" cy="6" r="2"/></svg>` },
  { name: 'Hot Towel Shave', desc: 'Straight-razor shave with hot towel treatment.', price: '$55', duration: '60 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"/><path d="M8 14h8"/></svg>` },
  { name: 'Beard Sculpt', desc: 'Expert beard shaping and conditioning.', price: '$35', duration: '30 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>` },
  { name: 'Cut + Beard Combo', desc: 'Signature cut paired with a full beard sculpt.', price: '$70', duration: '75 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>` },
  { name: 'Hair Coloring', desc: 'Specialist colorists using premium products.', price: 'From $85', duration: '90+ min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
  { name: 'Kids Cut', desc: "Patient barbers and kid-friendly styling.", price: '$28', duration: '30 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
  { name: 'Scalp Treatment', desc: 'Deep-cleansing scalp massage with nourishing oils.', price: '$40', duration: '30 min', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
  { name: 'Royal Experience', desc: 'The full works — cut, shave, beard, and facial.', price: '$120', duration: '2 hrs', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` }
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
        <button onclick="openBookingWithService('${s.name}')" class="book-btn-style">Book</button>
      </div>`;
    grid.appendChild(card);
  });
  setTimeout(() => triggerReveal(), 100);
}

// ---- TESTIMONIALS ----
const TESTIMONIALS = [
  { name: 'Marcus Williams', role: 'Regular Client', rating: 5, img: 'https://i.pravatar.cc/80?img=11', text: "Best barbershop I've been to in Toronto." },
  { name: 'David Chen', role: 'Monthly Member', rating: 5, img: 'https://i.pravatar.cc/80?img=3', text: "The atmosphere, the service — everything is top tier." }
];

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid || grid.children.length > 0) return;
  TESTIMONIALS.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.style.transitionDelay = (i * 0.1) + 's';
    card.innerHTML = `<div class="testimonial-stars">${'★'.repeat(t.rating)}</div><div class="testimonial-quote">"${t.text}"</div>`;
    grid.appendChild(card);
  });
}

// ---- BOOKING & CONTACT ----
function openBooking() { document.getElementById('bookingModal')?.classList.add('open'); }
function closeBooking() { document.getElementById('bookingModal')?.classList.remove('open'); }
function showToast(msg, type = '') {
  const t = document.getElementById('mainToast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3500);
}

// ---- INITIALIZATION ----
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  renderServices();
  renderTestimonials();
  triggerReveal();
  initChatbot();
});

/* ============================================================
   AI CHATBOT LOGIC
   ============================================================ */
const chatHistory = [];
let chatOpen = false;
let isTyping = false;

function initChatbot() {
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
  if (chatOpen) {
    panel.classList.add('open');
    btn.classList.add('active');
    if (chatHistory.length === 0) {
      setTimeout(() => addBotMessage("Hey! I'm **Crown**, your assistant. How can I help with your cut today? ✂️"), 300);
    }
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
    let html = msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    div.innerHTML = `<div class="chat-bubble">${html}</div>`;
    feed.appendChild(div);
  });
  feed.scrollTop = feed.scrollHeight;
}

async function sendChatMessage() {
  if (isTyping) return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  chatHistory.push({ role: 'user', content: text });
  renderMessages();
  isTyping = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();
    if (data.text) {
      addBotMessage(data.text);
    } else {
      addBotMessage("I'm having trouble thinking. Please try again!");
    }
  } catch (err) {
    addBotMessage("Connection error. Please call us at (416) 555-0100!");
  }
  isTyping = false;
}

function updateMobileNavActive(name) {
  document.querySelectorAll('#mobileMenu a').forEach(a => {
    a.classList.remove('mob-active');
    if ((a.getAttribute('onclick') || '').includes("'" + name + "'")) a.classList.add('mob-active');
  });
}
