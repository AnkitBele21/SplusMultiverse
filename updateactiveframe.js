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
  const players = rowData.slice(12, 18).filter(Boolean).join(", ");

  document.getElementById("frameNo").textContent = frameId;
  document.getElementById("tableNo").value = tableNo || "";
  document.getElementById("startTime").value = startTime || "";
  document.getElementById("players").value = players || "";

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
    const players = document.getElementById("players").value;

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

function populatePlayerNames() {
  fetchData("SnookerPlus").then((data) => {
    const nameDatalist = document.getElementById("playerNames");
    // nameDatalist.innerHTML = ""; // Don't clear previous suggestions
    data.forEach((row) => {
      const optionElement = document.createElement("option");
      optionElement.value = row[2];
      nameDatalist.appendChild(optionElement);
    });
  });
}
