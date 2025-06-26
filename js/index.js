let wallpapers = [
  '/assets/wallpaper/46361 (1).jpg',
  '/assets/wallpaper/510.jpg',
  '/assets/wallpaper/5a02bfbfafcc44cb8b5128e8b102edf3.jpg',
  '/assets/wallpaper/win11.jpg'
];
let zIndexCounter = 100; // global at top of script


function contextMenu() {

  const contextMenu = document.getElementById("contextMenu");

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    // position the menu
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;

    // show it
    contextMenu.classList.remove("hidden");
  });

  // Left click anywhere else hides it
  document.addEventListener("click", function () {
    contextMenu.classList.add("hidden");
  });
  console.log(e.pageY)
}
function refresh() {
  location.reload(); // ya custom refresh logic
}

function clock() {
  const clock = document.querySelector('#clock');
  const date = document.querySelector('#date');

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };

  setInterval(() => {
    const now = new Date(); // ✅ Move inside interval for real-time updates
    const time = new Intl.DateTimeFormat('en-IN', options).format(now);
    const today = now.toLocaleDateString('en-IN');

    clock.innerHTML = time;
    date.innerHTML = today;
  }, 1000);
}


// ⛅ OPEN WEATHER PANEL
function openWeather() {
  const panel = document.getElementById("weatherPanel");
  panel.classList.add("show");
  panel.classList.remove("hidden");

  document.getElementById("weatherCity").innerText = "Loading...";

  // 📍 Auto location fetch
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      getWeather(`${lat},${lon}`);
    },
    (err) => {
      console.error("📍 Location access denied", err);
      getWeather("Delhi"); // fallback
    }
  );
}

// ❌ CLOSE WEATHER PANEL
function closeWeather() {
  document.getElementById("weatherPanel").classList.remove("show");
}

// 🌤️ GET FULL WEATHER FOR PANEL
async function getWeather(city) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7cbaaeb6b69f4cb0bfc73034251905&q=${city}&days=1&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();

    // 🌡️ Panel main info
    document.getElementById("weatherTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("weatherCity").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("weatherCondition").innerText = data.current.condition.text;

    // ☁️ Weather icon
    const iconUrl = data.current.condition.icon.startsWith("//")
      ? "https:" + data.current.condition.icon
      : data.current.condition.icon;
    document.getElementById("weatherIcon1").src = iconUrl;

    // 🌡️ Extra panel info
    document.getElementById("feelsLike").innerText = `${data.current.feelslike_c}°C`;
    document.getElementById("humidity").innerText = `${data.current.humidity}%`;
    document.getElementById("wind").innerText = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
    document.getElementById("visibility").innerText = `${data.current.vis_km} km`;

  } catch (err) {
    console.error("Weather load error:", err);
    document.getElementById("weatherCity").innerText = "Error loading weather";
  }
}

// 📦 UPDATE TASKBAR WEATHER (icon + temp)
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
    document.getElementById("weatherTempDown").innerText = "--°C";
  }
}




// 🖼️ Change to random wallpaper

function changeWallpaper() {
  let current = wallpapers.shift(); // pehla image hatao
  wallpapers.push(current);         // usko last me bhej do

  document.body.style.backgroundImage = `url('${wallpapers[0]}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  localStorage.setItem("os-wallpaper", wallpapers[0]);
}




function showApp(id) {
  const app = document.getElementById(id);

  if (app) {
    app.style.display = 'flex';
    addToTaskbar(id)
    app.classList.remove('fullscreen'); // optional
  }
  // 🔷 Highlight active icon
  document.querySelectorAll('.app-icon').forEach(icon => {
    icon.classList.remove('active');
  });
  const activeIcon = document.querySelector(`.app-icon[data-app="${id}"]`);
  if (activeIcon) activeIcon.classList.add('active');

  // Bring to front
  app.style.zIndex = ++zIndexCounter;

  app.classList.remove('animate');
  void app.offsetWidth; // reflow trick to re-trigger
  app.classList.add('animate');
}



function setupGlobalWindowControls() {
  document.querySelectorAll('.window-controls button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const appId = btn.dataset.app;
      const appWindow = document.getElementById(appId);
      const appIcon = document.querySelector(`.app-icon[data-app="${appId}"]`);

      if (!appWindow) return;

      if (action === 'minimize') {
        appWindow.classList.add('minimizing');

        // ⏳ Wait for animation to finish before hiding
        setTimeout(() => {
          appWindow.style.display = 'none';
          appWindow.classList.remove('minimizing');

          addToTaskbar(appId); // already existing logic
        }, 200); // matches animation duration
      }

      else if (action === 'maximize') {
        appWindow.classList.add('maximizing');
        appWindow.classList.toggle('fullscreen');

        // remove the animation class after it finishes
        setTimeout(() => {
          appWindow.classList.remove('maximizing');
        }, 0);
      }

      else if (action === 'close') {
        appWindow.classList.add('closing');

        setTimeout(() => {
          appWindow.style.display = 'none';
          appWindow.classList.remove('closing');
          removeFromTaskbar(appId);
        }, 200); // Match animation duration
      }

    })
  })





}


function addToTaskbar(appId) {
  const taskbar = document.getElementById('openApps')
  const existing = document.querySelector(`.app-icon[data-app="${appId}"]`);
  if (existing) return; // already there

  const iconWindow = document.getElementById(appId)
  const iconImg = iconWindow.querySelector('.title-left img');
  const iconSrc = iconImg ? iconImg.getAttribute('src') : "No Icon";

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
    showApp(appId)
  })

}

function removeFromTaskbar(appId) {
  const icon = document.querySelector(`.app-icon[data-app="${appId}"]`);
  if (icon) icon.remove();
}


// openWeather()
window.addEventListener("DOMContentLoaded", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      updateTaskbarWeather(`${lat},${lon}`);
    },
    (err) => {
      console.error("📍 Location denied for taskbar", err);
      updateTaskbarWeather("Delhi"); // fallback
    }
  );


});
window.onload = () => {
  setupGlobalWindowControls();
};
clock();

// contextMenu()
