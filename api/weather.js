export default async function handler(req, res) {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            message: "City is required"
        });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}
