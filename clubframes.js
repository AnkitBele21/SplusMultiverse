
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";


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
  window.location.href = `https://leaderboard.snookerplus.in/updateactiveframe?frameId=${frameId}&markOn=true`;
}

function displayFrameEntries(frameEntries) {
  const frameEntriesContainer = document.getElementById("frameEntries");
  frameEntriesContainer.innerHTML = "";

  frameEntries.forEach((entry, index) => {
    const frameElement = document.createElement("div");
    frameElement.className = entry.isActive ? "frame-card active-frame" : "frame-card";

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
    playersElement.innerText = `Players: ${entry.playerNames.filter((name) => name).join(", ")}`;
    frameElement.appendChild(playersElement);

    const paidByElement = document.createElement("p");
    paidByElement.innerText = `Paid by: ${entry.paidByNames.filter((name) => name).join(", ") || "N/A"}`;
    frameElement.appendChild(paidByElement);

    // Status for active frames
    if (entry.isActive) {
      const statusElement = document.createElement("p");
      statusElement.innerText = `Status: ${entry.offStatus ? entry.offStatus : "Active"}`;
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
      offButton.addEventListener("click", () => showOffPopup(entry.rowNumber, entry.playerNames));
      frameElement.appendChild(offButton);
    }

    frameEntriesContainer.appendChild(frameElement);
  });
}

function showOffPopup(rowNumber, playerName) {
  const playerListString = prompt(`To be paid by ${playerName}:`);

  if (playerListString) {
    console.log(`Marking frame at row ${rowNumber} as off. Paid by: ${playerName} and amount: ${playerListString}`);
    try {
      const url = "https://payment.snookerplus.in/update/frame/off/";

      const payload = {
        frameId: `SPS${rowNumber}`,
        players: playerListString.split(",").map((player) => player.trim()), // Ensure players are trimmed
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
            alert("Frame turned off successfully!");
            window.location.reload();
          });
      } catch (error) {
        loaderInstance.hideLoader();
        console.error("Fetch error:", error);
        alert("Failed to turn off the frame. Please try again.");
      }
    } catch (error) {
      console.error("Error turning off the frame:", error);
      alert("An error occurred while turning off the frame. Please try again later.");
    }
  }
}

async function getUserStudio() {
  const securityText = getSecurityTextFromURL();
  const studiosData = await fetchStudiosData();

  const studioRow = studiosData.find((row) => row[4] === securityText);

  if (studioRow) {
    return studioRow[0];
  } else {
    return null;
  }
}

function getSecurityTextFromURL() {
  // Implement your logic to extract the security text from the URL
  // For example, you can use window.location.search to get the query string
  // and parse it to extract the security text parameter
  // For now, let's return a dummy security text
  return "YOUR_SECURITY_TEXT";
}

async function fetchStudiosData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Studios?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values;
}

window.onload = async function () {
  const userStudio = await getUserStudio();

  if (userStudio) {
    fetchData(userStudio).then((data) => {
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
      frameGlobalData = frameEntries;
      displayFrameEntries(frameEntries);
    });
  } else {
    // Handle the case where the user's studio data is not found
    console.error("User's studio data not found.");
    alert("User's studio data not found. Please contact support.");
  }

  populatePlayerNames();
};


