(function () {
  if (window.musicBallV2) return;
  window.musicBallV2 = true;

  const STORAGE_INDEX = "musicIndex";
  const STORAGE_POSITION = "musicPosition";
  const CLICK_DELAY = 240;
  const DRAG_LIMIT = 5;

  let songs = [];
  let index = 0;
  let dragging = false;
  let moved = false;
  let suppressClick = false;
  let clickTimer = null;
  let faviconTimer = null;
  let faviconAngle = 0;
  let sx = 0;
  let sy = 0;
  let startLeft = 0;
  let startTop = 0;

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  document.body.appendChild(audio);

  const ball = document.createElement("button");
  ball.id = "music-ball";
  ball.type = "button";
  ball.setAttribute("aria-label", "\u6253\u5f00\u97f3\u4e50\u83dc\u5355");
  ball.innerHTML = '<span class="music-disc" aria-hidden="true"></span>';
  document.body.appendChild(ball);

  const panel = document.createElement("div");
  panel.id = "music-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = [
    '<div class="music-title">\u6211\u7684\u6b4c\u5355</div>',
    '<div class="music-now">',
    '  <div class="music-now-title">\u6b63\u5728\u52a0\u8f7d...</div>',
    '  <button class="music-toggle" type="button" aria-label="\u64ad\u653e\u6216\u6682\u505c">\u64ad\u653e</button>',
    "</div>",
    '<input class="music-progress" type="range" min="0" max="1000" value="0" step="1" aria-label="\u97f3\u4e50\u8fdb\u5ea6">',
    '<div class="music-time"><span class="music-current">0:00</span><span class="music-duration">0:00</span></div>',
    '<div id="music-list"></div>',
  ].join("");
  document.body.appendChild(panel);

  const disc = ball.querySelector(".music-disc");
  const title = panel.querySelector(".music-now-title");
  const toggle = panel.querySelector(".music-toggle");
  const progress = panel.querySelector(".music-progress");
  const currentTime = panel.querySelector(".music-current");
  const durationTime = panel.querySelector(".music-duration");
  const list = panel.querySelector("#music-list");

  setFaviconFrame(0);
  restorePosition();
  loadSongs();

  function loadSongs() {
    fetch("/music/music.json")
      .then(function (response) {
        if (!response.ok) throw new Error("music.json load failed");
        return response.json();
      })
      .then(function (data) {
        songs = Array.isArray(data) ? data.filter(function (song) {
          return song && song.title && song.url;
        }) : [];

        if (!songs.length) {
          title.textContent = "\u6682\u65e0\u6b4c\u66f2";
          return;
        }

        const savedIndex = Number(localStorage.getItem(STORAGE_INDEX));
        index = Number.isInteger(savedIndex) && songs[savedIndex] ? savedIndex : 0;

        renderList();
        loadSong(index, false);
      })
      .catch(function () {
        title.textContent = "\u6b4c\u5355\u52a0\u8f7d\u5931\u8d25";
      });
  }

  function renderList() {
    list.innerHTML = "";

    songs.forEach(function (song, songIndex) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "music-item";
      item.textContent = song.title;
      item.addEventListener("click", function () {
        playSong(songIndex);
      });
      list.appendChild(item);
    });

    updateActive();
  }

  function loadSong(nextIndex, autoplay) {
    if (!songs[nextIndex]) return;

    index = nextIndex;
    audio.src = songs[index].url;
    audio.load();
    localStorage.setItem(STORAGE_INDEX, String(index));

    title.textContent = songs[index].title;
    progress.value = "0";
    currentTime.textContent = "0:00";
    durationTime.textContent = "0:00";
    updateActive();

    if (autoplay) playAudio();
  }

  function playSong(nextIndex) {
    loadSong(nextIndex, true);
    showPanel();
  }

  function playAudio() {
    if (!songs.length) return;

    audio.play().catch(function () {
      syncPlayingState();
    });
    syncPlayingState();
  }

  function togglePlayback() {
    if (!songs.length) return;

    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
    }
  }

  function showPanel() {
    alignPanelToBall();
    panel.classList.add("show");
    panel.setAttribute("aria-hidden", "false");
  }

  function togglePanel() {
    alignPanelToBall();
    panel.classList.toggle("show");
    panel.setAttribute("aria-hidden", panel.classList.contains("show") ? "false" : "true");
  }

  function alignPanelToBall() {
    const rect = ball.getBoundingClientRect();
    const gap = 14;
    const margin = 12;
    const panelWidth = Math.min(300, window.innerWidth - margin * 2);
    const panelHeight = Math.min(420, window.innerHeight - 130);
    const panelLeft = rect.left < window.innerWidth / 2
      ? margin
      : window.innerWidth - panelWidth - margin;
    const panelTop = Math.max(margin, Math.min(window.innerHeight - panelHeight - margin, rect.top - panelHeight - gap));

    panel.style.left = panelLeft + "px";
    panel.style.top = panelTop + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }

  function updateActive() {
    list.querySelectorAll(".music-item").forEach(function (item, itemIndex) {
      item.classList.toggle("active", itemIndex === index);
    });
  }

  function syncPlayingState() {
    const isPlaying = !audio.paused && !audio.ended;
    disc.classList.toggle("playing", isPlaying);
    ball.classList.toggle("playing", isPlaying);
    toggle.textContent = isPlaying ? "\u6682\u505c" : "\u64ad\u653e";
    toggle.setAttribute("aria-label", isPlaying ? "\u6682\u505c\u5f53\u524d\u97f3\u4e50" : "\u64ad\u653e\u5f53\u524d\u97f3\u4e50");

    if (isPlaying) {
      startFaviconSpin();
    } else {
      stopFaviconSpin();
    }
  }

  function startFaviconSpin() {
    if (faviconTimer) return;

    faviconTimer = window.setInterval(function () {
      faviconAngle = (faviconAngle + 18) % 360;
      setFaviconFrame(faviconAngle);
    }, 120);
  }

  function stopFaviconSpin() {
    if (!faviconTimer) return;

    window.clearInterval(faviconTimer);
    faviconTimer = null;
    setFaviconFrame(faviconAngle);
  }

  function setFaviconFrame(angle) {
    const link = ensureFaviconLink();
    const canvas = drawFaviconFrame(angle);
    link.href = canvas.toDataURL("image/png");
    link.type = "image/png";
  }

  function ensureFaviconLink() {
    let link = document.querySelector('link[rel~="icon"]');

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    return link;
  }

  function drawFaviconFrame(angle) {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    const center = size / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((angle * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(0, 0, 29, 0, Math.PI * 2);
    ctx.fillStyle = "#0c1018";
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,.32)";
    ctx.lineWidth = 1;
    [11, 16, 21, 26].forEach(function (radius) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.ellipse(-13, -15, 11, 4, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, 24);
    ctx.lineTo(30, 40);
    ctx.lineTo(43, 32);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    return canvas;
  }

  function updateProgress() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    progress.value = duration ? String(Math.round((current / duration) * 1000)) : "0";
    currentTime.textContent = formatTime(current);
    durationTime.textContent = formatTime(duration);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
    return minutes + ":" + rest;
  }

  function restorePosition() {
    const pos = localStorage.getItem(STORAGE_POSITION);
    if (!pos) return;

    try {
      const parsed = JSON.parse(pos);
      if (!Number.isFinite(parsed.x) || !Number.isFinite(parsed.y)) return;

      ball.style.left = parsed.x + "px";
      ball.style.top = parsed.y + "px";
      ball.style.right = "auto";
      ball.style.bottom = "auto";
    } catch (error) {
      localStorage.removeItem(STORAGE_POSITION);
    }
  }

  ball.addEventListener("click", function () {
    if (suppressClick) {
      suppressClick = false;
      return;
    }

    if (moved) return;

    window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(function () {
      togglePanel();
    }, CLICK_DELAY);
  });

  ball.addEventListener("dblclick", function () {
    window.clearTimeout(clickTimer);
    togglePlayback();
  });

  toggle.addEventListener("click", togglePlayback);

  progress.addEventListener("input", function () {
    if (!Number.isFinite(audio.duration) || !audio.duration) return;
    audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
    updateProgress();
  });

  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("play", syncPlayingState);
  audio.addEventListener("pause", syncPlayingState);
  audio.addEventListener("ended", function () {
    if (!songs.length) return;
    playSong((index + 1) % songs.length);
  });

  ball.addEventListener("pointerdown", function (event) {
    dragging = true;
    moved = false;
    sx = event.clientX;
    sy = event.clientY;

    const rect = ball.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    ball.setPointerCapture(event.pointerId);
  });

  ball.addEventListener("pointermove", function (event) {
    if (!dragging) return;

    const dx = event.clientX - sx;
    const dy = event.clientY - sy;

    if (Math.abs(dx) <= DRAG_LIMIT && Math.abs(dy) <= DRAG_LIMIT) return;

    moved = true;

    const x = Math.max(0, Math.min(window.innerWidth - ball.offsetWidth, startLeft + dx));
    const y = Math.max(0, Math.min(window.innerHeight - ball.offsetHeight, startTop + dy));

    ball.style.left = x + "px";
    ball.style.top = y + "px";
    ball.style.right = "auto";
    ball.style.bottom = "auto";
  });

  ball.addEventListener("pointerup", function (event) {
    dragging = false;

    if (!moved) return;

    const rect = ball.getBoundingClientRect();
    const x = rect.left < window.innerWidth / 2 ? 10 : window.innerWidth - ball.offsetWidth - 10;
    const y = Math.max(10, Math.min(window.innerHeight - ball.offsetHeight - 10, rect.top));

    ball.style.left = x + "px";
    ball.style.top = y + "px";
    localStorage.setItem(STORAGE_POSITION, JSON.stringify({ x: x, y: y }));
    suppressClick = true;

    if (ball.hasPointerCapture(event.pointerId)) {
      ball.releasePointerCapture(event.pointerId);
    }
  });

  ball.addEventListener("pointercancel", function () {
    dragging = false;
  });

  window.addEventListener("resize", function () {
    if (panel.classList.contains("show")) alignPanelToBall();
  });
})();
