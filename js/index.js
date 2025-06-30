let wallpapers = [
  '/assets/wallpaper/46361 (1).jpg',
  '/assets/wallpaper/510.jpg',
  '/assets/wallpaper/5a02bfbfafcc44cb8b5128e8b102edf3.jpg',
  '/assets/wallpaper/win11.jpg'
];
let zIndexCounter = 100;

function contextMenu() {
  try {
    const contextMenu = document.getElementById("contextMenu");
    if (!contextMenu) throw new Error("#contextMenu not found");

    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      contextMenu.style.top = `${e.pageY}px`;
      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.classList.remove("hidden");
    });

    document.addEventListener("click", function () {
      contextMenu.classList.add("hidden");
    });
  } catch (err) {
    console.error("Context menu error:", err);
  }
}

function refresh() {
  location.reload();
}

function clock() {
  try {
    const clock = document.querySelector('#clock');
    const date = document.querySelector('#date');
    if (!clock || !date) throw new Error("Clock or date element not found");

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };

    setInterval(() => {
      try {
        const now = new Date();
        clock.innerHTML = new Intl.DateTimeFormat('en-IN', options).format(now);
        date.innerHTML = now.toLocaleDateString('en-IN');
      } catch (timeErr) {
        console.error("Clock tick error:", timeErr);
      }
    }, 1000);
  } catch (err) {
    console.error("Clock init error:", err);
  }
}

function openWeather() {
  try {
    const panel = document.getElementById("weatherPanel");
    if (!panel) throw new Error("Weather panel not found");

    panel.classList.add("show");
    panel.classList.remove("hidden");

    document.getElementById("weatherCity").innerText = "Loading...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      (err) => {
        console.error("📍 Location access denied", err);
        getWeather("Delhi");
      }
    );
  } catch (err) {
    console.error("Open weather error:", err);
  }
}

function closeWeather() {
  try {
    const panel = document.getElementById("weatherPanel");
    if (panel) panel.classList.remove("show");
  } catch (err) {
    console.error("Close weather error:", err);
  }
}

async function getWeather(city) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7cbaaeb6b69f4cb0bfc73034251905&q=${city}&days=1&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("weatherTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("weatherCity").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("weatherCondition").innerText = data.current.condition.text;

    const iconUrl = data.current.condition.icon.startsWith("//")
      ? "https:" + data.current.condition.icon
      : data.current.condition.icon;
    document.getElementById("weatherIcon1").src = iconUrl;

    document.getElementById("feelsLike").innerText = `${data.current.feelslike_c}°C`;
    document.getElementById("humidity").innerText = `${data.current.humidity}%`;
    document.getElementById("wind").innerText = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
    document.getElementById("visibility").innerText = `${data.current.vis_km} km`;
  } catch (err) {
    console.error("Weather load error:", err);
    const cityElem = document.getElementById("weatherCity");
    if (cityElem) cityElem.innerText = "Error loading weather";
  }
}

async function updateTaskbarWeather(city) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7cbaaeb6b69f4cb0bfc73034251905&q=${city}&days=1&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();

    const iconUrl = data.current.condition.icon.startsWith("//")
      ? "https:" + data.current.condition.icon
      : data.current.condition.icon;

    document.getElementById("weatherIcon").src = iconUrl;
    document.getElementById("weatherTempDown").innerText = `${data.current.temp_c}°C`;
  } catch (err) {
    console.error("❌ Taskbar weather error", err);
    const tempDown = document.getElementById("weatherTempDown");
    if (tempDown) tempDown.innerText = "--°C";
  }
}

function changeWallpaper() {
  try {
    if (wallpapers.length === 0) throw new Error("No wallpapers available");
    const current = wallpapers.shift();
    wallpapers.push(current);

    document.body.style.backgroundImage = `url('${wallpapers[0]}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    localStorage.setItem("os-wallpaper", wallpapers[0]);
  } catch (err) {
    console.error("Wallpaper change error:", err);
  }
}

function showApp(id) {
  try {
    const app = document.getElementById(id);
    if (!app) throw new Error(`App ${id} not found`);

    if (id === "terminal") {
      createNewInput();
    }

    app.style.display = 'block';
    addToTaskbar(id);
    app.classList.remove('fullscreen');

    document.querySelectorAll('.app-icon').forEach(icon => {
      icon.classList.remove('active');
    });
    const activeIcon = document.querySelector(`.app-icon[data-app="${id}"]`);
    if (activeIcon) activeIcon.classList.add('active');

    app.style.zIndex = ++zIndexCounter;
    app.classList.remove('animate');
    void app.offsetWidth;
    app.classList.add('animate');
  } catch (err) {
    console.error("Show app error:", err);
  }
}

function setupGlobalWindowControls() {
  try {
    document.querySelectorAll('.window-controls button').forEach((btn) => {
      btn.addEventListener('click', () => {
        try {
          const action = btn.dataset.action;
          const appId = btn.dataset.app;
          const appWindow = document.getElementById(appId);
          if (!appWindow) throw new Error(`Window not found: ${appId}`);

          if (action === 'minimize') {
            appWindow.classList.add('minimizing');
            setTimeout(() => {
              appWindow.style.display = 'none';
              appWindow.classList.remove('minimizing');
              addToTaskbar(appId);
            }, 200);
          } else if (action === 'maximize') {
            appWindow.classList.add('maximizing');
            appWindow.classList.toggle('fullscreen');
            setTimeout(() => {
              appWindow.classList.remove('maximizing');
            }, 0);
          } else if (action === 'close') {
            appWindow.classList.add('closing');
            setTimeout(() => {
              appWindow.style.display = 'none';
              appWindow.classList.remove('closing');
              removeFromTaskbar(appId);
            }, 200);
          }
        } catch (innerErr) {
          console.error("Window control error:", innerErr);
        }
      });
    });
  } catch (err) {
    console.error("Setup window controls error:", err);
  }
}

function addToTaskbar(appId) {
  try {
    const taskbar = document.getElementById('openApps');
    const existing = document.querySelector(`.app-icon[data-app="${appId}"]`);
    if (existing) return;

    const iconWindow = document.getElementById(appId);
    const iconImg = iconWindow?.querySelector('.title-left img');
    const iconSrc = iconImg ? iconImg.getAttribute('src') : "";

    const appIcon = document.createElement('div');
    appIcon.className = "app-icon";
    appIcon.dataset.app = appId;
    appIcon.title = appId;

    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = appId;
    img.style.width = '24px';
    img.style.height = '24px';

    appIcon.appendChild(img);
    taskbar.appendChild(appIcon);

    appIcon.addEventListener('click', () => {
      showApp(appId);
    });
  } catch (err) {
    console.error("Add to taskbar error:", err);
  }
}

function removeFromTaskbar(appId) {
  try {
    const icon = document.querySelector(`.app-icon[data-app="${appId}"]`);
    if (icon) icon.remove();
  } catch (err) {
    console.error("Remove from taskbar error:", err);
  }
}

function enableDrag(appWindow) {
  try {
    const titleBar = appWindow.querySelector('.title-bar');
    if (!titleBar) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      appWindow.style.zIndex = ++zIndexCounter;
      offsetX = e.clientX - appWindow.offsetLeft;
      offsetY = e.clientY - appWindow.offsetTop;

      document.addEventListener('mousemove', moveApp);
      document.addEventListener('mouseup', stopDrag);
    });

    function moveApp(e) {
      if (!isDragging) return;
      appWindow.style.left = `${e.clientX - offsetX}px`;
      appWindow.style.top = `${e.clientY - offsetY}px`;
      appWindow.classList.remove('fullscreen', 'snap-left', 'snap-right', 'snap-top');
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', moveApp);
      document.removeEventListener('mouseup', stopDrag);
    }
  } catch (err) {
    console.error("Enable drag error:", err);
  }
}

function enableResizableApps() {
  try {
    document.querySelectorAll('.app-window').forEach(appWindow => {
      const directions = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

      directions.forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${dir}`;
        appWindow.appendChild(handle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight, startTop, startLeft;

        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isResizing = true;

          startX = e.clientX;
          startY = e.clientY;

          const rect = appWindow.getBoundingClientRect();
          startWidth = rect.width;
          startHeight = rect.height;
          startTop = rect.top;
          startLeft = rect.left;

          document.addEventListener('mousemove', resize);
          document.addEventListener('mouseup', () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
          });

          function resize(e) {
            if (!isResizing) return;

            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            if (dir.includes('right')) {
              appWindow.style.width = `${Math.max(200, startWidth + dx)}px`;
            }
            if (dir.includes('bottom')) {
              appWindow.style.height = `${Math.max(150, startHeight + dy)}px`;
            }
            if (dir.includes('left')) {
              const newWidth = Math.max(200, startWidth - dx);
              appWindow.style.width = `${newWidth}px`;
              appWindow.style.left = `${startLeft + dx}px`;
            }
            if (dir.includes('top')) {
              const newHeight = Math.max(150, startHeight - dy);
              appWindow.style.height = `${newHeight}px`;
              appWindow.style.top = `${startTop + dy}px`;
            }
          }
        });
      });
    });
  } catch (err) {
    console.error("Enable resizable apps error:", err);
  }
}



window.onload = () => {
  setupGlobalWindowControls();
  updateTaskbarWeather("Delhi"); // fallback
  enableResizableApps();  // 👈 Call it here
  // contextMenu()
  clock();
  document.querySelectorAll('.app-window').forEach(enableDrag)

};
window.addEventListener("DOMContentLoaded", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      updateTaskbarWeather(`${lat},${lon}`);
    },
    (err) => {
      console.error("📍 Location denied for taskbar", err);
    }
  );


});

