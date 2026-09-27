/* ------------------------------
   CREATE CLOCK TICKS
------------------------------ */

const ticks = document.getElementById("ticks");

function createTicks() {

    ticks.innerHTML = "";
    const radius = ticks.clientWidth / 2 - 10;

    for (let i = 0; i < 60; i++) {

        const tick = document.createElement("div");

        tick.classList.add("tick");

        if (i % 5 === 0) {
            tick.classList.add("hour");
        }

        tick.style.transform =
            `rotate(${i * 6}deg) translateY(-${radius}px)`;

        ticks.appendChild(tick);
    }
}

createTicks();

window.addEventListener("resize", createTicks);


/* ------------------------------
   GET HTML ELEMENTS
------------------------------ */

const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const lapList = document.getElementById("lapList");
const lapCount = document.getElementById("lapCount");

const secondHand = document.getElementById("secondHand");
const clock = document.querySelector(".clock");


/* ------------------------------
   STOPWATCH VARIABLES
------------------------------ */

let startTime = 0;
let elapsedTime = 0;

let timer = null;

let lastLapTime = 0;
let lapNumber = 0;


/* ------------------------------
   FORMAT TIME
------------------------------ */

function formatTime(time) {

    const hours = Math.floor(time / 3600000);

    const minutes = Math.floor(
        (time % 3600000) / 60000
    );

    const seconds = Math.floor(
        (time % 60000) / 1000
    );

    const milliseconds = time % 1000;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(3, "0")
    );
}


/* ------------------------------
   UPDATE STOPWATCH
------------------------------ */

function updateStopwatch() {

    elapsedTime = Date.now() - startTime;

    display.textContent = formatTime(elapsedTime);

    updateClockHand();
}


/* ------------------------------
   UPDATE CLOCK HAND
------------------------------ */

function updateClockHand() {

    /*
       60 seconds = 360 degrees
       Therefore:
       1 second = 6 degrees
    */

    const seconds = (elapsedTime / 1000) % 60;

    const angle = seconds * 6;

    secondHand.style.transform =
        `rotate(${angle}deg)`;
}


/* ------------------------------
   START
------------------------------ */

function startStopwatch() {

    // Prevent multiple timers
    if (timer !== null) {
        return;
    }

    startTime = Date.now() - elapsedTime;

    timer = setInterval(updateStopwatch, 10);

    clock.classList.add("running");
}


/* ------------------------------
   PAUSE
------------------------------ */

function pauseStopwatch() {

    if (timer === null) {
        return;
    }

    clearInterval(timer);

    timer = null;

    // Save current time
    elapsedTime = Date.now() - startTime;

    updateStopwatch();

    clock.classList.remove("running");
}


/* ------------------------------
   LAP
------------------------------ */

function recordLap() {

    // Lap only works while stopwatch is running
    if (timer === null) {
        return;
    }

    const currentTime = elapsedTime;

    // Calculate time since previous lap
    const lapTime = currentTime - lastLapTime;

    lastLapTime = currentTime;

    lapNumber++;

    /* Remove "No laps" message */
    const emptyMessage =
        document.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    /* Create lap row */

    const row = document.createElement("div");

    row.classList.add("lap-row");

    row.innerHTML = `
        <div class="lap-number">
            ${lapNumber}
        </div>

        <div class="lap-name">
            Lap ${lapNumber}
        </div>

        <div class="lap-time">
            ${formatTime(lapTime)}
        </div>
    `;

    /*
       Newest lap should appear at top
    */

    lapList.prepend(row);

    lapCount.textContent =
        `Total Laps: ${lapNumber}`;
}


/* ------------------------------
   RESET
------------------------------ */

function resetStopwatch() {

    clearInterval(timer);

    timer = null;

    elapsedTime = 0;
    startTime = 0;

    lastLapTime = 0;
    lapNumber = 0;

    display.textContent = "00:00:00.000";

    secondHand.style.transform =
        "rotate(0deg)";

    clock.classList.remove("running");

    /* Clear laps */

    lapList.innerHTML = `
        <div class="empty-message">
            No laps recorded yet
        </div>
    `;

    lapCount.textContent =
        "Total Laps: 0";
}


/* ------------------------------
   BUTTON EVENTS
------------------------------ */

startBtn.addEventListener(
    "click",
    startStopwatch
);

pauseBtn.addEventListener(
    "click",
    pauseStopwatch
);

lapBtn.addEventListener(
    "click",
    recordLap
);

resetBtn.addEventListener(
    "click",
    resetStopwatch
);