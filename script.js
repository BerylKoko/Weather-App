const background = document.getElementById("background");
const resultSection = document.getElementById("result");


const bgImages = {
  "sunny": "images/sunny.jpg",
  "partly cloudy": "images/partly cloudy.jpg",
  "cloudy": "images/cloudy.jpg",
  "rainy": "images/rainy.jpg",
  "snowing": "images/snowing.jpg",
  "snowing2": "images/lightning.jpg"
};

function clearParticles() {
  document.querySelectorAll(".particle").forEach(p => p.remove());
}


function addRain(count) {
  clearParticles();
  for(let i=0;i<count;i++){
    const drop = document.createElement("div");
    drop.className = "particle";
    drop.style.width = "2px";
    drop.style.height = "10px";
    drop.style.left = `${Math.random()*100}vw`;
    drop.style.top = `${Math.random()*-100}vh`;
    drop.style.animationDuration = `${0.5 + Math.random()*0.5}s`;
    document.body.appendChild(drop);
  }
}


function addSnow(count) {
  clearParticles();
  for(let i=0;i<count;i++){
    const flake = document.createElement("div");
    flake.className = "particle";
    flake.style.width = "4px";
    flake.style.height = "4px";
    flake.style.left = `${Math.random()*100}vw`;
    flake.style.top = `${Math.random()*-100}vh`;
    flake.style.background = "white";
    flake.style.animationDuration = `${1 + Math.random()*1.5}s`;
    document.body.appendChild(flake);
  }
}

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  if(!city) return alert("Enter a city name");

  try {
    clearParticles();
    resultSection.innerHTML = "";

    // Geocoding
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();
    if(!geoData.results || geoData.results.length===0) throw new Error("City not found");

    const { latitude, longitude, name, country } = geoData.results[0];

   
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    const temp = weatherData.current_weather.temperature;
    const code = weatherData.current_weather.weathercode;

    let weatherDesc = "";
    if(code===0) weatherDesc="sunny";
    else if(code<=3) weatherDesc="partly cloudy";
    else if(code<=49) weatherDesc="cloudy";
    else if(code<=77) weatherDesc="snowing";
    else if(code<=99) weatherDesc="rainy";
    else weatherDesc="sunny";

 
    if(bgImages[weatherDesc]) {
      background.style.backgroundImage = `url('${bgImages[weatherDesc]}')`;
    }

    if(weatherDesc==="rainy") addRain(50);
    else if(weatherDesc.includes("snow")) addSnow(50);


    resultSection.innerHTML = `
      <div class="weather-card fade-in">
        <h2>${name}, ${country}</h2>
        <p>🌡 Temp: ${temp}°C</p>
        <p>☁️ Weather: ${weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1)}</p>
      </div>
    `;

    document.getElementById("city").value = "";

  } catch(err) {
    resultSection.innerHTML = `<p class="fade-in" style="color:white;">${err.message}</p>`;
  }
}


document.getElementById("city").addEventListener("keypress", e=>{
  if(e.key==="Enter") getWeather();
});
