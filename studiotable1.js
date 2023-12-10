const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'af';

document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndUpdateDisplay();
});

function fetchDataAndUpdateDisplay() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => processData(data.values))
        .catch(error => console.error('Error fetching data:', error));
}

function processData(data) {
    const rowData = data[1];

    if (rowData && rowData.length >= 10) {
        displayMatchDetails(rowData);
    } else {
        displayNotActive();
    }
}

function displayMatchDetails(rowData) {
    const logoContainer = document.getElementById('logo-container');
    logoContainer.className = 'logo-active';

    const matchInfoElement = document.getElementById('match-info');
    matchInfoElement.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-4 player-card">
                <div class="player-name">${rowData[2]}</div>
                <div class="player-details">Rank: ${rowData[4]}, Level: ${rowData[5]}, Win Rate: ${rowData[8]}%</div>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <div class="vs-text">VS</div>
            </div>
            <div class="col-md-4 player-card">
                <div class="player-name">${rowData[3]}</div>
                <div class="player-details">Rank: ${rowData[6]}, Level: ${rowData[7]}, Win Rate: ${rowData[9]}%</div>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="start-time">Start Time: ${rowData[1]}</div>
            </div>
        </div>
    `;
}

function displayNotActive() {
    const logoContainer = document.getElementById('logo-container');
    logoContainer.className = 'logo-inactive';
    const matchInfoElement = document.getElementById('match-info');
    matchInfoElement.innerHTML = '<p>No Active Matches</p>';
}
