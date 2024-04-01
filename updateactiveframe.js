
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";

// Extracting SHEET_NAME from the URL
const urlParams = new URLSearchParams(window.location.search);
const SHEET_NAME = urlParams.get('studio');

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
    document.getElementById("startTime").value = formatTime(startTime) || "";

    // Populate player inputs
    const playersArray = players.split(",").map(player => player.trim());
    const playersContainer = document.getElementById("playersContainer");
    playersContainer.innerHTML = ""; // Clear previous inputs
    playersArray.forEach((player, index) => {
        const playerInput = createPlayerInput(player, index);
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
        let startTime = document.getElementById("startTime").value;

        // Ensure time format is valid
        startTime = formatTime(startTime);

        const playersInputs = document.querySelectorAll(".player-input");
        const players = Array.from(playersInputs).map(input => input.value).join(", ");

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
                        "https://ankitbele21.github.io/SplusMultiverse/clubframes"; // Redirect back to the frames page
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
        const playerNames = data.map(row => row[3]).filter(Boolean); // Extract names from column D
        const existingOptions = new Set(Array.from(nameDatalist.childNodes)
            .filter(node => node.tagName === 'OPTION')
            .map(option => option.value));

        // Get the list of player names from the input fields
        const playerNameInputs = Array.from(playersInputs).map(input => input.value.trim());
        playerNames.forEach((name) => {
            const trimmedName = name.trim();
            // Check if the name is not empty and not already in the datalist, then add it
            if (trimmedName !== "" && !existingOptions.has(trimmedName) && !playerNameInputs.includes(trimmedName)) {
                const optionElement = document.createElement("option");
                optionElement.value = trimmedName;
                nameDatalist.appendChild(optionElement);
                existingOptions.add(trimmedName);
            }
        });
    });
}

function createPlayerInput(value, index) {
    const playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.id = `player${index + 1}`;
    playerInput.className = "player-input";
    playerInput.value = value || "";
    playerInput.placeholder = "Enter player name";
    playerInput.setAttribute("list", "playerNames");
    return playerInput;
}

document.getElementById("addPlayerButton").addEventListener("click", function () {
    const playersContainer = document.getElementById("playersContainer");
    const playerInputs = playersContainer.getElementsByClassName("player-input");
    if (playerInputs.length < 6) {
        const playerInput = createPlayerInput("", playerInputs.length);
        playersContainer.appendChild(playerInput);
        populatePlayerNames();
    } else {
        alert("You can add up to 6 players.");
    }
});

function formatTime(time) {
    // If seconds are not present, append ":00"
    if (time && time.split(":").length === 2) {
        return `${time}:00`;
    }
    return time;
}
function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const security = urlParams.get("security");
    const studio = urlParams.get("studio");
    
    let backUrl = "https://ankitbele21.github.io/SplusMultiverse/clubframes";
    if (security && studio) {
        backUrl += `?security=${security}&studio=${studio}`;
    }
    
    window.location.href = backUrl;
}

/* */
