(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var button = qs('[data-mobile-toggle]');
        var menu = qs('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function setupHero() {
        var slider = qs('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = qsa('[data-hero-slide]', slider);
        var dots = qsa('[data-hero-dot]', slider);
        var prev = qs('[data-hero-prev]', slider);
        var next = qs('[data-hero-next]', slider);
        var index = 0;
        var timer;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('active', itemIndex === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                show(itemIndex);
                play();
            });
        });
        show(0);
        play();
    }

    function setupSearchPage() {
        var grid = qs('[data-search-results]');
        var keyword = qs('[data-search-keyword]');
        var genre = qs('[data-search-genre]');
        var year = qs('[data-search-year]');
        if (!grid || !window.searchMovies) {
            return;
        }

        function card(movie) {
            return '' +
                '<a class="movie-card" href="' + movie.url + '">' +
                    '<div class="movie-poster">' +
                        '<img src="' + movie.cover + '" alt="' + movie.title + '">' +
                        '<span class="movie-badge">' + movie.type + '</span>' +
                    '</div>' +
                    '<div class="movie-body">' +
                        '<h2 class="movie-title">' + movie.title + '</h2>' +
                        '<p class="movie-desc">' + movie.desc + '</p>' +
                        '<div class="movie-meta">' +
                            '<span>' + movie.year + '</span>' +
                            '<span>' + movie.region + '</span>' +
                            '<span>' + movie.genre + '</span>' +
                        '</div>' +
                    '</div>' +
                '</a>';
        }

        function filter() {
            var key = (keyword && keyword.value || '').trim().toLowerCase();
            var selectedGenre = genre && genre.value || '';
            var selectedYear = year && year.value || '';
            var results = window.searchMovies.filter(function (movie) {
                var content = (movie.title + ' ' + movie.genre + ' ' + movie.region + ' ' + movie.type + ' ' + movie.year + ' ' + movie.desc).toLowerCase();
                var okKeyword = !key || content.indexOf(key) !== -1;
                var okGenre = !selectedGenre || movie.genre.indexOf(selectedGenre) !== -1 || movie.type.indexOf(selectedGenre) !== -1;
                var okYear = !selectedYear || movie.year === selectedYear;
                return okKeyword && okGenre && okYear;
            }).slice(0, 80);
            grid.innerHTML = results.map(card).join('');
        }

        [keyword, genre, year].forEach(function (item) {
            if (item) {
                item.addEventListener('input', filter);
                item.addEventListener('change', filter);
            }
        });
        filter();
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById('movie-player');
        var button = document.getElementById('play-button');
        if (!video || !source) {
            return;
        }
        var prepared = false;

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            prepare();
            if (button) {
                button.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (button && video.currentTime === 0) {
                button.classList.remove('is-hidden');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearchPage();
    });
}());
