(function() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navPanel = document.querySelector("[data-nav-panel]");

    if (navToggle && navPanel) {
        navToggle.addEventListener("click", function() {
            navPanel.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var activeSlide = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;

        slides.forEach(function(slide, i) {
            slide.classList.toggle("active", i === activeSlide);
        });

        dots.forEach(function(dot, i) {
            dot.classList.toggle("active", i === activeSlide);
        });
    }

    function startSlider() {
        if (timer || slides.length < 2) {
            return;
        }

        timer = window.setInterval(function() {
            showSlide(activeSlide + 1);
        }, 5600);
    }

    function resetSlider() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }

        startSlider();
    }

    dots.forEach(function(dot, i) {
        dot.addEventListener("click", function() {
            showSlide(i);
            resetSlider();
        });
    });

    if (prev) {
        prev.addEventListener("click", function() {
            showSlide(activeSlide - 1);
            resetSlider();
        });
    }

    if (next) {
        next.addEventListener("click", function() {
            showSlide(activeSlide + 1);
            resetSlider();
        });
    }

    showSlide(0);
    startSlider();

    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get("q") || "";
    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

    searchInputs.forEach(function(input) {
        if (queryValue && !input.value) {
            input.value = queryValue;
        }

        input.addEventListener("input", filterCards);
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-select]")).forEach(function(select) {
        select.addEventListener("change", filterCards);
    });

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterCards() {
        var q = normalize(searchInputs.map(function(input) {
            return input.value;
        }).filter(Boolean).join(" "));
        var yearSelect = document.querySelector("[data-year-select]");
        var typeSelect = document.querySelector("[data-type-select]");
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var visible = 0;

        cards.forEach(function(card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-year"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" "));
            var ok = true;

            if (q && haystack.indexOf(q) === -1) {
                ok = false;
            }

            if (year && card.getAttribute("data-year") !== year) {
                ok = false;
            }

            if (type && card.getAttribute("data-type") !== type) {
                ok = false;
            }

            card.style.display = ok ? "" : "none";

            if (ok) {
                visible += 1;
            }
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-empty-state]")).forEach(function(empty) {
            empty.classList.toggle("active", visible === 0);
        });
    }

    if (queryValue) {
        filterCards();
    }

    function attachPlayer(player) {
        var video = player.querySelector("video");
        var layer = player.querySelector(".player-layer");
        var src = player.getAttribute("data-video-url");

        if (!video || !src) {
            return;
        }

        function loadAndPlay() {
            player.classList.add("is-playing");

            if (!player.getAttribute("data-ready")) {
                player.setAttribute("data-ready", "1");

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });

                    hls.loadSource(src);
                    hls.attachMedia(video);
                    player._hls = hls;
                } else {
                    video.src = src;
                }
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function() {});
            }
        }

        if (layer) {
            layer.addEventListener("click", loadAndPlay);
        }

        video.addEventListener("click", function() {
            if (!player.getAttribute("data-ready")) {
                loadAndPlay();
            }
        });
    }

    Array.prototype.slice.call(document.querySelectorAll(".site-player")).forEach(attachPlayer);
})();
