const API_KEY = "AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc";
const SHEET_ID = "1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss";


// UNSAFE
let frameGlobalData = [];
const loaderInstance = new FullScreenLoader();

async function fetchData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values.slice(1);
}
function markFrameOn() {
    let frameId = 1;
    if (frameGlobalData.length > 0) {
        frameId += parseInt(frameGlobalData[0].rowNumber);
    }
    window.location.href =
      `https://leaderboard.snookerplus.in/updateactiveframe?frameId=${frameId}&markOn=true`;
}
function displayFrameEntries(frameEntries) {
  const frameEntriesContainer = document.getElementById("frameEntries");
  frameEntriesContainer.innerHTML = "";

  frameEntries.forEach((entry, index) => {
    const frameElement = document.createElement("div");
    frameElement.className = entry.isActive
      ? "frame-card active-frame"
      : "frame-card";

    // Include Frame ID
    const frameIdElement = document.createElement("p");
    frameIdElement.innerText = `Frame ID: SPS${entry.rowNumber}`;
    frameIdElement.style.fontSize = "small"; // Making the font size small
    frameElement.appendChild(frameIdElement);

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
    }

    const startTimeElement = document.createElement("p");
    startTimeElement.innerText = `Start Time: ${entry.startTime}`;
    frameElement.appendChild(startTimeElement);

    if (!entry.isActive) {
      const tableMoneyElement = document.createElement("p");
      tableMoneyElement.innerText = `Table Money: ${entry.tableMoney}`;
      frameElement.appendChild(tableMoneyElement);
    }

    const playersElement = document.createElement("p");
    playersElement.innerText = `Players: ${entry.playerNames
      .filter((name) => name)
      .join(", ")}`;
    frameElement.appendChild(playersElement);

    const paidByElement = document.createElement("p");
    paidByElement.innerText = `Paid by: ${
      entry.paidByNames.filter((name) => name).join(", ") || "N/A"
    }`;
    frameElement.appendChild(paidByElement);

    // Status for active frames
    if (entry.isActive) {
      const statusElement = document.createElement("p");
      statusElement.innerText = `Status: ${
        entry.offStatus ? entry.offStatus : "Active"
      }`;
      statusElement.style.color = entry.offStatus ? "red" : "green"; // Red for "Off", green for "Active"
      frameElement.appendChild(statusElement);
    }

    // Edit Button for active frames
    if (entry.isActive) {
      const editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.className = "btn btn-primary edit-btn";
      editButton.onclick = function () {
        window.location.href = `https://leaderboard.snookerplus.in/updateactiveframe.html?frameId=SPS${entry.rowNumber}`;
      };
      frameElement.appendChild(editButton);

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
  // Create the popup container
  const popupContainer = document.createElement("div");
  popupContainer.id = "offPopup";
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.padding = "20px";
  popupContainer.style.zIndex = "1000";
  popupContainer.style.borderRadius = "10px";
  popupContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";

  // Heading
  const heading = document.createElement("h3");
  heading.innerText = "Select Players to Pay";
  popupContainer.appendChild(heading);

  // Input for selected players
  const selectedPlayersInput = document.createElement("input");
  selectedPlayersInput.type = "text";
  selectedPlayersInput.id = "selectedPlayers";
  selectedPlayersInput.style.marginBottom = "10px";
  selectedPlayersInput.style.display = "block";
  selectedPlayersInput.style.width = "100%";
  popupContainer.appendChild(selectedPlayersInput);

  // Function to add player name to input
  function addToSelectedPlayers(name) {
    const input = document.getElementById("selectedPlayers");
    input.value = input.value ? `${input.value}, ${name}` : name;
  }

  // Generate list of players with "+" buttons
  playerNames.forEach(name => {
    const playerEntry = document.createElement("div");
    const playerName = document.createElement("span");
    playerName.innerText = name;

    const addButton = document.createElement("button");
    addButton.innerText = "+";
    addButton.onclick = () => addToSelectedPlayers(name);
    addButton.style.marginLeft = "10px";

    playerEntry.appendChild(playerName);
    playerEntry.appendChild(addButton);

    popupContainer.appendChild(playerEntry);
  });

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.onclick = () => {
    const selectedPlayers = document.getElementById("selectedPlayers").value;
    // Close popup
    document.body.removeChild(popupContainer);
    // Continue with existing off functionality using selectedPlayers
    processOffFrame(rowNumber, selectedPlayers);
  };
  popupContainer.appendChild(submitButton);

  // Append the popup to the body
  document.body.appendChild(popupContainer);
}

// This function encapsulates the existing logic to mark a frame as "off", now with the added players parameter
function processOffFrame(rowNumber, playerListString) {
  if (playerListString) {
    console.log(`Marking frame at row ${rowNumber} as off. Paid by: ${playerListString}`);
    const url = "https://payment.snookerplus.in/update/frame/off/";

    const payload = {
      frameId: `SPS${rowNumber}`,
      players: playerListString.split(",").map(player => player.trim()),
    };

    loaderInstance.showLoader();
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(resp => {
        loaderInstance.hideLoader();
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then(_body => {
        alert("Frame turned off successfully!");
        window.location.reload();
      })
      .catch(error => {
        loaderInstance.hideLoader();
        console.error("Fetch error:", error);
        alert("Failed to turn off the frame. Please try again.");
      });
  }
}


function applyFilters() {
  const playerNameFilter = document
    .getElementById("playerNameFilter")
    .value.toLowerCase();
  let dateFilter = document.getElementById("dateFilter").value;

  if (dateFilter) {
    const [year, month, day] = dateFilter.split("-");
    dateFilter = `${day}/${month}/${year}`;
  }

  fetchData("Frames").then((data) => {
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

    displayFrameEntries(frameEntries);
  });
}

function populatePlayerNames() {
  fetchData("SnookerPlus").then((data) => {
    const nameDatalist = document.getElementById("playerNames");
    data.forEach((row) => {
      const optionElement = document.createElement("option");
      optionElement.value = row[2];
      nameDatalist.appendChild(optionElement);
    });
  });
}

window.onload = function () {
  fetchData("Frames").then((data) => {
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
    frameGlobalData = frameEntries
    displayFrameEntries(frameEntries);
  });

  populatePlayerNames();
};
