(function () {
    window.attachMoviePlayer = function (options) {
        var player = document.querySelector('[data-player]');
        if (!player || !options || !options.source) {
            return;
        }
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var source = options.source;
        var hlsInstance = null;
        var attached = false;
        if (!video) {
            return;
        }
        if (options.poster) {
            video.setAttribute('poster', options.poster);
        }
        function attachSource() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = source;
        }
        function play() {
            attachSource();
            if (button) {
                button.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                play();
            });
        }
        player.addEventListener('click', function (event) {
            if (event.target === video || event.target === player) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 && button) {
                button.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    };
}());
