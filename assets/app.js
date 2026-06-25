'use strict';

/* =========================================================
 * EDIT HERE — listing configuration
 * =======================================================*/

// Phone number for the contact button (international format).
// Replace with the real number; it stays hidden until the visitor clicks "Pokaż numer".
const PHONE = '+49 1515 9883371';

// Photos shown in the gallery. Put your files in the images/ folder
// and list them here in display order.
const PHOTOS = [
  'images/photo-1.jpg',
  'images/photo-2.jpg',
  'images/photo-3.jpg',
  'images/photo-4.jpg',
  'images/photo-5.jpg',
  'images/photo-6.jpg',
];

/* =========================================================
 * Placeholder shown when a photo file is missing
 * =======================================================*/
function placeholder(index) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<rect width="800" height="600" fill="#e2e8f0"/>` +
    `<g fill="#94a3b8" font-family="Inter, sans-serif" text-anchor="middle">` +
    `<text x="400" y="285" font-size="64">🏠</text>` +
    `<text x="400" y="350" font-size="28" font-weight="600">Zdjęcie ${index}</text>` +
    `<text x="400" y="390" font-size="18">wgraj plik do folderu images/</text>` +
    `</g></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* =========================================================
 * Theme toggle (persisted in localStorage)
 * =======================================================*/
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* =========================================================
 * Gallery
 * =======================================================*/
let current = 0;

const mainPhoto = document.getElementById('mainPhoto');
const thumbStrip = document.getElementById('thumbStrip');
const photoCounter = document.getElementById('photoCounter');

function setMain(index) {
  current = (index + PHOTOS.length) % PHOTOS.length;
  mainPhoto.src = PHOTOS[current];
  mainPhoto.onerror = () => { mainPhoto.onerror = null; mainPhoto.src = placeholder(current + 1); };
  photoCounter.textContent = `${current + 1} / ${PHOTOS.length}`;
  document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === current));
  if (!lightbox.classList.contains('hidden')) updateLightbox();
}

PHOTOS.forEach((src, i) => {
  const btn = document.createElement('button');
  btn.className = 'thumb';
  btn.type = 'button';
  btn.setAttribute('aria-label', `Pokaż zdjęcie ${i + 1}`);
  const img = document.createElement('img');
  img.src = src;
  img.alt = `Miniatura zdjęcia ${i + 1}`;
  img.loading = 'lazy';
  img.onerror = () => { img.onerror = null; img.src = placeholder(i + 1); };
  btn.appendChild(img);
  btn.addEventListener('click', () => setMain(i));
  thumbStrip.appendChild(btn);
});

// Start the gallery on photo 6 (shown as the main image).
setMain(5);

/* =========================================================
 * Lightbox
 * =======================================================*/
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox() {
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
  updateLightbox();
}
function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
}
function updateLightbox() {
  lightboxImg.src = PHOTOS[current];
  lightboxImg.onerror = () => { lightboxImg.onerror = null; lightboxImg.src = placeholder(current + 1); };
}

document.getElementById('mainPhotoBtn').addEventListener('click', openLightbox);
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => setMain(current - 1));
document.getElementById('lightboxNext').addEventListener('click', () => setMain(current + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') setMain(current - 1);
  if (e.key === 'ArrowRight') setMain(current + 1);
});

/* =========================================================
 * Contact: phone reveal + share
 * =======================================================*/
const phoneBtn = document.getElementById('phoneBtn');
const phoneLabel = document.getElementById('phoneLabel');
let phoneRevealed = false;

phoneBtn.addEventListener('click', () => {
  if (!phoneRevealed) {
    phoneLabel.textContent = PHONE;
    phoneRevealed = true;
  }
});

document.getElementById('shareBtn').addEventListener('click', async () => {
  const data = {
    title: 'Sprzedam mieszkanie 50 m² — Ruda k. Wyrzyska',
    text: '2 pokoje, 1 piętro, umeblowane — 180 000 PLN',
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link skopiowany do schowka.');
    }
  } catch (_) { /* user cancelled */ }
});
