
function calculatePrahar(sunrise, sunset) {
    const diff = moment.unix(sunset).diff(moment.unix(sunrise), 'minutes');
    const praharDuration = diff / 4;
    let start = moment.unix(sunrise);
    let praharTimes = [];

    for (let i = 0; i < 4; i++) {
        let end = start.clone().add(praharDuration, 'minutes');
        // Apply rounding to the end time
        if (end.seconds() > 0 || end.milliseconds() > 0) {
            end.add(1, 'minutes').startOf('minute');
        }
        praharTimes.push({
            start: start.format('hh:mm a'),
            end: end.format('hh:mm a')
        });
        start = end;
    }

    return praharTimes;
}


document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const apiKey = "47f1999f8cb27f081b564654013442a4"; // Your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const sunrise = moment.unix(data.sys.sunrise).format('hh:mm a');
        const sunset = moment.unix(data.sys.sunset).format('hh:mm a');
        const navkarshi = moment.unix(data.sys.sunrise).add(48, 'minutes').format('hh:mm a');
        const diff = moment.unix(data.sys.sunset).diff(moment.unix(data.sys.sunrise), 'minutes');
        // Calculate Porshi time, which is half the difference added to sunrise time
        let porshiMoment = moment.unix(data.sys.sunrise).add(diff / 4, 'minutes');
        // Round to the nearest minute if the result is a decimal
        if (porshiMoment.seconds() > 0 || porshiMoment.milliseconds() > 0) {
            porshiMoment.add(1, 'minutes').startOf('minute');
        }
        const porshi = porshiMoment.format('hh:mm a');
        const praharTimes = calculatePrahar(data.sys.sunrise, data.sys.sunset);
        let morningPratikaman = moment.unix(data.sys.sunrise).subtract(48, 'minutes').format('hh:mm a');
        // Calculate evening Pratikaman as the sunset time
        let eveningPratikaman = sunset;

        document.getElementById('sunrise-display').innerText = `Sunrise: ${sunrise}`;
        document.getElementById('sunset-display').innerText = `Sunset: ${sunset}`;
        document.getElementById('navkarshi').innerText = `Navkarshi: ${navkarshi}`; 
        document.getElementById('porshi').innerText = `Porshi: ${porshi}`;
        document.getElementById('prahar').innerHTML = praharTimes.map((prahar, index) => `Day Prahar ${index + 1}: ${prahar.start} - ${prahar.end}`).join('<br>');
        document.getElementById('morning-pratikaman').innerText = `Morning Pratikaman: ${morningPratikaman}`;
        document.getElementById('evening-pratikaman').innerText = `Evening Pratikaman: ${eveningPratikaman}`;
       
    })
    .catch(error => console.error('Error:', error));
});

// Call the function with "New Delhi" as the default city when the page loads
fetchAndDisplayWeather("New Delhi");

// Keep the existing event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchAndDisplayWeather(city);
});

// Function to update the displayed date and fetch weather data for the new date
function updateDateAndFetchWeather(date) {
    document.getElementById('current-date').innerText = date.format('dddd, MMMM Do YYYY');
    fetchAndDisplayWeather("New Delhi", date.format('YYYY-MM-DD'));
}

// Initialize the current date
let currentDate = moment();
updateDateAndFetchWeather(currentDate);

// Function to update the displayed date and fetch weather data for the new date
function updateDateAndFetchWeather(date) {
    // Format the date as DD/MM/YYYY
    const formattedDate = date.format('DD/MM/YYYY');
    document.getElementById('current-date').innerText = formattedDate;
    fetchAndDisplayWeather("New Delhi", date.format('YYYY-MM-DD'));
}

// Event listeners for changing the date
document.getElementById('prev-date-button').addEventListener('click', function() {
    currentDate.subtract(1, 'days');
    updateDateAndFetchWeather(currentDate);
});

document.getElementById('next-date-button').addEventListener('click', function() {
    currentDate.add(1, 'days');
    updateDateAndFetchWeather(currentDate);
});

updateDateAndFetchWeather(currentDate);

// Modify the fetchAndDisplayWeather function to accept a date parameter
function fetchAndDisplayWeather(city, date) {
    const apiKey = "47f1999f8cb27f081b564654013442a4"; // Your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&dt=${date}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Assuming the API returns sunrise and sunset times in Unix timestamp format
        const sunrise = moment.unix(data.sys.sunrise).format('hh:mm a');
        const sunset = moment.unix(data.sys.sunset).format('hh:mm a');

        // Update the displayed sunrise and sunset times
        document.getElementById('sunrise-display').innerText = `Sunrise: ${sunrise}`;
        document.getElementById('sunset-display').innerText = `Sunset: ${sunset}`;
        /*const sunrise = moment.unix(data.sys.sunrise).format('hh:mm a');
        const sunset = moment.unix(data.sys.sunset).format('hh:mm a');*/
        const navkarshi = moment.unix(data.sys.sunrise).add(48, 'minutes').format('hh:mm a');
        const diff = moment.unix(data.sys.sunset).diff(moment.unix(data.sys.sunrise), 'minutes');
        // Calculate Porshi time, which is half the difference added to sunrise time
        let porshiMoment = moment.unix(data.sys.sunrise).add(diff / 4, 'minutes');
        // Round to the nearest minute if the result is a decimal
        if (porshiMoment.seconds() > 0 || porshiMoment.milliseconds() > 0) {
            porshiMoment.add(1, 'minutes').startOf('minute');
        }
        const porshi = porshiMoment.format('hh:mm a');
        const praharTimes = calculatePrahar(data.sys.sunrise, data.sys.sunset);
        let morningPratikaman = moment.unix(data.sys.sunrise).subtract(48, 'minutes').format('hh:mm a');
        // Calculate evening Pratikaman as the sunset time
        let eveningPratikaman = sunset;

        document.getElementById('sunrise-display').innerText = `Sunrise: ${sunrise}`;
        document.getElementById('sunset-display').innerText = `Sunset: ${sunset}`;
        document.getElementById('navkarshi').innerText = `Navkarshi: ${navkarshi}`; 
        document.getElementById('porshi').innerText = `Porshi: ${porshi}`;
        document.getElementById('prahar').innerHTML = praharTimes.map((prahar, index) => `Day Prahar ${index + 1}: ${prahar.start} - ${prahar.end}`).join('<br>');
        document.getElementById('morning-pratikaman').innerText = `Morning Pratikaman: ${morningPratikaman}`;
        document.getElementById('evening-pratikaman').innerText = `Evening Pratikaman: ${eveningPratikaman}`;
    
    })
    .catch(error => console.error('Error:', error));
}
