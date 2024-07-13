// Import express and axios
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


// Create an express app and set the port number.
const app = express();
const port = 8000;

// Enter apiKey.
const apiKey = '';

// middleware & static files
app.set('view engine', 'ejs');
// Use the public folder for static files.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    const message = 'Waiting for data...';
    res.render('home.ejs');
});

function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "gain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    }
    return iconMap[weatherCondition] || "help";
} 

app.post('/search', async (req, res) => {
    const city = req.body.location;
    
    try {
        const response = await axios.post(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);

        const currentDate = new Date();
        var weatherIcon = getWeatherIconName(response.data.weather[0].main);
        
        res.render('index.ejs', {
            weather: weatherIcon,   
            weather_des: response.data.weather[0].description,
            city: response.data.name,
            date: currentDate.toDateString(),
            temp: Math.round(response.data.main.temp),
            wind_speed: response.data.wind.speed,
            humidity_per: response.data.main.humidity,
            visibility_distance: response.data.visibility/1000
        });

    } catch (error) {
        console.error('Failed to make request: ', error.message);
        res.render('index.ejs', {
            error: "Resource not found"
        });
    }
});


// listen for request 
app.listen(port, () => {
    console.log(`Server has started on Port: ${port}.`);
});