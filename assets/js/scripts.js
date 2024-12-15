let isMuted = false;

// Function to toggle mute state
function toggleMute() {
  isMuted = !isMuted;
  console.log(`Mute toggled: ${isMuted}`); // Debugging log

  const muteButton = document.getElementById('mute-button');
  if (muteButton) {
    muteButton.innerHTML = isMuted
      ? '<i class="fa-solid fa-volume-xmark fa-lg"></i>'
      : '<i class="fa-solid fa-volume-high fa-lg"></i>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Attach toggleMute to the mute button
  const muteButton = document.getElementById('mute-button');
  if (muteButton) {
    muteButton.addEventListener('click', toggleMute);
  }

  // Initialize the calendar
  await initialize();

  // Load instructions modal
  await loadInstructionsModal();
});

// Function to load the instructions modal content
async function loadInstructionsModal() {
  const response = await fetch('partials/instructions.html');
  const data = await response.text();
  const instructionsModalContainer = document.getElementById(
    'instructions-modal-container',
  );
  if (instructionsModalContainer) {
    instructionsModalContainer.innerHTML = data;
  }
}

// Function to load the days content into the calendar
async function loadDays() {
  const response = await fetch('partials/days.html');
  const data = await response.text();
  const calendarDaysElement = document.getElementById('calendar-days');
  if (calendarDaysElement) {
    calendarDaysElement.innerHTML = data;

    // Load the bell sound
    const bellSound = new Audio('assets/sound/bell.mp3');

    // Select all day elements
    const dayElements = document.querySelectorAll('.calendar-day');

    dayElements.forEach((dayElement, index) => {
      const dayNumber = index + 1; // Adjust index to start from 1

      if (!dayNumber) {
        // Make days 19 to 23 unclickable
        dayElement.removeAttribute('data-bs-toggle'); // Remove modal toggle attribute
        dayElement.removeAttribute('data-bs-target'); // Remove modal target attribute
        dayElement.style.cursor = 'not-allowed'; // Change cursor to indicate it's not clickable
        dayElement.classList.add('disabled'); // Add a disabled class
      } else {
        // Ensure other days are clickable
        dayElement.setAttribute('data-bs-toggle', 'modal');
        dayElement.setAttribute('data-bs-target', `#day${dayNumber}`);
        dayElement.style.cursor = 'pointer'; // Reset cursor to pointer
        dayElement.classList.remove('disabled'); // Remove disabled class

        // Add click event to play the bell sound
        dayElement.addEventListener('click', () => {
          if (!isMuted) {
            // Play the sound only if not muted
            bellSound.currentTime = 0; // Reset sound to the beginning
            bellSound.play(); // Play the bell sound
          }
        });
      }

      // Tooltip logic
      const tooltipWrapper = dayElement.querySelector('.tooltip-wrapper');
      const isMobile = window.matchMedia('(max-width: 768px)');
      if (tooltipWrapper && !isMobile.matches) {
        tooltipWrapper.setAttribute('data-bs-toggle', 'tooltip');
        tooltipWrapper.setAttribute('data-bs-placement', 'top');
        tooltipWrapper.setAttribute('title', `Day ${dayNumber}`);
      }
    });

    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

// Function to enable the days up to the current day
function enableCurrentDays() {
  const currentDay = getCurrentDay();
  for (let i = 1; i <= currentDay; i++) {
    const dayElement = document.querySelector(`[data-bs-target="#day${i}"]`);
    if (dayElement) {
      dayElement.classList.remove('disabled');
      dayElement.style.cursor = 'pointer'; // Reset cursor to pointer
      if (i === currentDay) {
        dayElement.classList.add('highlight-current-day'); // Add class for animation
      }
    }
  }
}

// Function to get the current day
function getCurrentDay() {
  const today = new Date();
  return today.getDate();
}

// Function to load the modals content
async function loadModals() {
  const response = await fetch('partials/modals.html');
  const data = await response.text();
  const modalsContainerElement = document.getElementById('modals-container');
  if (modalsContainerElement) {
    modalsContainerElement.innerHTML = data;
  }

  // Load modal contents for each day
  for (let i = 1; i <= 31; i++) {
    const dayResponse = await fetch(`partials/day-content/day${i}.html`);
    const content = await dayResponse.text();
    const dayContentElement = document.getElementById(`day${i}Content`);
    if (dayContentElement) {
      dayContentElement.innerHTML = content;
    }
  }
}

function setupReadMoreButtons() {
  const readMoreButtons = document.querySelectorAll('.read_more');

  readMoreButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const collapseTarget = this.getAttribute('data-bs-target');
      const collapseElement = document.querySelector(collapseTarget);

      if (collapseElement) {
        collapseElement.addEventListener('shown.bs.collapse', () => {
          this.textContent = 'Read less';
        });

        collapseElement.addEventListener('hidden.bs.collapse', () => {
          this.textContent = 'Read more';
        });
      }

      // Toggle button text immediately on click
      this.textContent =
        this.textContent === 'Read more' ? 'Read less' : 'Read more';
    });
  });
}

// Function to initialize the calendar by loading days and modals
async function initialize() {
  await loadDays();
  enableCurrentDays();
  await loadModals();
  setupReadMoreButtons();
}

initialize();
