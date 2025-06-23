

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


// async function weatherApi(name) {
//    let response = await fetch(
//       `https://api.weatherapi.com/v1/forecast.json?key=7cbaaeb6b69f4cb0bfc73034251905&q=${name}&days=1&aqi=no&alerts=no`
//     );
//     let data = await response.json();
//     console.log(data);
// }

function openWeather() {
  document.getElementById("weatherPanel").classList.add("show");
  document.getElementById("weatherPanel").classList.remove("hidden");

  // Fetch weather data here
  getWeather("wani");
}

function closeWeather() {
  document.getElementById("weatherPanel").classList.remove("show");
}


async function getWeather(city) {
  try {
    // const apiKey = "7cbaaeb6b69f4cb0bfc73034251905"; // OpenWeather API
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7cbaaeb6b69f4cb0bfc73034251905&q=${city}&days=1&aqi=no&alerts=no`;

    const res = await fetch(url);
    const data = await res.json();
    
 // Main info
    document.getElementById("weatherTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("weatherCity").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("weatherCondition").innerText = data.current.condition.text;

    // Weather icon (prepend https if needed)
    const iconUrl = data.current.condition.icon.startsWith("//")
      ? "https:" + data.current.condition.icon
      : data.current.condition.icon;
    document.getElementById("weatherIcon").src = iconUrl;

    // Extras
    document.getElementById("feelsLike").innerText = `${data.current.feelslike_c}°C`;
    document.getElementById("humidity").innerText = `${data.current.humidity}%`;
    document.getElementById("wind").innerText = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
    document.getElementById("visibility").innerText = `${data.current.vis_km} km`;

  } catch (err) {
    console.error("Weather load error:", err);
    document.getElementById("weatherCity").innerText = "Error loading weather";
  }

}




clock();
// contextMenu()