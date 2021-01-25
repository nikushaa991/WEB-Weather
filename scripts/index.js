var lastPrimaryBG = ''
var lastSecondaryBG = ''
var currMinute = (new Date() - new Date().setHours(0, 0, 0, 0)) / 60000;

function init() {
    setupDynamicBackground()
    let left = getCookie('left')
    let right = getCookie('right')
    if (left && left !== "")
        updateBookmarks(left, true)
    if (right && right !== "")
        updateBookmarks(right, false)
    setCurrentLocationTemp();
}

//HTML interface
function searchForCity() {
    requestCity(document.getElementById('search-textfield').value, 4, true);
}

function redirect(index) {
    var value = getCityByContainer(index);
    if (value == "Error" || value == "Needs Permission") return;
    window.location.href = `/city.html?name=${value}`
}

//Dynamic background
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

//Current location
function setCurrentLocationTemp() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationSuccess)
    }
}

//Geolocation API
async function locationSuccess(pos) {
    let requestURL = `https://api.positionstack.com/v1/reverse?access_key=d3477dae443ec8e560868664b6c15479&query=${pos.coords.latitude},${pos.coords.longitude}`

    let response = await fetch(requestURL)

    if (response.ok) {
        let json = await response.json();
        requestCity(json.data[0].locality, 2, false);
    }

}

//Bookmarks
function updateBookmarks(city, isLeft) {
    if (isLeft)
        requestCity(city, 1, false);
    else
        requestCity(city, 3, false);
}

//Weather API
async function requestCity(city, containerIndex, setInvis) {
    container = `weather-info-${containerIndex}`
    if (setInvis && !city) {
        setResultVisibility('hidden')
        return;
    }
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e7e7d5d2da4aee3dcb44529c9c69f31a`)

    if (response.ok) {
        let json = await response.json();
        handleResponse(json, containerIndex)
    } else setupWeatherInfo(containerIndex, 'Error', 'sun', '0', '0', '0')

    if (setInvis)
        setResultVisibility('visible')
}

function handleResponse(response, containerIndex) {
    let id = response.weather[0].id
    var icon = "sun"
    switch (String(id).charAt(0)) {
        case '2':
        case '3':
        case '5':
            icon = "rain"
            break;
        case '6':
            icon = "snow";
            break;
    }
    setupWeatherInfo(containerIndex, response.name, icon, response.main.temp, response.main.humidity, response.clouds.all)
}

//HTML mutator
function setupWeatherInfo(id, city, image, temp, humidity, clouds) {
    let bookmark = document.getElementById(`weather-info-${id}`).children;
    bookmark[0].innerHTML = city;
    bookmark[1].src = 'images/' + image + '.png';
    let stats = bookmark[2].children;
    stats[1].innerHTML = temp + '&#176'
    stats[3].innerHTML = humidity + '%';
    stats[5].innerHTML = clouds + '%';
}

function setResultVisibility(value) {
    document.getElementById('weather-info-4').style.visibility = value;
    document.getElementById('cookie-button-container').style.visibility = value;
}


//Cookies
function setCookie(name, isLeft) {
    var value = getCityByContainer(4)
    document.cookie = `${name}=${value}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`
    updateBookmarks(value, isLeft)
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

//Util
function getCityByContainer(index) {
    return document.getElementById(`weather-info-${index}`).children[0].innerHTML
}