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
    const headers = data[0];
    const rows = data.slice(1);

    rows.forEach(row => {
        const rowData = headers.reduce((obj, header, index) => {
            obj[header] = row[index];
            return obj;
        }, {});

        if (rowData['G'] === 'On' && rowData['H'] === 'T1' && rowData['I'] === '') {
            // Display match details
            displayMatchDetails(rowData);
        } else {
            // Display Snooker Plus logo
            displayLogo();
        }
    });
}

function displayMatchDetails(rowData) {
    const matchInfo = rowData['O'] ? 'Rummy' : `${rowData['M']} Vs ${rowData['N']}`;
    document.getElementById('match-info').innerText = matchInfo;
    // Additional details and formatting can be added here
}

function displayLogo() {
    document.getElementById('match-info').innerHTML = '<img src="snookerplus_logo.png" alt="Snooker Plus Logo">';
    // Adjust the path to the logo image as necessary
}

// Additional functions and logic as needed

