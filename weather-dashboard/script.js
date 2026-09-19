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
            `/api/weather?city=${encodeURIComponent(city)}`;


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

