const city = "Tunis";
const country = "Tunisia";

let prayerTimes = {};

async function fetchPrayerTimes() {
  const res = await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`
  );
  const data = await res.json();
  prayerTimes = data.data.timings;

  displayPrayerTimes();
}

function displayPrayerTimes() {
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  prayers.forEach((prayer) => {
    document.querySelector(`#${prayer} span`).textContent =
      prayerTimes[prayer];
  });
}

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString();

  document.getElementById("date").textContent =
    now.toDateString();

  highlightNextPrayer(now);
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":");
  return parseInt(h) * 60 + parseInt(m);
}

function highlightNextPrayer(now) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  let next = null;

  prayers.forEach((prayer) => {
    const prayerMin = timeToMinutes(prayerTimes[prayer]);

    const element = document.getElementById(prayer);
    element.classList.remove("active");

    if (prayerMin > currentMinutes && !next) {
      next = prayer;
    }
  });

  if (!next) next = "Fajr";

  document.getElementById("next-prayer").textContent =
    "Next Prayer: " + next;

  document.getElementById(next).classList.add("active");
}

fetchPrayerTimes();
setInterval(updateClock, 1000);

// Refresh prayer times every 12 hours
setInterval(fetchPrayerTimes, 12 * 60 * 60 * 1000);