document.addEventListener("DOMContentLoaded", () => {
  const range = document.getElementById("tempRange");
  const temperature = document.getElementById("temperature");
  const status = document.getElementById("status");
  const citySelect = document.getElementById("citySelect");
  const liveBtn = document.getElementById("liveBtn");

  const API_KEY = "3507f952ac9105f23901fcdb03f23f74";

  function updateStatus(value) {
    temperature.textContent = value + "°C";

    if (value < 10) {
      status.textContent = "Cold";
      status.className = "status cold";
    } else if (value <= 30) {
      status.textContent = "Normal";
      status.className = "status normal";
    } else {
      status.textContent = "Hot";
      status.className = "status hot";
    }
  }

  // Slider control
  range.addEventListener("input", () => {
    updateStatus(Number(range.value));
  });

  // Live weather button
  liveBtn.addEventListener("click", async () => {
    const city = citySelect.value;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();
      const liveTemp = Math.round(data.main.temp);

      range.value = liveTemp;
      updateStatus(liveTemp);

    } catch (error) {
      alert("Error fetching live weather data");
      console.error(error);
    }
  });

  // Initial load
  updateStatus(Number(range.value));
});
