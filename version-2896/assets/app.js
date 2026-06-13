(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var showSlide = function (next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      };
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
      });
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var root = panel.closest('section') || document;
      var keywordInput = panel.querySelector('[data-filter-keyword]');
      var yearSelect = panel.querySelector('[data-filter-year]');
      var typeSelect = panel.querySelector('[data-filter-type]');
      var regionSelect = panel.querySelector('[data-filter-region]');
      var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
      var apply = function () {
        var keyword = (keywordInput && keywordInput.value || '').trim().toLowerCase();
        var year = yearSelect && yearSelect.value || '';
        var type = typeSelect && typeSelect.value || '';
        var region = regionSelect && regionSelect.value || '';
        cards.forEach(function (card) {
          var haystack = [card.dataset.title, card.dataset.tags, card.dataset.region, card.dataset.type, card.dataset.year].join(' ').toLowerCase();
          var matched = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (year && card.dataset.year !== year) {
            matched = false;
          }
          if (type && card.dataset.type !== type) {
            matched = false;
          }
          if (region && card.dataset.region !== region) {
            matched = false;
          }
          card.classList.toggle('is-filter-hidden', !matched);
        });
      };
      [keywordInput, yearSelect, typeSelect, regionSelect].forEach(function (input) {
        if (input) {
          input.addEventListener('input', apply);
          input.addEventListener('change', apply);
        }
      });
    });

    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('[data-video-player]');
      var button = shell.querySelector('[data-play-button]');
      if (!video || !button) {
        return;
      }
      var stream = video.getAttribute('data-stream');
      var started = false;
      var startPlayback = function () {
        if (!stream) {
          return;
        }
        if (!started) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hls = hls;
          } else {
            video.src = stream;
          }
          started = true;
        }
        button.classList.add('is-hidden');
        video.play().catch(function () {});
      };
      button.addEventListener('click', startPlayback);
      video.addEventListener('click', function () {
        if (!started || video.paused) {
          startPlayback();
        }
      });
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
    });
  });
})();
