const API_KEY = "AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc";
const SHEET_ID = "1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss";
const SHEET_NAME = "Frames";

const loaderInstance = new FullScreenLoader();

document.addEventListener("DOMContentLoaded", function () {
  const frameId = getFrameIdFromURL();
  if (frameId) {
    fetchFrameData(frameId);
  }
});

function getFrameIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("frameId");
}

async function fetchFrameData(frameId) {
  const rowNumber = frameId.replace("SPS", "");
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:Z${rowNumber}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.values && data.values.length > 0) {
      const rowData = data.values[0];
      prefillForm(rowData, frameId);
    } else {
      console.error("No data found for the given frame ID.");
    }
  } catch (error) {
    console.error("Error fetching frame data:", error);
  }
}

function prefillForm(rowData, frameId) {
  const tableNo = rowData[7];
  const startTime = rowData[10];
  const players = rowData.slice(12, 18).filter(Boolean); // Extract players without joining

  document.getElementById("frameNo").textContent = frameId;
  document.getElementById("tableNo").value = tableNo || "";
  document.getElementById("startTime").value = startTime || "";

  const playersContainer = document.getElementById("playersContainer");
  playersContainer.innerHTML = ""; // Clear previous player inputs

  // Create input fields for each player
  players.forEach((player, index) => {
    const playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.value = player || ""; // Set player name if available
    playerInput.placeholder = `Player ${index + 1}`;
    playersContainer.appendChild(playerInput);
  });

  // Populate player name suggestions
  populatePlayerNames();
}

document
  .getElementById("updateFrameForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    await updateFrameData();
  });

async function updateFrameData() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const markOn = urlParams.get("markOn");

    let url = "https://payment.snookerplus.in/update/frame/";
    if (markOn) {
      url = "https://payment.snookerplus.in/update/frame/on/";
    }

    const frameId = document.getElementById("frameNo").textContent;
    const tableNo = document.getElementById("tableNo").value;
    const startTime = document.getElementById("startTime").value;
    const players = Array.from(document.querySelectorAll("#playersContainer input")).map(input => input.value.trim()).filter(Boolean).join(", ");

    const payload = {
      frameId: frameId,
      tableNo: tableNo,
      startTime: startTime,
      players: players.split(",").map((player) => player.trim()), // Ensure players are trimmed
    };

    try {
      loaderInstance.showLoader();

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((resp) => {
          loaderInstance.hideLoader();
          if (!resp.ok) {
            throw new Error("Network response was not ok");
          }
          return resp.json();
        })
        .then((_body) => {
          alert("Frame updated successfully!");
          window.location.href =
            "https://leaderboard.snookerplus.in/clubframes"; // Redirect back to the frames page
        });
    } catch (error) {
      loaderInstance.hideLoader();
      console.error("Fetch error:", error);
      alert("Failed to update the frame. Please try again.");
    }
  } catch (error) {
    console.error("Error updating frame:", error);
    alert(
      "An error occurred while updating the frame. Please try again later."
    );
  }
}

async function fetchData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values.slice(1);
}

// Listen for input changes in the players field and populate player names
document.getElementById("playersContainer").addEventListener("input", function () {
  populatePlayerNames();
});

function populatePlayerNames() {
  const nameDatalist = document.getElementById("playerNames");
  const playersInputs = document.querySelectorAll(".player-input");

  if (!nameDatalist) {
    console.error("Element with ID 'playerNames' not found in the document.");
    return;
  }

  // Clear existing options
  nameDatalist.innerHTML = "";

  // Fetch data from the spreadsheet
  fetchData("snookerplus").then((data) => {
    const existingOptions = new Set(Array.from(nameDatalist.childNodes)
      .filter(node => node.tagName === 'OPTION')
      .map(option => option.value));

    // Add existing options to the datalist
    existingOptions.forEach((optionValue) => {
      const optionElement = document.createElement("option");
      optionElement.value = optionValue;
      nameDatalist.appendChild(optionElement);
    });

    // Get the list of player names from the input fields
    playersInputs.forEach((input) => {
      const playerName = input.value.trim();
      // Check if the name is not empty and not already in the datalist, then add it
      if (playerName !== "" && !existingOptions.has(playerName)) {
        const optionElement = document.createElement("option");
        optionElement.value = playerName;
        nameDatalist.appendChild(optionElement);
        existingOptions.add(playerName);
      }
    });
  });
}
