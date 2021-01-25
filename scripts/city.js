const weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
const mainOffset = 150;
const elemHeight = 375;
const elemBaseColorR = 25;
const offsetTitle = -50;
const ticks = 50;


var lastPrimaryBG = ''
var lastSecondaryBG = ''
var currMinute = (new Date() - new Date().setHours(0, 0, 0, 0)) / 60000;
var inAction = true;
var weatherStats = {};
var cycle = 0;

function init() {
    setupDynamicBackground();
    city = window.location.search.substr(6);
    setCity(city);
    getCoords(city);
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

//Geolocation API
async function getCoords(city) {

    let requestURL = `https://us1.locationiq.com/v1/search.php?key=pk.399a766757ab17aaea7de3bcf507aeb1&q=${city}&format=json`

    let response = await fetch(requestURL)

    if (response.ok) {
        let json = await response.json();
        lat = json[0].lat;
        lon = json[0].lon;
        setupWeather(lat, lon)
    }
}

//Weather API
async function setupWeather(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=e7e7d5d2da4aee3dcb44529c9c69f31a&units=metric`)
    if (response.ok) {
        let json = await response.json();
        handleResponse(json)
    }
}

function handleResponse(response) {
    weatherStats = response.daily;
    update();
    inAction = false;
}

//Update info
function update() {
    for (idx = 1; idx < 5; idx++) {
        day = (cycle + idx - 1) % 7;
        currInfo = weatherStats[day]
        icon = getIcon(currInfo.weather[0].id)
        setupWeatherInfo(idx, day, icon, currInfo.temp.day, currInfo.humidity, currInfo.clouds)
    }
    cycle++;
}

//HTML mutator
function setupWeatherInfo(id, day, image, temp, humidity, clouds) {
    let main = document.getElementById(`weather-info-${id}`).children;
    main[0].src = 'images/' + image + '.png';
    let stats = main[1].children;
    stats[0].innerHTML = getWeekdayFromToday(day)
    stats[2].innerHTML = temp + '&#176C'
    stats[4].innerHTML = humidity + '%';
    stats[6].innerHTML = clouds + '%';
}

function setCity(city) {
    document.getElementById('city-name').innerHTML = city;
}
//Animation 
function myAnim() {
    if (inAction) return;
    inAction = true;
    var elemCurr = document.getElementById("weather-info-1");
    var elemNext1 = document.getElementById("weather-info-2");
    var elemNext2 = document.getElementById("weather-info-3");
    var elemNext3 = document.getElementById("weather-info-4");
    var elemNextTitle = document.getElementById("day1");


    var tick = 0;
    var id = setInterval(frame, 12);

    function frame() {
        if (tick == ticks) {
            mutateElem(elemCurr, 0, 0, 1);
            elemCurr.style.opacity = 1;

            mutateElem(elemNext1, 1, 0, 1);
            elemNextTitle.style.top = getIntPx(offsetTitle)

            mutateElem(elemNext2, 2, 0, 1);

            mutateElem(elemNext3, 3, 0, 1);
            elemNext3.style.opacity = 0;

            inAction = false;
            clearInterval(id);
            update();
        } else {
            tick++;
            mutateElem(elemCurr, 0, tick, 2);
            elemCurr.style.opacity = 1 - tick / ticks;
            1

            mutateElem(elemNext1, 1, tick, 1);
            elemNextTitle.style.top = getIntPx(tick + offsetTitle)

            mutateElem(elemNext2, 2, tick, 1);

            mutateElem(elemNext3, 3, tick, 1);
            elemNext3.style.opacity = tick / ticks;
        }
    }
}


//Utils
function mutateElem(elem, elemIndex, tick, spd) {
    elem.style.top = getIntPx((mainOffset - elemIndex * elemHeight) + tick * spd)
    elem.style.backgroundColor = getColorStr(elemBaseColorR * (4 - elemIndex) + tick / 2);
}

function getColorStr(R) {
    return "rgb(" + R + ", 20, 121)";
}

function getIntPx(val) {
    return val + "px";
}

function getWeekdayFromToday(index) {
    return weekdays[(new Date().getDay() + index) % 7];
}

function getIcon(id) {
    var icon = "sun"
    switch (String(id).charAt(0)) {
        case '2':
        case '3':
        case '5':
            icon = "rain"
            break;
        case '6':
            icon = "snow";
    }
    return icon;
}