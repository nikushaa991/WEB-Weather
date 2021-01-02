function init() {

    document.getElementById('timeSlider').oninput = function() {
        var val = this.value;
        var primaryBG = 'dusk'
        var secondaryBG = 'night';

        switch (true) {
            case (val < 250):
                primaryBG = 'dusk';
                secondaryBG = 'night';
                break;
            case (val < 500):
                primaryBG = 'day';
                secondaryBG = 'dusk';
                break;
            case (val < 750):
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
        primary.style.opacity = 1 / 250 * (val % 250);
        primary.style.backgroundPosition = 'center';

        secondary.style.background = `url('images/${secondaryBG}.png')`;
        secondary.style.backgroundPosition = 'center';


    }
}
