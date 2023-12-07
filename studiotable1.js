const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc'; // Caution: Exposing API key
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'af'; // Sheet name for match details

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
    const rowData = data[1]; // Get the second row (index 1) directly

    if (rowData && rowData.length >= 8) {
        displayMatchDetails(rowData);
    } else {
        displayNotActive();
    }
}

function displayMatchDetails(rowData) {
    const matchInfoElement = document.getElementById('match-info');
    if (matchInfoElement) {
        matchInfoElement.innerHTML = `
            <div class="player-matchup">
                <span class="player">${rowData[2]} (Rank: ${rowData[4]}, Level: ${rowData[5]})</span>
                <span class="vs">VS</span>
                <span class="player">${rowData[3]} (Rank: ${rowData[6]}, Level: ${rowData[7]})</span>
            </div>
            <div class="start-time">Start Time: ${rowData[1]}</div>
        `;
    }
}

function displayNotActive() {
    const matchInfoElement = document.getElementById('match-info');
    matchInfoElement.innerHTML = '<img src="https://img1.wsimg.com/isteam/ip/9e11a5db-9940-4d56-b773-7f8426617dc8/Frame%2012995%20(1).png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25" alt="Snooker Plus Logo" style="max-width: 100%; height: auto;">';
}
