async function getWeather() {

    const city =
        document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        /* =================================
           CURRENT WEATHER
        ================================= */

        const currentURL =
            `/api/weather?city=${encodeURIComponent(city)}`;

        const currentResponse =
            await fetch(currentURL);

        const currentData =
            await currentResponse.json();

        if (!currentResponse.ok) {
            throw new Error(
                currentData.message || "City not found"
            );
        }


        /* =================================
           FORECAST
        ================================= */

        const forecastURL =
            `/api/forecast?city=${encodeURIComponent(city)}`;

        const forecastResponse =
            await fetch(forecastURL);

        const forecastData =
            await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(
                forecastData.message || "Forecast unavailable"
            );
        }


        /* =================================
           CURRENT WEATHER DETAILS
        ================================= */

        const cityName =
            document.getElementById("cityName");

        const temperature =
            document.getElementById("temperature");

        const description =
            document.getElementById("description");

        const humidity =
            document.getElementById("humidity");

        const wind =
            document.getElementById("wind");

        const feelsLike =
            document.getElementById("feelsLike");

        const weatherIcon =
            document.getElementById("weatherIcon");


        if (cityName) {
            cityName.textContent =
                currentData.name;
        }

        if (temperature) {
            temperature.textContent =
                `${Math.round(currentData.main.temp)}°C`;
        }

        if (description) {
            description.textContent =
                currentData.weather[0].description;
        }

        if (humidity) {
            humidity.textContent =
                `${currentData.main.humidity}%`;
        }

        if (wind) {
            wind.textContent =
                `${(currentData.wind.speed * 3.6).toFixed(1)} km/h`;
        }

        if (feelsLike) {
            feelsLike.textContent =
                `${Math.round(currentData.main.feels_like)}°C`;
        }


        /* =================================
           WEATHER ICON
        ================================= */

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


        if (weatherIcon) {

            weatherIcon.textContent =
                icons[condition] || "🌤️";
        }


        /* =================================
           DYNAMIC WEATHER BACKGROUND
        ================================= */

        document.body.classList.remove(
            "sunny",
            "cloudy",
            "rainy",
            "stormy",
            "snowy"
        );


        if (condition === "Clear") {

            document.body.classList.add("sunny");

        }

        else if (
            condition === "Rain" ||
            condition === "Drizzle"
        ) {

            document.body.classList.add("rainy");

        }

        else if (condition === "Thunderstorm") {

            document.body.classList.add("stormy");

        }

        else if (condition === "Snow") {

            document.body.classList.add("snowy");

        }

        else if (
            condition === "Clouds" ||
            condition === "Mist" ||
            condition === "Haze" ||
            condition === "Fog"
        ) {

            document.body.classList.add("cloudy");

        }


        /* =================================
           5-DAY FORECAST
        ================================= */

