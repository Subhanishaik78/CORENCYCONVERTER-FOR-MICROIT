const API_KEY = '6fa966ec76f244e6afa172913250206';
const BASE_URL = 'https://api.weatherapi.com/v1';

const $ = selector => document.querySelector(selector);
const searchInput = $('#search-input');
const searchButton = $('#search-button');
const weatherInfo = $('.weather-info');
const errorDiv = $('.error');
const forecastContainer = $('.forecast-container');

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', e => e.key === 'Enter' && handleSearch());

async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) return;

    try {
        const [current, forecast] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city)
        ]);
        updateCurrentWeather(current);
        updateForecast(forecast);
        weatherInfo.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    } catch {
        showError();
    }
}

async function fetchWeather(city) {
    const url = ${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    return res.json();
}

async function fetchForecast(city) {
    const url = ${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Forecast not available');
    return res.json();
}

function updateCurrentWeather(data) {
    $('.city').textContent = ${data.location.name}, ${data.location.country};
    $('.date').textContent = ${formatDate()} | Local time: ${data.location.localtime.split(' ')[1]};
    
    const iconUrl = https:${data.current.condition.icon};
    $('.temp').innerHTML = `
        <img src="${iconUrl}" alt="${data.current.condition.text}" style="width: 50px; vertical-align: middle;">
        ${Math.round(data.current.temp_c)}°C
    `;
    
    $('.weather').textContent = data.current.condition.text;
    $('.hi-low').innerHTML = `
        Feels like: ${Math.round(data.current.feelslike_c)}°C<br>
        UV Index: ${data.current.uv}
    `;
    $('.humidity span').textContent = Humidity: ${data.current.humidity}%;
    $('.wind span').innerHTML = Wind: ${Math.round(data.current.wind_kph)} km/h ${data.current.wind_dir};
}

function updateForecast(data) {
    forecastContainer.innerHTML = '';

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconUrl = https:${day.day.condition.icon};

        const forecastEl = document.createElement('div');
        forecastEl.className = 'forecast-day';
        forecastEl.innerHTML = `
            <div class="date">${dayName}, ${monthDay}</div>
            <img src="${iconUrl}" alt="${day.day.condition.text}">
            <div class="temp-max">${Math.round(day.day.maxtemp_c)}°C</div>
            <div class="temp-min">${Math.round(day.day.mintemp_c)}°C</div>
            <div>${day.day.condition.text}</div>
        `;
        forecastContainer.appendChild(forecastEl);
    });
}

function showError() {
    weatherInfo.classList.add('hidden');
    errorDiv.classList.remove('hidden');
}

function formatDate() {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const now = new Date();
    return ${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()};
}