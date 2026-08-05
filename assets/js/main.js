(function () {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', id);
        }
      }
    });
  });

  // Portfolio photo gallery overlay: a badge on the card's single photo
  // opens a grid of every photo for that project.
  var overlay = document.getElementById('photo-lightbox');
  if (!overlay) return;

  var backdrop = overlay.querySelector('.gallery-overlay-backdrop');
  var btnClose = overlay.querySelector('.gallery-overlay-close');
  var titleEl = overlay.querySelector('.gallery-overlay-title');
  var gridEl = overlay.querySelector('.gallery-overlay-grid');

  function openGallery(btn) {
    var photos;
    try {
      photos = JSON.parse(btn.getAttribute('data-photos') || '[]');
    } catch (e) {
      photos = [];
    }
    if (!photos.length) return;

    gridEl.innerHTML = '';
    photos.forEach(function (item) {
      var src = typeof item === 'string' ? item : item.full || item.thumb || '';
      if (!src) return;
      var alt = typeof item === 'string' ? '' : item.alt || '';
      var cell = document.createElement('div');
      cell.className = 'gallery-overlay-item';
      var img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      cell.appendChild(img);
      gridEl.appendChild(cell);
    });

    titleEl.textContent = btn.getAttribute('data-title') || '';
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeGallery() {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    gridEl.innerHTML = '';
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.portfolio-gallery-btn');
    if (btn) {
      e.preventDefault();
      openGallery(btn);
      return;
    }

    if (e.target === backdrop || e.target === btnClose) {
      closeGallery();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') closeGallery();
  });
})();
