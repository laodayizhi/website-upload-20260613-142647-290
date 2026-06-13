import { H as Hls } from "./hls-vendor.js";

export function initMoviePlayer(source) {
    var video = document.getElementById("movieVideo");
    var button = document.querySelector("[data-play-button]");
    var hlsInstance = null;
    var hasLoaded = false;

    if (!video || !source) {
        return;
    }

    function attachSource() {
        if (hasLoaded) {
            return Promise.resolve();
        }
        hasLoaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return Promise.resolve();
        }
        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            return new Promise(function (resolve) {
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
            });
        }
        video.src = source;
        return Promise.resolve();
    }

    function playVideo() {
        if (button) {
            button.classList.add("is-hidden");
        }
        attachSource().then(function () {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        });
    }

    if (button) {
        button.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener("play", function () {
        if (button) {
            button.classList.add("is-hidden");
        }
    });
    video.addEventListener("ended", function () {
        if (button) {
            button.classList.remove("is-hidden");
        }
    });
    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
