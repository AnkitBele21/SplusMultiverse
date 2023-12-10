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
            processMultipleRows(data.values);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayNotActive();
        });
}

function processMultipleRows(data) {
    const activeTables = data.slice(1, 5).filter(row => row.length >= 8); // Processing rows 2 to 5

    if (activeTables.length > 0) {
        activeTables.forEach(rowData => displayMatchDetails(rowData));
    } else {
        displayNotActive();
    }
}

function displayMatchDetails(rowData) {
    const matchInfoElement = document.getElementById('match-info');
    const tableNumber = rowData[0]; // Table number

    if (matchInfoElement) {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table-details';
        tableDiv.innerHTML = `
            <h3>Table ${tableNumber}</h3>
            <div class="player-card">
                <div class="player-name">${rowData[2]}</div>
                <div class="player-details">Rank: ${rowData[4]}, Level: ${rowData[5]}, Win Rate: ${rowData[8]}%</div>
            </div>
            <div class="vs-text">VS</div>
            <div class="player-card">
                <div class="player-name">${rowData[3]}</div>
                <div class="player-details">Rank: ${rowData[6]}, Level: ${rowData[7]}, Win Rate: ${rowData[9]}%</div>
            </div>
            <div class="start-time">Start Time: ${rowData[1]}</div>
        `;
        matchInfoElement.appendChild(tableDiv);
    }
}

function displayNotActive() {
    const matchInfoElement = document.getElementById('match-info');
    matchInfoElement.innerHTML = '<h2>No Active Matches</h2>';
}
