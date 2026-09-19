async function getWeather() {

    const city =
        document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        // Current weather API

        const currentURL =
            `/api/weather?city=${encodeURIComponent(city)}';


        // 5-day forecast API

        const forecastURL =
            `/api/forecast?city=${encodeURIComponent(city)}`;


        const currentResponse =
            await fetch(currentURL);

        const currentData =
            await currentResponse.json();


        if (!currentResponse.ok) {
            throw new Error(
                currentData.message || "City not found"
            );
        }


        const forecastResponse =
            await fetch(forecastURL);

        const forecastData =
            await forecastResponse.json();


        if (!forecastResponse.ok) {
            throw new Error(
                forecastData.message || "Forecast unavailable"
            );
        }


        // Current Weather

        document.getElementById("cityName").textContent =
            currentData.name;


        document.getElementById("temperature").textContent =
            `${Math.round(currentData.main.temp)}°C`;


        document.getElementById("description").textContent =
            currentData.weather[0].description;


        document.getElementById("humidity").textContent =
            `${currentData.main.humidity}%`;


        document.getElementById("wind").textContent =
            `${(currentData.wind.speed * 3.6).toFixed(1)} km/h`;


        document.getElementById("feelsLike").textContent =
            `${Math.round(currentData.main.feels_like)}°C`;


        // Weather Icon

        const condition =
            currentData.weather[0].main;


        const icons = {

            Clear: "☀️",

            Clouds: "☁️",

            Rain: "🌧️",

            Drizzle: "🌦️",

            Thunderstorm: "⛈️",

            Snow: "❄️",

            Mist: "🌫️",

            Haze: "🌫️",

            Fog: "🌫️"

        };


        document.getElementById("weatherIcon")
            .textContent =
            icons[condition] || "🌤️";


        // Create Forecast

        createForecast(forecastData.list);

    }

    catch (error) {

        console.error(error);

        alert("Error: " + error.message);

    }
}


/* 5-Day Forecast */

function createForecast(forecastList) {

    const container =
        document.getElementById("forecastContainer");


    container.innerHTML = "";


    const dailyForecast = {};


    forecastList.forEach(item => {

        const date =
            new Date(item.dt * 1000);

        const dateKey =
            date.toISOString().split("T")[0];


        if (!dailyForecast[dateKey]) {

            dailyForecast[dateKey] = [];

        }


        dailyForecast[dateKey].push(item);

    });


    const days =
        Object.values(dailyForecast)
            .slice(0, 5);


    days.forEach(day => {

        const midday =
            day.reduce((closest, item) => {

                const hour =
                    new Date(item.dt * 1000).getHours();

                const closestHour =
                    new Date(closest.dt * 1000).getHours();

                return Math.abs(hour - 12) <
                    Math.abs(closestHour - 12)
                    ? item
                    : closest;

            });


        const date =
            new Date(midday.dt * 1000);


        const dayName =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });


        const temperature =
            Math.round(midday.main.temp);


        const description =
            midday.weather[0].description;


        const condition =
            midday.weather[0].main;


        const iconMap = {

            Clear: "☀️",

            Clouds: "☁️",

            Rain: "🌧️",

            Drizzle: "🌦️",

            Thunderstorm: "⛈️",

            Snow: "❄️",

            Mist: "🌫️",

            Haze: "🌫️",

            Fog: "🌫️"

        };


        const icon =
            iconMap[condition] || "🌤️";


        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <div class="forecast-icon">
                ${icon}
            </div>

            <div class="forecast-temp">
                ${temperature}°C
            </div>

            <div class="forecast-desc">
                ${description}
            </div>

        `;


        container.appendChild(card);

    });

}