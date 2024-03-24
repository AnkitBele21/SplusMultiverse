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
   window.location.href = `https://ankitbele21.github.io/SplusMultiverse/updateactiveframe?frameId=${frameId}&markOn=true&sheetName=${SHEET_NAME}&security=${SECURITY_KEY}`;

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
        window.location.href = `https://leaderboard.snookerplus.in/updateactiveframe.html?frameId=SPS${entry.rowNumber}&sheetName=${SHEET_NAME}&security=${SECURITY_KEY}`;

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

// Function to handle showing the off popup
function showOffPopup(rowNumber, playerName) {
  const playerListString = prompt(`To be paid by ${playerName}:`);

  if (playerListString) {
    console.log(
      `Marking frame at row ${rowNumber} as off. Paid by: ${playerName} and amount: ${playerListString}`
    );
    const url = "https://payment.snookerplus.in/update/frame/off/";

    const payload = {
      frameId: `SPS${rowNumber}`,
      players: playerListString.split(",").map((player) => player.trim()), // Ensure players are trimmed
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new
                    Error("Network response was not ok");
        }
        return resp.json();
      })
      .then((_body) => {
        alert("Frame turned off successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Failed to turn off the frame. Please try again.");
      });
  }
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
  // Fetch player names from the 'SnookerPlus' sheet
  fetchData("SnookerPlus").then((data) => {
    const nameDatalist = document.getElementById("playerNames");
    data.forEach((row) => {
      const optionElement = document.createElement("option");
      optionElement.value = row[2];
      nameDatalist.appendChild(optionElement);
    });
  });
}

// Perform operations after the window has loaded
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

  // Populate player names in the playerNames dropdown
  populatePlayerNames();
};
