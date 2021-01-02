function init() {

    document.getElementById('timeSlider').oninput = function() {
        var val = this.value;
        var primaryBG = 'day';
        var secondaryBG = 'day';

        switch (true) {
            case (val < 6):
                primaryBG = 'dusk';
                secondaryBG = 'night';
                break;
            case (val < 12):
                primaryBG = 'day';
                secondaryBG = 'dusk';
                break;
            case (val < 18):
                primaryBG = 'dusk';
                secondaryBG = 'day';
                break;
            default:
                primaryBG = 'night';
                secondaryBG = 'dusk';
        }
        let primary = document.getElementById("background-primary");
        let secondary = document.body;

        primary.style.background = `url('images/${primaryBG}.png')`;
        primary.style.opacity = 1 / 6 * (val % 6);
        primary.style.backgroundPosition = 'center';

        secondary.style.background = `url('images/${secondaryBG}.png')`;
        secondary.style.backgroundPosition = 'center';


    }
}