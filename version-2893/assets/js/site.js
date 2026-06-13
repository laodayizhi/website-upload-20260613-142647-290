(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    function initMobileNav() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
            toggle.classList.toggle('is-open');
        });
    }

    function initHeroSlider() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
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
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                show(index);
                start();
            });
        });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        start();
    }

    function readSearchParams(root) {
        var params = new URLSearchParams(window.location.search);
        var input = root.querySelector('[data-search-input]');
        if (input && params.has('q')) {
            input.value = params.get('q') || '';
        }
    }

    function initFilters() {
        var roots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));
        roots.forEach(function (root) {
            readSearchParams(root);
            var input = root.querySelector('[data-search-input]');
            var category = root.querySelector('[data-category-filter]');
            var type = root.querySelector('[data-type-filter]');
            var year = root.querySelector('[data-year-filter]');
            var grid = root.querySelector('[data-filter-grid]');
            var empty = root.querySelector('[data-filter-empty]');
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var categoryValue = category ? category.value : 'all';
                var typeValue = type ? type.value : 'all';
                var yearValue = year ? year.value : 'all';
                var visible = 0;
                cards.forEach(function (card) {
                    var searchText = (card.getAttribute('data-search') || '').toLowerCase();
                    var titleText = (card.getAttribute('data-title') || '').toLowerCase();
                    var matchesQuery = !query || searchText.indexOf(query) > -1 || titleText.indexOf(query) > -1;
                    var matchesCategory = categoryValue === 'all' || card.getAttribute('data-category') === categoryValue;
                    var matchesType = typeValue === 'all' || card.getAttribute('data-type-group') === typeValue;
                    var matchesYear = yearValue === 'all' || card.getAttribute('data-year-group') === yearValue;
                    var matched = matchesQuery && matchesCategory && matchesType && matchesYear;
                    card.classList.toggle('is-hidden', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }
            [input, category, type, year].forEach(function (element) {
                if (!element) {
                    return;
                }
                element.addEventListener('input', apply);
                element.addEventListener('change', apply);
            });
            apply();
        });
    }

    ready(function () {
        initMobileNav();
        initHeroSlider();
        initFilters();
    });
}());
