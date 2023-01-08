
var dltCurrentThemeDark = true;
var dltIsDark = true;

function setButton() {
    var button = document.getElementById('dlt-button');
    let emoji = dltIsDark ? '🌙' : '☀️';
    button.innerHTML = emoji;
}


function setMode() {
    //setButton();

    if (dltCurrentThemeDark === dltIsDark) {
        return;
    }

    dltCurrentThemeDark = dltIsDark;

    document.body.classList.toggle("light-theme");
}

function toggleMode() {
    dltIsDark = !dltIsDark;
    // set local storage
    localStorage.setItem('dltIsDark', dltIsDark);

    setMode();
}

function userModeToggle() {
    toggleMode();
    localStorage.setItem('dltUserPref', "true");
}

function initMode() {
    let dltUserPref = localStorage.getItem('dltUserPref') === 'true' ? true : false;
    if (dltUserPref) {
        dltIsDark = localStorage.getItem('dltIsDark') === 'true' ? true : false;
    } else {
        dltIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setMode();
}

initMode();



module.exports = { userModeToggle }

