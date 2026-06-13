(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().normalize("NFKC").toLowerCase().trim();
  }

  function setupMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero-slider]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-item"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(active - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(active + 1);
        start();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFiltering() {
    var areas = Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]"));
    if (!areas.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".filter-input"));
    inputs.forEach(function (input) {
      if (query && !input.value) {
        input.value = query;
      }
      input.addEventListener("input", apply);
    });

    function collect() {
      return normalize(inputs.map(function (input) {
        return input.value;
      }).join(" "));
    }

    function apply() {
      var term = collect();
      areas.forEach(function (area) {
        var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.textContent
          ].join(" "));
          var matched = !term || text.indexOf(term) !== -1;
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        var status = document.querySelector("[data-filter-status]");
        if (status) {
          status.textContent = term ? "找到 " + visible + " 部影片" : "输入关键词筛选影片";
        }
      });
    }
    apply();
  }

  function setupPlayers() {
    var videos = Array.prototype.slice.call(document.querySelectorAll(".video-player"));
    videos.forEach(function (video) {
      var source = video.querySelector("source");
      var src = source ? source.getAttribute("src") : video.getAttribute("src");
      var box = video.closest(".player");
      var overlay = box ? box.querySelector(".player-overlay") : null;
      if (src) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        }
      }

      function playVideo() {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {
            if (overlay) {
              overlay.classList.remove("is-hidden");
            }
          });
        }
      }

      if (overlay) {
        overlay.addEventListener("click", playVideo);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("pause", function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove("is-hidden");
        }
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFiltering();
    setupPlayers();
  });
})();
