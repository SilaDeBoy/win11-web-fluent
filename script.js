// ======================
// Windows 11 Web Desktop
// ======================

const desktop = document.getElementById("desktop");
const windowsContainer = document.getElementById("windows");
const taskbarApps = document.getElementById("taskbarApps");
const startMenu = document.getElementById("startMenu");
const startBtn = document.getElementById("startBtn");
const powerMenu = document.getElementById("powerMenu");
const lockScreen = document.getElementById("lockScreen");

let zCounter = 100;
let openWindows = {};

// Fluent-style icons for taskbar (same look as desktop / Start)
const APP_ICONS = {
  explorer: `<svg viewBox="0 0 48 48" width="18" height="18"><defs><linearGradient id="tbf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFB900"/><stop offset="100%" stop-color="#FF8C00"/></linearGradient></defs><path fill="url(#tbf)" d="M6 12h14l4 4h18a4 4 0 014 4v18a4 4 0 01-4 4H6a4 4 0 01-4-4V16a4 4 0 014-4z"/><path fill="#FFD54F" d="M6 16h36v22a2 2 0 01-2 2H8a2 2 0 01-2-2V16z"/></svg>`,
  notepad: `<svg viewBox="0 0 48 48" width="18" height="18"><rect x="10" y="6" width="28" height="36" rx="3" fill="#2B88D8"/><rect x="14" y="12" width="20" height="2.5" rx="1" fill="#fff" opacity="0.9"/><rect x="14" y="18" width="16" height="2.5" rx="1" fill="#fff" opacity="0.7"/></svg>`,
  paint: `<svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="18" fill="#E81123"/><circle cx="16" cy="18" r="6" fill="#FFB900"/><circle cx="32" cy="16" r="5" fill="#00B294"/><circle cx="30" cy="30" r="6" fill="#0078D4"/></svg>`,
  calculator: `<svg viewBox="0 0 48 48" width="18" height="18"><rect x="8" y="4" width="32" height="40" rx="4" fill="#202020"/><rect x="12" y="8" width="24" height="10" rx="2" fill="#0F0F0F"/><rect x="30" y="30" width="7" height="6" rx="1.5" fill="#0078D4"/></svg>`,
  music: `<svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="20" fill="#881798"/><path fill="#fff" d="M28 12v16.5a5.5 5.5 0 11-3-4.9V17l10-2v11.5a5.5 5.5 0 11-3-4.9V12h-4z"/></svg>`,
  terminal: `<svg viewBox="0 0 48 48" width="18" height="18"><rect x="4" y="8" width="40" height="32" rx="4" fill="#0C0C0C"/><path fill="#0CFF00" d="M12 24l6 4-6 4v-2.5l3-1.5-3-1.5V24z"/></svg>`,
  sticky: `<svg viewBox="0 0 48 48" width="18" height="18"><path fill="#FFF176" d="M8 6h28a2 2 0 012 2v28l-8 8H8a2 2 0 01-2-2V8a2 2 0 012-2z"/><path fill="#FBC02D" d="M30 36v8l8-8H30z"/></svg>`,
  browser: `<svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="20" fill="#0078D4"/><circle cx="24" cy="24" r="14" fill="none" stroke="#50E6FF" stroke-width="2.5"/><path fill="none" stroke="#50E6FF" stroke-width="2" d="M10 24h28"/></svg>`,
  settings: `<svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="8" fill="#C8C8C8"/><circle cx="24" cy="24" r="5" fill="#2C2C2C"/></svg>`,
  about: `<svg viewBox="0 0 48 48" width="18" height="18"><circle cx="24" cy="24" r="20" fill="#0078D4"/><circle cx="24" cy="16" r="3.5" fill="#fff"/><rect x="21" y="22" width="6" height="14" rx="2" fill="#fff"/></svg>`
};


// ---------- Clock ----------
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  document.getElementById("time").textContent = time;
  document.getElementById("date").textContent = date;
  document.getElementById("lockTime").textContent = time;
  document.getElementById("lockDate").textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}
setInterval(updateClock, 1000);
updateClock();

// ---------- Start Menu ----------
startBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  startMenu.classList.toggle("hidden");
  powerMenu.classList.add("hidden");
  startBtn.classList.toggle("active", !startMenu.classList.contains("hidden"));
});

document.addEventListener("click", (e) => {
  if (!startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.classList.add("hidden");
    startBtn.classList.remove("active");
  }
  if (!powerMenu.contains(e.target) && e.target.id !== "powerBtn") {
    powerMenu.classList.add("hidden");
  }
});

document.getElementById("powerBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  powerMenu.classList.toggle("hidden");
});

document.querySelectorAll("#powerMenu button").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "reload") location.reload();
    if (action === "lock") {
      lockScreen.classList.remove("hidden");
      powerMenu.classList.add("hidden");
      startMenu.classList.add("hidden");
    }
  });
});

document.getElementById("unlockBtn").addEventListener("click", () => {
  lockScreen.classList.add("hidden");
});

// ---------- Open apps from icons / pinned ----------
function bindAppLaunchers() {
  document.querySelectorAll("[data-app]").forEach(el => {
    el.addEventListener("dblclick", () => openApp(el.dataset.app));
    el.addEventListener("click", (e) => {
      // single click selects, double opens (desktop icons)
      if (el.classList.contains("icon")) {
        document.querySelectorAll(".icon").forEach(i => i.classList.remove("selected"));
        el.classList.add("selected");
      } else {
        openApp(el.dataset.app);
        startMenu.classList.add("hidden");
      }
    });
  });
}
bindAppLaunchers();

// Double-click on desktop icons
document.querySelectorAll(".desktop-icons .icon").forEach(icon => {
  icon.addEventListener("dblclick", () => openApp(icon.dataset.app));
});

// ---------- Window system ----------
function createWindow(id, title, contentHTML, width = 480, height = 360) {
  if (openWindows[id]) {
    focusWindow(id);
    return openWindows[id];
  }

  const win = document.createElement("div");
  win.className = "window active";
  win.dataset.id = id;
  win.style.width = width + "px";
  win.style.height = height + "px";
  win.style.left = (80 + Object.keys(openWindows).length * 30) + "px";
  win.style.top = (60 + Object.keys(openWindows).length * 28) + "px";
  win.style.zIndex = ++zCounter;

  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">${title}</div>
      <div class="window-controls">
        <button class="minimize" title="Minimize">─</button>
        <button class="maximize" title="Maximize">□</button>
        <button class="close" title="Close">✕</button>
      </div>
    </div>
    <div class="window-body">${contentHTML}</div>
  `;

  windowsContainer.appendChild(win);
  openWindows[id] = win;

  // Taskbar button with Fluent icon
  const taskBtn = document.createElement("button");
  taskBtn.className = "task-btn active";
  taskBtn.dataset.id = id;
  taskBtn.title = title;
  const iconHtml = APP_ICONS[id] || `<span>${title.slice(0, 1)}</span>`;
  taskBtn.innerHTML = `<span class="tb-icon">${iconHtml}</span>`;
  taskBtn.addEventListener("click", () => {
    if (win.style.display === "none") {
      win.style.display = "flex";
      focusWindow(id);
    } else if (win.classList.contains("active")) {
      win.style.display = "none";
      win.classList.remove("active");
      taskBtn.classList.remove("active");
    } else {
      focusWindow(id);
    }
  });
  taskbarApps.appendChild(taskBtn);

  // Controls
  win.querySelector(".close").addEventListener("click", () => closeWindow(id));
  win.querySelector(".minimize").addEventListener("click", () => {
    win.style.display = "none";
    win.classList.remove("active");
    taskBtn.classList.remove("active");
  });
  win.querySelector(".maximize").addEventListener("click", () => {
    if (win.dataset.maximized === "1") {
      win.style.left = win.dataset.prevLeft;
      win.style.top = win.dataset.prevTop;
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
      win.dataset.maximized = "0";
    } else {
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.style.left = "0";
      win.style.top = "0";
      win.style.width = "100%";
      win.style.height = "calc(100% - 48px)";
      win.dataset.maximized = "1";
    }
  });

  // Focus on click
  win.addEventListener("mousedown", () => focusWindow(id));

  // Dragging
  makeDraggable(win);

  return win;
}

function focusWindow(id) {
  Object.values(openWindows).forEach(w => w.classList.remove("active"));
  document.querySelectorAll(".task-btn").forEach(b => b.classList.remove("active"));
  const win = openWindows[id];
  if (win) {
    win.classList.add("active");
    win.style.display = "flex";
    win.style.zIndex = ++zCounter;
    const btn = document.querySelector(`.task-btn[data-id="${id}"]`);
    if (btn) btn.classList.add("active");
  }
}

function closeWindow(id) {
  const win = openWindows[id];
  if (win) {
    win.remove();
    delete openWindows[id];
  }
  const btn = document.querySelector(`.task-btn[data-id="${id}"]`);
  if (btn) btn.remove();
}

function makeDraggable(win) {
  const titlebar = win.querySelector(".window-titlebar");
  let offsetX, offsetY, dragging = false;

  titlebar.addEventListener("mousedown", (e) => {
    if (e.target.closest(".window-controls")) return;
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    focusWindow(win.dataset.id);
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    win.style.left = Math.max(0, e.clientX - offsetX) + "px";
    win.style.top = Math.max(0, e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}

// ---------- Apps ----------
function openApp(name) {
  switch (name) {
    case "notepad":
      createWindow("notepad", "Notepad", `
        <textarea class="notepad-area" placeholder="Start typing..."></textarea>
      `, 520, 380);
      break;

    case "calculator":
      createWindow("calculator", "Calculator", `
        <div class="calc">
          <div class="calc-display" id="calcDisplay">0</div>
          <button onclick="calcClear()">C</button>
          <button onclick="calcInput('(')">(</button>
          <button onclick="calcInput(')')">)</button>
          <button class="op" onclick="calcInput('/')">÷</button>
          <button onclick="calcInput('7')">7</button>
          <button onclick="calcInput('8')">8</button>
          <button onclick="calcInput('9')">9</button>
          <button class="op" onclick="calcInput('*')">×</button>
          <button onclick="calcInput('4')">4</button>
          <button onclick="calcInput('5')">5</button>
          <button onclick="calcInput('6')">6</button>
          <button class="op" onclick="calcInput('-')">−</button>
          <button onclick="calcInput('1')">1</button>
          <button onclick="calcInput('2')">2</button>
          <button onclick="calcInput('3')">3</button>
          <button class="op" onclick="calcInput('+')">+</button>
          <button onclick="calcInput('0')">0</button>
          <button onclick="calcInput('.')">.</button>
          <button class="eq" onclick="calcEqual()" style="grid-column: span 2">=</button>
        </div>
      `, 300, 420);
      break;

    case "browser":
      createWindow("browser", "Browser", `
        <div class="browser-bar">
          <input type="text" id="browserUrl" value="https://example.com" placeholder="Enter URL" />
          <button onclick="browserGo()">Go</button>
        </div>
        <iframe class="browser-frame" id="browserFrame" src="https://example.com"></iframe>
        <p style="margin-top:8px;font-size:11px;color:#aaa">Note: Many sites block embedding. Try example.com or wikipedia.org</p>
      `, 700, 500);
      break;

    case "settings":
      createWindow("settings", "Settings", `
        <div class="settings-list">
          <div class="settings-item">
            <label>Theme</label>
            <select id="themeSelect" onchange="changeTheme(this.value)">
              <option value="dark">Dark</option>
              <option value="blue">Blue Gradient</option>
            </select>
          </div>
          <div class="settings-item">
            <label>Taskbar opacity</label>
            <input type="range" min="50" max="100" value="85" oninput="document.getElementById('taskbar').style.opacity = this.value/100" />
          </div>
          <div class="settings-item">
            <label>About this desktop</label>
            <span style="color:#aaa;font-size:12px">Windows 11 Web • Browser-based</span>
          </div>
        </div>
      `, 420, 280);
      break;

    case "explorer":
      createWindow("explorer", "File Explorer", `
        <ul class="explorer-list">
          <li>📁 Documents</li>
          <li>📁 Downloads</li>
          <li>📁 Pictures</li>
          <li>📁 Music</li>
          <li>📁 Videos</li>
          <li>💻 This PC</li>
          <li>🌐 Network</li>
        </ul>
        <p style="margin-top:16px;color:#888;font-size:12px">This is a simulation. Real files are not accessible from the browser for security reasons.</p>
      `, 480, 340);
      break;

    case "about":
      createWindow("about", "About Windows 11 Web", `
        <h2 style="margin-bottom:12px">Windows 11 Web</h2>
        <p>A lightweight Windows 11-inspired desktop that runs entirely in your browser.</p>
        <br>
        <p><strong>Features:</strong></p>
        <ul style="margin:8px 0 12px 18px;line-height:1.6">
          <li>Draggable windows, Start menu & taskbar</li>
          <li>Notepad, Paint, Calculator, Music, Terminal</li>
          <li>Sticky Notes, Browser, Settings</li>
          <li>Works on old computers via any modern browser</li>
        </ul>
        <p style="color:#aaa;font-size:12px">This is <strong>not</strong> real Windows 11. It is a web simulation made for fun and low-end devices.</p>
      `, 440, 340);
      break;

    case "paint":
      createWindow("paint", "Paint", `
        <div class="paint-toolbar">
          <input type="color" id="paintColor" value="#000000" title="Color" />
          <label style="font-size:12px;color:#aaa">Size</label>
          <input type="range" id="paintSize" min="1" max="30" value="4" />
          <button onclick="paintClear()">Clear</button>
        </div>
        <canvas class="paint-canvas" id="paintCanvas" width="460" height="300"></canvas>
      `, 500, 400);
      setTimeout(initPaint, 50);
      break;

    case "music":
      createWindow("music", "Music Player", `
        <div class="music-player">
          <div class="music-art">🎵</div>
          <div class="music-title" id="musicTitle">Select a track</div>
          <div class="music-artist" id="musicArtist">Windows 11 Web</div>
          <div class="music-controls">
            <button onclick="musicPrev()">⏮</button>
            <button class="play" id="musicPlayBtn" onclick="musicToggle()">▶</button>
            <button onclick="musicNext()">⏭</button>
          </div>
          <div class="music-track-list" id="musicTracks"></div>
        </div>
      `, 360, 420);
      setTimeout(initMusic, 50);
      break;

    case "terminal":
      createWindow("terminal", "Terminal", `
        <div class="terminal">
          <div class="terminal-output" id="termOutput">Windows 11 Web Terminal [Version 1.0]\n(c) Lite Desktop. Type "help" for commands.\n</div>
          <div class="terminal-input-line">
            <span>C:\\User&gt;</span>
            <input type="text" id="termInput" autocomplete="off" spellcheck="false" />
          </div>
        </div>
      `, 560, 360);
      setTimeout(initTerminal, 50);
      break;

    case "sticky":
      createWindow("sticky", "Sticky Notes", `
        <div class="sticky-colors">
          <button style="background:#fef7a0" class="active" onclick="stickyColor('#fef7a0', this)"></button>
          <button style="background:#ffcce0" onclick="stickyColor('#ffcce0', this)"></button>
          <button style="background:#c5f0c5" onclick="stickyColor('#c5f0c5', this)"></button>
          <button style="background:#cce0ff" onclick="stickyColor('#cce0ff', this)"></button>
          <button style="background:#f0d0ff" onclick="stickyColor('#f0d0ff', this)"></button>
        </div>
        <div class="sticky-note" id="stickyNote">
          <textarea placeholder="Write a note..." id="stickyText"></textarea>
        </div>
      `, 320, 280);
      break;
  }
}

// Calculator helpers
let calcExpr = "";
window.calcInput = (val) => {
  calcExpr += val;
  document.getElementById("calcDisplay").textContent = calcExpr || "0";
};
window.calcClear = () => {
  calcExpr = "";
  document.getElementById("calcDisplay").textContent = "0";
};
window.calcEqual = () => {
  try {
    const result = Function('"use strict"; return (' + calcExpr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-") + ")")();
    calcExpr = String(result);
    document.getElementById("calcDisplay").textContent = calcExpr;
  } catch {
    document.getElementById("calcDisplay").textContent = "Error";
    calcExpr = "";
  }
};

window.browserGo = () => {
  const url = document.getElementById("browserUrl").value.trim();
  if (url) {
    let final = url;
    if (!/^https?:\/\//i.test(url)) final = "https://" + url;
    document.getElementById("browserFrame").src = final;
  }
};

window.changeTheme = (val) => {
  if (val === "blue") {
    document.documentElement.style.setProperty("--desktop-bg", "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)");
  } else {
    document.documentElement.style.setProperty("--desktop-bg", "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #111 100%)");
  }
};

// Search in start menu (simple filter)
document.getElementById("startSearch").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".pinned").forEach(p => {
    const text = p.textContent.toLowerCase();
    p.style.display = text.includes(q) ? "flex" : "none";
  });
});

// Keyboard: Escape closes start menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    startMenu.classList.add("hidden");
    powerMenu.classList.add("hidden");
    startBtn.classList.remove("active");
  }
});

// ======================
// Paint
// ======================
function initPaint() {
  const canvas = document.getElementById("paintCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let drawing = false;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function start(e) {
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    e.preventDefault();
  }
  function draw(e) {
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineWidth = document.getElementById("paintSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("paintColor").value;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }
  function stop() { drawing = false; }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stop);
  canvas.addEventListener("mouseleave", stop);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stop);
}

window.paintClear = () => {
  const canvas = document.getElementById("paintCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// ======================
// Music Player (Web Audio tones)
// ======================
const tracks = [
  { title: "Soft Beep Melody", artist: "Web Synth", notes: [262, 294, 330, 349, 392, 440, 494, 523] },
  { title: "Simple Scale", artist: "Web Synth", notes: [523, 494, 440, 392, 349, 330, 294, 262] },
  { title: "Rising Tone", artist: "Web Synth", notes: [200, 250, 300, 350, 400, 450, 500, 550] }
];
let musicIndex = 0;
let musicPlaying = false;
let musicCtx = null;
let musicOsc = null;

function initMusic() {
  const list = document.getElementById("musicTracks");
  if (!list) return;
  list.innerHTML = "";
  tracks.forEach((t, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i + 1}. ${t.title}`;
    btn.onclick = () => { musicIndex = i; musicStop(); updateMusicUI(); };
    list.appendChild(btn);
  });
  updateMusicUI();
}

function updateMusicUI() {
  const t = tracks[musicIndex];
  const titleEl = document.getElementById("musicTitle");
  const artistEl = document.getElementById("musicArtist");
  const playBtn = document.getElementById("musicPlayBtn");
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = t.artist;
  if (playBtn) playBtn.textContent = musicPlaying ? "⏸" : "▶";
  document.querySelectorAll("#musicTracks button").forEach((b, i) => {
    b.classList.toggle("active", i === musicIndex);
  });
}

function musicStop() {
  if (musicOsc) {
    try { musicOsc.stop(); } catch (e) {}
    musicOsc = null;
  }
  musicPlaying = false;
  updateMusicUI();
}

window.musicToggle = () => {
  if (musicPlaying) {
    musicStop();
    return;
  }
  musicPlaying = true;
  updateMusicUI();
  if (!musicCtx) musicCtx = new (window.AudioContext || window.webkitAudioContext)();
  playNotes(tracks[musicIndex].notes, 0);
};

function playNotes(notes, i) {
  if (!musicPlaying || i >= notes.length) {
    musicPlaying = false;
    updateMusicUI();
    return;
  }
  const osc = musicCtx.createOscillator();
  const gain = musicCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[i];
  gain.gain.value = 0.15;
  osc.connect(gain);
  gain.connect(musicCtx.destination);
  osc.start();
  musicOsc = osc;
  setTimeout(() => {
    try { osc.stop(); } catch (e) {}
    playNotes(notes, i + 1);
  }, 350);
}

window.musicPrev = () => {
  musicStop();
  musicIndex = (musicIndex - 1 + tracks.length) % tracks.length;
  updateMusicUI();
};
window.musicNext = () => {
  musicStop();
  musicIndex = (musicIndex + 1) % tracks.length;
  updateMusicUI();
};

// ======================
// Terminal
// ======================
function initTerminal() {
  const input = document.getElementById("termInput");
  const output = document.getElementById("termOutput");
  if (!input || !output) return;

  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = input.value.trim();
    input.value = "";
    output.textContent += `\nC:\\User> ${cmd}\n`;
    handleCommand(cmd, output);
    output.scrollTop = output.scrollHeight;
  });
}

function handleCommand(cmd, output) {
  const lower = cmd.toLowerCase();
  if (!cmd) return;
  if (lower === "help") {
    output.textContent += "Available commands:\n  help, clear, date, echo, whoami, ver, dir, cls\n";
  } else if (lower === "clear" || lower === "cls") {
    output.textContent = "";
  } else if (lower === "date") {
    output.textContent += new Date().toString() + "\n";
  } else if (lower.startsWith("echo ")) {
    output.textContent += cmd.slice(5) + "\n";
  } else if (lower === "whoami") {
    output.textContent += "User\n";
  } else if (lower === "ver") {
    output.textContent += "Windows 11 Web [Version 1.0]\n";
  } else if (lower === "dir") {
    output.textContent += " Directory of C:\\User\n\n  Documents  Downloads  Pictures  Music\n  notepad.exe  paint.exe  calc.exe\n";
  } else {
    output.textContent += `'${cmd}' is not recognized as a command.\nType "help" for a list of commands.\n`;
  }
}

// ======================
// Sticky Notes
// ======================
window.stickyColor = (color, btn) => {
  const note = document.getElementById("stickyNote");
  if (note) note.style.background = color;
  document.querySelectorAll(".sticky-colors button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
};
