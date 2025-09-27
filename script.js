async function getWeather() {
  const city = document.getElementById("city").value;
  const apiKey = "your_api_key_here"; // get free API key from openweathermap.org
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    document.getElementById("result").innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <p>🌡 Temp: ${data.main.temp}°C</p>
      <p>☁️ Weather: ${data.weather[0].description}</p>
    `;
  } else {
    document.getElementById("result").innerHTML = `<p>City not found!</p>`;
  }
}
