var lastPrimaryBG = ''
var lastSecondaryBG = ''
var currMinute = (new Date() - new Date().setHours(0, 0, 0, 0)) / 60000;
var weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var inAction = false;

function init() {
    setupDynamicBackground()
}

//Interface 
function myAnim() {
    if (inAction) return;
    inAction = true;
    var elemCurr = document.getElementById("weather-info-1");
    var elemNext = document.getElementById("weather-info-2");
    var elemNext2 = document.getElementById("weather-info-3");
    var elemNext3 = document.getElementById("weather-info-4");
    var elemNextTitle = document.getElementById("day1");


    var tick = 0;
    var id = setInterval(frame, 17);

    function frame() {
        if (tick == 50) {
            elemCurr.style.opacity = 1;
            elemCurr.style.top = 150 + "px";

            elemNext.style.top = -225 + "px";
            elemNext.style.backgroundColor = "rgb(75, 20, 121)";
            elemNextTitle.style.top = -50 + "Px"

            elemNext2.style.top = -600 + "px";
            elemNext2.style.backgroundColor = "rgb(50, 20, 121)";

            elemNext3.style.top = -975 + "px";
            elemNext3.style.opacity = 0;
            elemNext3.style.backgroundColor = "rgb(25, 20, 121)";

            inAction = false;

            clearInterval(id);
        } else {
            tick++;
            elemCurr.style.top = (150 + 2 * tick) + "px";
            elemCurr.style.opacity = 1 - tick / 50

            elemNext.style.top = (-225 + tick) + "px";
            elemNext.style.backgroundColor = "rgb(" + (75 + tick / 2) + ", 20, 121)";
            elemNextTitle.style.top = (tick - 50) + "px"

            elemNext2.style.top = (-600 + tick) + "px";
            elemNext2.style.backgroundColor = "rgb(" + (50 + tick / 2) + ", 20, 121)";

            elemNext3.style.top = (-975 + tick) + "px";
            elemNext3.style.backgroundColor = "rgb(" + (25 + tick / 2) + ", 20, 121)";
            elemNext3.style.opacity = tick / 50;
        }
    }
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

//Weather API
async function requestCity(city, containerIndex, setInvis) {
    container = `weather-info-${containerIndex}`
    if (setInvis && !city) {
        setResultVisibility('hidden')
        return;
    }
    let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e7e7d5d2da4aee3dcb44529c9c69f31a`)

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


function getWeekdayFromToday(index) {
    return weekdays[new Date().getDay() + index];
}