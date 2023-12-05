const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc'; // Caution: Exposing API key
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'af'; // Updated to the new sheet name

document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateDisplay();
});

function fetchDataAndUpdateDisplay() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            processData(data.values);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayNotActive();
        });
}

function processData(data) {
    // Assuming that the relevant data starts from the second row
    const rowData = data[1]; // Get the second row (index 1) directly

    if (rowData && rowData.length >= 4) {
        displayMatchDetails(rowData);
    } else {
        displayNotActive();
    }
}

function displayMatchDetails(rowData) {
    const matchInfoElement = document.getElementById('match-info');
    if (matchInfoElement) {
        matchInfoElement.innerHTML = `
            <div>${rowData[0]}</div> <!-- Table 1 -->
            <div>Start Time: ${rowData[1]}</div> <!-- Start Time -->
            <div>Player 1: ${rowData[2]}</div> <!-- Player 1 -->
            <div>Player 2: ${rowData[3]}</div> <!-- Player 2 -->
        `;
    }
}

function displayNotActive() {
    const matchInfoElement = document.getElementById('match-info');
    if (matchInfoElement) {
        matchInfoElement.innerText = 'Not Active';
    }
}
