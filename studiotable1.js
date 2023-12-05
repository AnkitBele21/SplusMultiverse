const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc'; // Caution: Exposing API key
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'Frames';

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
        .catch(error => console.error('Error:', error));
}

function processData(data) {
    // Assuming the first row is the header
    const headers = data[0];
    const rows = data.slice(1);

    rows.forEach(row => {
        const rowData = headers.reduce((obj, header, index) => {
            obj[header] = row[index];
            return obj;
        }, {});

        if (rowData['Table'] === 'T1') {
            // This row is for Table 1
            displayMatchDetails(rowData);
            displayPlayerInfo(rowData);
        }
    });
}

function displayMatchDetails(rowData) {
    // Extract and display start time from 'Start Time' column
    document.getElementById('start-time').innerText = `Start Time: ${rowData['Start Time'] || 'Not available'}`;
    // Update other match details if needed
}

function displayPlayerInfo(rowData) {
    // Extract player info
    document.getElementById('player1-info').innerText = `Player 1: ${rowData['Player 1'] || 'Waiting'}`;
    document.getElementById('player2-info').innerText = `Player 2: ${rowData['Player 2'] || 'Waiting'}`;

    // Fetch player stats from the leaderboard and update the display
    // Handle the case where one or both players are missing
}

// Additional functions for fetching player stats, etc.
