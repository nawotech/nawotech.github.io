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

  // Minimal photo lightbox for portfolio thumbnails
  var lb = document.getElementById('photo-lightbox');
  if (!lb) return;

  var backdrop = lb.querySelector('.lightbox-backdrop');
  var inner = lb.querySelector('.lightbox-inner');
  var imgEl = lb.querySelector('.lightbox-img');
  var btnClose = lb.querySelector('.lightbox-close');
  var btnPrev = lb.querySelector('.lightbox-prev');
  var btnNext = lb.querySelector('.lightbox-next');

  var urls = [];
  var alts = [];
  var idx = 0;
  var touchStartX = null;
  var touchStartY = null;
  var SWIPE_THRESHOLD = 40;

  function syncNav() {
    var n = urls.length;
    btnPrev.hidden = n <= 1;
    btnNext.hidden = n <= 1;
    imgEl.src = urls[idx] || '';
    imgEl.alt = alts[idx] || '';
  }

  function showPrev() {
    if (urls.length <= 1) return;
    idx = (idx - 1 + urls.length) % urls.length;
    syncNav();
  }

  function showNext() {
    if (urls.length <= 1) return;
    idx = (idx + 1) % urls.length;
    syncNav();
  }

  function openFromButton(btn) {
    var group = btn.closest('.portfolio-photos');
    if (!group || !imgEl) return;

    urls = [];
    alts = [];
    group.querySelectorAll('.portfolio-photo').forEach(function (thumbBtn) {
      var img = thumbBtn.querySelector('img');
      var full = thumbBtn.getAttribute('data-full');
      var alt = thumbBtn.getAttribute('data-alt');
      urls.push(full || (img ? (img.currentSrc || img.src) : ''));
      alts.push(alt || (img ? (img.getAttribute('alt') || '') : ''));
    });

    if (!urls.length) return;

    var thumbs = group.querySelectorAll('.portfolio-photo');
    idx = Array.prototype.indexOf.call(thumbs, btn);
    if (idx < 0) idx = 0;

    lb.hidden = false;
    lb.setAttribute('aria-hidden', 'false');
    syncNav();
    document.documentElement.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeLb() {
    lb.hidden = true;
    lb.setAttribute('aria-hidden', 'true');
    imgEl.removeAttribute('src');
    imgEl.alt = '';
    urls = [];
    alts = [];
    idx = 0;
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('.portfolio-photo');
    if (thumb) {
      e.preventDefault();
      openFromButton(thumb);
      return;
    }

    if (e.target === backdrop || e.target === btnClose) {
      closeLb();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') {
      closeLb();
      return;
    }
    if (e.key === 'ArrowLeft') {
      showPrev();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      showNext();
      e.preventDefault();
    }
  });

  btnPrev.addEventListener('click', function () {
    showPrev();
  });

  btnNext.addEventListener('click', function () {
    showNext();
  });

  inner.addEventListener(
    'touchstart',
    function (e) {
      if (lb.hidden || e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  inner.addEventListener(
    'touchend',
    function (e) {
      if (lb.hidden || touchStartX === null || touchStartY === null) return;
      var touch = e.changedTouches[0];
      var deltaX = touch.clientX - touchStartX;
      var deltaY = touch.clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;

      // Only treat horizontal gestures as gallery swipes.
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX > 0) {
        showPrev();
      } else {
        showNext();
      }
    },
    { passive: true }
  );

  inner.addEventListener('touchcancel', function () {
    touchStartX = null;
    touchStartY = null;
  });
})();
