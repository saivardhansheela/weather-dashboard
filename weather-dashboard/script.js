async function getWeather() {

    const city =
        document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    // Rocket animation
    const searchButton =
        document.querySelector(".search-box button");

    searchButton.classList.remove("launch");

    void searchButton.offsetWidth;

    searchButton.classList.add("launch");


    try {

        const currentURL =
            `/api/weather?city=${encodeURIComponent(city)}`;

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
                forecastData.message ||
                "Forecast unavailable"
            );

        }


        /* Current Weather */

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


        /* Weather Icon */

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


        document.getElementById("weatherIcon").textContent =
            icons[condition] || "🌤️";


        /* Dynamic Background */

        setWeatherBackground(condition);


        /* Forecast */

        createForecast(
            forecastData.list
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Error: " + error.message
        );

    }
}


/* Dynamic Weather Background */

function setWeatherBackground(condition) {

    document.body.classList.remove(
        "weather-sunny",
        "weather-clouds",
        "weather-rain",
        "weather-drizzle",
        "weather-storm",
        "weather-snow",
        "weather-fog"
    );


    if (condition === "Clear") {

        document.body.classList.add(
            "weather-sunny"
        );

    }

    else if (condition === "Clouds") {

        document.body.classList.add(
            "weather-clouds"
        );

    }

    else if (condition === "Rain") {

        document.body.classList.add(
            "weather-rain"
        );

    }

    else if (condition === "Drizzle") {

        document.body.classList.add(
            "weather-drizzle"
        );

    }

    else if (condition === "Thunderstorm") {

        document.body.classList.add(
            "weather-storm"
        );

    }

    else if (condition === "Snow") {

        document.body.classList.add(
            "weather-snow"
        );

    }

    else if (
        condition === "Mist" ||
        condition === "Fog" ||
        condition === "Haze"
    ) {

        document.body.classList.add(
            "weather-fog"
        );

    }

    else {

        document.body.classList.add(
            "weather-clouds"
        );

    }
}


/* 5-Day Forecast */

function createForecast(forecastList) {

    const container =
        document.getElementById(
            "forecastContainer"
        );


    if (!container) {

        console.error(
            "forecastContainer not found"
        );

        return;
    }


    container.innerHTML = "";


    const dailyForecast = {};


    forecastList.forEach(item => {

        const date =
            new Date(item.dt * 1000);

        const dateKey =
            date.toISOString()
                .split("T")[0];


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
            day.reduce(
                (closest, item) => {

                    const hour =
                        new Date(
                            item.dt * 1000
                        ).getHours();


                    const closestHour =
                        new Date(
                            closest.dt * 1000
                        ).getHours();


                    return Math.abs(hour - 12) <
                        Math.abs(closestHour - 12)
                        ? item
                        : closest;

                }
            );


        const date =
            new Date(
                midday.dt * 1000
            );


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const temperature =
            Math.round(
                midday.main.temp
            );


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
            iconMap[condition] ||
            "🌤️";


        const card =
            document.createElement(
                "div"
            );


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
