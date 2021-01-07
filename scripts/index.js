var lastPrimaryBG = ''
var lastSecondaryBG = ''
var currMinute = (new Date() - new Date().setHours(0, 0, 0, 0)) / 60000;

function init() {
    setupDynamicBackground()
}

function setupDynamicBackground() {
    function advanceBackground() {
        switch (true) {
            case (currMinute < 360):
                primaryBG = 'dusk';
                secondaryBG = 'night';
                break;
            case (currMinute < 720):
                primaryBG = 'day';
                secondaryBG = 'dusk';
                break;
            case (currMinute < 1080):
                primaryBG = 'dusk';
                secondaryBG = 'day';
                break;
            default:
                primaryBG = 'night';
                secondaryBG = 'dusk';
        }
        let primary = document.getElementById("background-primary");
        if (lastPrimaryBG !== primaryBG) {
            primary.style.background = `url('images/${primaryBG}.png')`;
            primary.style.backgroundPosition = 'center';
            lastPrimaryBG = primaryBG;
        }
        primary.style.opacity = 1 / 360 * (currMinute % 360);

        let secondary = document.body;
        if (lastSecondaryBG !== secondaryBG) {
            secondary.style.background = `url('images/${secondaryBG}.png')`;
            secondary.style.backgroundPosition = 'center';
            lastSecondaryBG = secondaryBG;
        }
        currMinute++;
    }
    advanceBackground();
    setInterval(advanceBackground, 60000);
}

function setupWeatherInfo(id, city, imageName, temp, humidity, clouds) {
    let bookmark = document.getElementById(`weather-info-${id}`).children;
    bookmark[0].innerHTML = city;
    bookmark[1].src = 'images/' + imageName + '.png';
    let stats = bookmark[2].children;
    stats[1].innerHTML = temp + '&#176'
    stats[3].innerHTML = humidity + '%';
    stats[5].innerHTML = clouds + '%';
}

function searchForCity() {
    requestCity(document.getElementById('search-textfield').value);
}

function requestCity(city) {
    if (!city) {
        document.getElementById('weather-info-4').style.visibility = "hidden";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.responseText === "")
                setupWeatherInfo(4, 'City Not Found', 'sun', '0', '0', '0')
            else handleResponse(JSON.parse(this.responseText));
            document.getElementById('weather-info-4').style.visibility = "visible";
        }
    };
    xhttp.open("GET", `fakeAPI/${city}.txt`, true);
    xhttp.send();
}

function handleResponse(response) {
    setupWeatherInfo(4, response.name, "sun", response.main.temp, response.main.humidity, response.clouds.all)
}