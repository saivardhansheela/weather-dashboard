async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        // ================================
        // CURRENT WEATHER
        // ================================

        const currentURL =
            `/api/weather?city=${encodeURIComponent(city)}`;

        const currentResponse = await fetch(currentURL);
        const currentData = await currentResponse.json();

        if (!currentResponse.ok) {
            throw new Error(
                currentData.message || "City not found"
            );
        }


        // ================================
        // FORECAST
        // ================================

        const forecastURL =
            `/api/forecast?city=${encodeURIComponent(city)}`;

        const forecastResponse = await fetch(forecastURL);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(
                forecastData.message || "Forecast unavailable"
            );
        }


        // ================================
        // CURRENT WEATHER ELEMENTS
        // ================================

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


        // ================================
        // WEATHER ICON
        // ================================

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

            weatherIcon.style.animation = "none";

            void weatherIcon.offsetWidth;

            weatherIcon.style.animation =
                "floatingIcon 3s ease-in-out infinite";
        }


        // ================================
        // DYNAMIC BACKGROUND
        // ================================

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

        else if (
            condition === "Thunderstorm"
        ) {

            document.body.classList.add("stormy");

        }

        else if (
            condition === "Snow"
        ) {

            document.body.classList.add("snowy");

        }

        else {

            document.body.classList.add("cloudy");

        }


        // ================================
        // 5 DAY FORECAST
        // ================================

        // IMPORTANT:
        // HTML uses forecastContainer

        const forecastContainer =
            document.getElementById("forecastContainer");


        if (!forecastContainer) {

            console.log(
                "Forecast container not found"
            );

        }

        else {

            forecastContainer.innerHTML = "";


            const dailyForecast = {};


            forecastData.list.forEach(item => {

                const date =
                    new Date(item.dt * 1000);

                const dateKey =
                    date.toISOString().split("T")[0];


                if (!dailyForecast[dateKey]) {

                    dailyForecast[dateKey] = item;

                }

            });


            const forecastDays =
                Object.values(dailyForecast).slice(0, 5);


            forecastDays.forEach(
                (item, index) => {

                    const date =
                        new Date(item.dt * 1000);


                    const day =
                        date.toLocaleDateString(
                            "en-US",
                            {
                                weekday: "short"
                            }
                        );


                    const forecastCondition =
                        item.weather[0].main;


                    const forecastIcon =
                        icons[forecastCondition] ||
                        "🌤️";


                    const card =
                        document.createElement("div");


                    card.className =
                        "forecast-card";


                    card.style.animation =
                        `forecastAppear 0.6s ease ${index * 0.15}s both`;


                    card.innerHTML = `

                        <h3>${day}</h3>

                        <div class="forecast-icon">
                            ${forecastIcon}
                        </div>

                        <p>
                            ${Math.round(item.main.temp)}°C
                        </p>

                        <span>
                            ${item.weather[0].description}
                        </span>

                    `;


                    forecastContainer.appendChild(card);

                }
            );

        }


        // ================================
        // WEATHER CARD ANIMATION
        // ================================

        const weatherDisplay =
            document.querySelector(".weather-display");


        if (weatherDisplay) {

            weatherDisplay.style.animation = "none";

            void weatherDisplay.offsetWidth;

            weatherDisplay.style.animation =
                "weatherFloat 0.8s ease";

        }


        // ================================
        // ROCKET LAUNCH 🚀
        // ================================

        const rocket =
            document.querySelector(".rocket");


        if (rocket) {

            rocket.classList.remove("launch");

            void rocket.offsetWidth;

            rocket.classList.add("launch");

        }


        // ================================
        // SUCCESS MESSAGE
        // ================================

        console.log(
            `Weather loaded successfully for ${currentData.name}`
        );

    }


    catch (error) {

        console.error(
            "Weather Error:",
            error
        );

        alert(
            error.message ||
            "Something went wrong"
        );

    }

}
