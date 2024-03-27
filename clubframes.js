const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
let frameGlobalData = []; // Global variable to store frame data
const loaderInstance = new FullScreenLoader(); // Assuming FullScreenLoader is defined elsewhere

// Function to fetch data based on the provided sheet name
async function fetchData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values.slice(1); // Exclude header row
}

function markFrameOn() {
    let frameId = 1;
    if (frameGlobalData.length > 0) {
        frameId += parseInt(frameGlobalData[0].rowNumber);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const securityKey = urlParams.get('security');
    const studio = urlParams.get('studio');
    window.location.href =
      `https://ankitbele21.github.io/SplusMultiverse/updateactiveframe?frameId=${frameId}&markOn=true&security=${securityKey}&studio=${studio}`;
}

// Function to display frame entries on the webpage
function displayFrameEntries(frameEntries) {
  const frameEntriesContainer = document.getElementById("frameEntries");
  frameEntriesContainer.innerHTML = ""; // Clear previous entries

  frameEntries.forEach((entry) => {
    const frameElement = document.createElement("div");
    frameElement.className = entry.isActive ? "frame-card active-frame" : "frame-card";

    // Include Frame ID
    const frameIdElement = document.createElement("p");
    frameIdElement.innerText = `Frame ID: SPS${entry.rowNumber}`;
    frameIdElement.style.fontSize = "small"; // Making the font size small
    frameElement.appendChild(frameIdElement);

    // Display frame details
    const dateElement = document.createElement("h5");
    dateElement.innerText = `Date: ${entry.date}`;
    frameElement.appendChild(dateElement);

    const tableNoElement = document.createElement("p");
    tableNoElement.innerText = `Table No: ${entry.tableNo || "N/A"}`;
    frameElement.appendChild(tableNoElement);

    if (!entry.isActive) {
      const durationElement = document.createElement("p");
      durationElement.innerText = `Duration: ${entry.duration} min`;
      frameElement.appendChild(durationElement);

      const tableMoneyElement = document.createElement("p");
      tableMoneyElement.innerText = `Table Money: ${entry.tableMoney}`;
      frameElement.appendChild(tableMoneyElement);
    }

    const startTimeElement = document.createElement("p");
    startTimeElement.innerText = `Start Time: ${entry.startTime}`;
    frameElement.appendChild(startTimeElement);

    const playersElement = document.createElement("p");
    playersElement.innerText = `Players: ${entry.playerNames.filter((name) => name).join(", ")}`;
    frameElement.appendChild(playersElement);

    const paidByElement = document.createElement("p");
    paidByElement.innerText = `Paid by: ${entry.paidByNames.filter((name) => name).join(", ") || "N/A"}`;
    frameElement.appendChild(paidByElement);

    // Display status and buttons for active frames
    if (entry.isActive) {
      const statusElement = document.createElement("p");
      statusElement.innerText = `Status: ${entry.offStatus ? entry.offStatus : "Active"}`;
      statusElement.style.color = entry.offStatus ? "red" : "green"; // Red for "Off", green for "Active"
      frameElement.appendChild(statusElement);

     // Edit Button
const editButton = document.createElement("button");
editButton.innerText = "Edit";
editButton.className = "btn btn-primary edit-btn";
editButton.onclick = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const securityKey = urlParams.get('security');
    const studio = urlParams.get('studio');
    window.location.href = `https://ankitbele21.github.io/SplusMultiverse/updateactiveframe.html?frameId=SPS${entry.rowNumber}&security=${securityKey}&studio=${studio}`;
};
frameElement.appendChild(editButton);
      // Off Button
      const offButton = document.createElement("button");
      offButton.innerText = "Off";
      offButton.className = "btn btn-danger off-btn";
      offButton.addEventListener("click", () =>
        showOffPopup(entry.rowNumber, entry.playerNames)
      );
      frameElement.appendChild(offButton);
    }

    frameEntriesContainer.appendChild(frameElement);
  });
}

function showOffPopup(rowNumber, playerNames) {
  // Create overlay div
  const overlay = document.createElement("div");
  overlay.id = "offFormOverlay";
  overlay.classList.add("overlay");
  
  // Create content div
  const content = document.createElement("div");
  content.className = "overlay-content";
  
  // Create form
  const form = document.createElement("form");
  form.id = "offForm";
  
  // Create buttons for each player
  playerNames.slice(0, 6).forEach((playerName) => { // Limit to 6 players
    const playerButton = document.createElement("button");
    playerButton.type = "button";
    playerButton.className = "player-button";
    playerButton.innerText = playerName;
    playerButton.onclick = function() {
      // Append player name to the input field
      const paymentDetails = document.getElementById("paymentDetails");
      paymentDetails.value += `${playerName}, `;
    };
    
    form.appendChild(playerButton);
  });
  
  // Create input field for payment details
  const paymentDetailsInput = document.createElement("input");
  paymentDetailsInput.type = "text";
  paymentDetailsInput.id = "paymentDetails";
  paymentDetailsInput.name = "paymentDetails";
  paymentDetailsInput.placeholder = "To be Paid By...";
  
  // Append input field to the form
  form.appendChild(paymentDetailsInput);
  
  // Create submit and cancel buttons
  const submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Confirm";
  
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.innerText = "Cancel";
  cancelButton.onclick = function() {
    overlay.style.display = "none"; // Hide overlay on cancel
  };
  
  // Append buttons to the form
  form.appendChild(submitButton);
  form.appendChild(cancelButton);
  
  // Append form to the content
  content.appendChild(form);
  
  // Append content to the overlay
  overlay.appendChild(content);
  
  // Append overlay to the document body
  document.body.appendChild(overlay);
  
  // Show overlay
  overlay.style.display = "block";
  
  // Submit form handler
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    const paymentDetails = document.getElementById("paymentDetails").value;
    console.log(`Frame at row ${rowNumber} marked as off. Payment details: ${paymentDetails}`);
    // You can perform further actions here, such as sending data to the server
    overlay.style.display = "none"; // Hide overlay after submission
    form.reset(); // Reset form fields
  });

  // Clicking outside the form will also close the overlay
  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
      overlay.style.display = 'none';
    }
  });
}


// Function to apply filters to frame entries
function applyFilters() {
  const playerNameFilter = document.getElementById("playerNameFilter").value.toLowerCase();
  let dateFilter = document.getElementById("dateFilter").value;

  if (dateFilter) {
    const [year, month, day] = dateFilter.split("-");
    dateFilter = `${day}/${month}/${year}`;
  }
  const showActiveFrames = document.getElementById("activeFramesFilter").checked;
  
  // Extract studio name and security key from URL
  const urlParams = new URLSearchParams(window.location.search);
  const studioName = urlParams.get('studio');

  // Fetch data based on studio name
  fetchData(studioName).then((data) => {
    let frameEntries = data
      .map((row, index) => ({
        rowNumber: index + 2, // Correctly scoped index
        date: row[2],
        duration: row[3],
        startTime: row[10],
        tableMoney: row[20],
        tableNo: row[7],
        playerNames: row.slice(12, 18),
        paidByNames: row.slice(23, 29),
        isValid: row[6],
        isActive: row[6] && !row[8],
        offStatus: row[8],
      }))
      .filter((entry) => entry.isValid)
      .reverse();

    if (showActiveFrames) {
      frameEntries = frameEntries.filter((entry) => entry.isActive);
    }

    if (playerNameFilter) {
      frameEntries = frameEntries.filter((entry) =>
        entry.playerNames.some((name) =>
          name.toLowerCase().includes(playerNameFilter)
        )
      );
    }

    if (dateFilter) {
      frameEntries = frameEntries.filter((entry) => entry.date === dateFilter);
    }

    // Display the filtered frame entries
    displayFrameEntries(frameEntries);
  });
}


// Function to populate player names in the playerNames dropdown
function populatePlayerNames() {
  // Extract studio name from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const studioName = urlParams.get('studio');

  // Fetch player names from the 'SnookerPlus' sheet
  fetchData("SnookerPlus").then((data) => {
    const nameDatalist = document.getElementById("playerNames");
    data.forEach((row) => {
      // Check if studio value exists, is not null, and is a string
      if (typeof row[9] === "string" && row[9].trim() !== "") {
        // Split Studios in column J by commas and trim each value
        const studios = row[9].split(',').map(studio => studio.trim());
        // Check if the studio value from the URL is included in the array of studios associated with the player
        if (studios.includes(studioName)) {
          const optionElement = document.createElement("option");
          optionElement.value = row[2];
          nameDatalist.appendChild(optionElement);
        }
      }
    });
  });
}



document.addEventListener('DOMContentLoaded', function() {
  // Fetch player data
  populatePlayerNames();

  // Add event listener to the "Add Players" button
  const addPlayersButton = document.getElementById("addPlayersButton");
  if (addPlayersButton) {
    addPlayersButton.addEventListener("click", function () {
      const urlParams = new URLSearchParams(window.location.search);
      const securityKey = urlParams.get('security');
      const studio = urlParams.get('studio');
      window.location.href = `https://ankitbele21.github.io/SplusMultiverse/clubplayers?security=${securityKey}&studio=${studio}`;
    });
  }
});

// Perform initial operations after the window has loaded
window.onload = function () {
  // Extract studio name and security key from URL
  const urlParams = new URLSearchParams(window.location.search);
  const studioName = urlParams.get('studio');

  // Fetch frame entries based on the studio name
  fetchData(studioName).then((data) => {
    const frameEntries = data
      .map((row, index) => ({
        rowNumber: index + 2, // Correctly scoped index
        date: row[2],
        duration: row[3],
        startTime: row[10],
        tableMoney: row[20],
        tableNo: row[7],
        playerNames: row.slice(12, 18),
        paidByNames: row.slice(23, 29),
        offStatus: row[8],
        isValid: row[6],
        isActive: row[6] && !row[8],
      }))
      .filter((entry) => entry.isValid)
      .reverse();

    // Store frame entries globally for later use
    frameGlobalData = frameEntries;

    // Display the frame entries
    displayFrameEntries(frameEntries);
  });
};
