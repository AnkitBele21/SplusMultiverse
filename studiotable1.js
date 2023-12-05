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
        .catch(error => {
            console.error('Error fetching data:', error);
            displayNotActive();
        });
}

function processData(data) {
    console.log("Fetched Data:", data); // Debugging: Log the fetched data

    const headers = data[0];
    const rows = data.slice(1);
    let isMatchFound = false;

    rows.forEach(row => {
        const rowData = headers.reduce((obj, header, index) => {
            obj[header] = row[index] ? row[index].trim() : ''; // Trim values
            return obj;
        }, {});

        console.log("Row Data:", rowData); // Debugging: Log each row's data

        // Check the conditions with trimmed values
        if (rowData['G'].trim() === 'On' && rowData['H'].trim() === 'T1' && rowData['I'].trim() === '') {
            displayMatchDetails(rowData);
            isMatchFound = true;
            return; // Exit the loop after finding the active match
        }
    });

    if (!isMatchFound) {
        displayNotActive();
    }
}

function displayMatchDetails(rowData) {
    const matchInfoElement = document.getElementById('match-info');
    if (matchInfoElement) {
        matchInfoElement.innerHTML = `
            <div>Match is On</div>
            <div>Player 1: ${rowData['M']}</div>
            <div>Player 2: ${rowData['N']}</div>
        `;
    }
}

function displayNotActive() {
    const matchInfoElement = document.getElementById('match-info');
    if (matchInfoElement) {
        matchInfoElement.innerText = 'Not Active';
    }
}
