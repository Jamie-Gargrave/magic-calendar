// Load days
fetch("partials/days.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("calendar-days").innerHTML = data;
  });

// Load modals
fetch("partials/modals.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("modals-container").innerHTML = data;
  });
