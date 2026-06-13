(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function bindMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function bindHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length || !dots.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            slider.addEventListener("mouseenter", stop);
            slider.addEventListener("mouseleave", start);
        }
        show(0);
        start();
    }

    function bindFilters() {
        var toolbars = Array.prototype.slice.call(document.querySelectorAll("[data-list-toolbar]"));
        toolbars.forEach(function (toolbar) {
            var section = toolbar.parentElement;
            var list = section ? section.querySelector("[data-movie-list]") : null;
            var input = toolbar.querySelector("[data-search-input]");
            var year = toolbar.querySelector("[data-year-filter]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var selectedYear = year ? year.value : "";
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var passKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var passYear = !selectedYear || cardYear.indexOf(selectedYear) !== -1;
                    card.classList.toggle("is-filtered-out", !(passKeyword && passYear));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (year) {
                year.addEventListener("change", apply);
            }
        });
    }

    ready(function () {
        bindMenu();
        bindHero();
        bindFilters();
    });
}());
