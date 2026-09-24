let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

let lapNumber = 0;

const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const millisecondsElement = document.getElementById("milliseconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const statusText = document.getElementById("status-text");
const statusDot = document.getElementById("status-dot");
const timerRing = document.querySelector(".timer-ring");

const lapContainer = document.getElementById("lapContainer");
const lapCount = document.getElementById("lapCount");
const emptyState = document.getElementById("emptyState");


function formatTime(time) {

    let milliseconds = Math.floor((time % 1000) / 10);

    let totalSeconds = Math.floor(time / 1000);

    let seconds = totalSeconds % 60;

    let totalMinutes = Math.floor(totalSeconds / 60);

    let minutes = totalMinutes % 60;

    let hours = Math.floor(totalMinutes / 60);

    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        milliseconds: String(milliseconds).padStart(2, "0")
    };
}


function updateDisplay() {

    const time = formatTime(elapsedTime);

    hoursElement.textContent = time.hours;
    minutesElement.textContent = time.minutes;
    secondsElement.textContent = time.seconds;
    millisecondsElement.textContent = time.milliseconds;
}


function updateTimer() {

    elapsedTime = Date.now() - startTime;

    updateDisplay();
}


function startStopwatch() {

    if (isRunning) {
        return;
    }

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(updateTimer, 10);

    isRunning = true;

    statusText.textContent = "RUNNING";
    statusDot.classList.add("running");
    statusDot.classList.remove("paused");

    timerRing.classList.add("running");

    startBtn.disabled = true;
}


function pauseStopwatch() {

    if (!isRunning) {
        return;
    }

    clearInterval(timerInterval);

    elapsedTime = Date.now() - startTime;

    isRunning = false;

    statusText.textContent = "PAUSED";
    statusDot.classList.remove("running");
    statusDot.classList.add("paused");

    timerRing.classList.remove("running");

    startBtn.disabled = false;

    updateDisplay();
}


function resetStopwatch() {

    clearInterval(timerInterval);

    timerInterval = null;
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapNumber = 0;

    updateDisplay();

    statusText.textContent = "READY TO BEGIN";

    statusDot.classList.remove("running");
    statusDot.classList.remove("paused");

    timerRing.classList.remove("running");

    startBtn.disabled = false;

    lapContainer.innerHTML = "";

    lapContainer.appendChild(emptyState);

    emptyState.style.display = "block";

    lapCount.textContent = "0 LAPS";
}


function recordLap() {

    if (!isRunning) {
        return;
    }

    lapNumber++;

    const time = formatTime(elapsedTime);

    const row = document.createElement("div");

    row.className = "lap-row";

    row.innerHTML = `
        <span class="lap-number">
            ${String(lapNumber).padStart(2, "0")}
        </span>

        <span class="lap-label">
            LAP ${String(lapNumber).padStart(2, "0")}
        </span>

        <span class="lap-time">
            ${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}
        </span>
    `;

    if (emptyState.parentElement === lapContainer) {
        emptyState.remove();
    }

    lapContainer.prepend(row);

    lapCount.textContent =
        `${lapNumber} ${lapNumber === 1 ? "LAP" : "LAPS"}`;
}


startBtn.addEventListener("click", startStopwatch);

pauseBtn.addEventListener("click", pauseStopwatch);

lapBtn.addEventListener("click", recordLap);

resetBtn.addEventListener("click", resetStopwatch);

updateDisplay();