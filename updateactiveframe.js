const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'Frames';

document.addEventListener('DOMContentLoaded', function() {
    const frameId = getFrameIdFromURL();
    if (frameId) {
        fetchFrameData(frameId);
    }
});

function getFrameIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('frameId');
}

async function fetchFrameData(frameId) {
    const rowNumber = extractRowNumber(frameId);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:Z${rowNumber}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const rowData = data.values[0];
        prefillForm(rowData, rowNumber);
    } catch (error) {
        console.error('Error fetching frame data:', error);
    }
}

function extractRowNumber(frameId) {
    // Assuming frameId is in the format "SPS<number>"
    return parseInt(frameId.replace('SPS', '')) + 1; // Adjust based on your sheet's row indexing
}

function prefillForm(rowData, rowNumber) {
    // Assuming specific columns for tableNo, startTime, and players
    // Adjust the indexes based on your sheet's structure
    const tableNo = rowData[7]; // Example: column H has tableNo
    const startTime = rowData[10]; // Example: column K has startTime
    const players = rowData.slice(12, 18).join(', '); // Example: columns M to R have player names

    document.getElementById('frameNo').textContent = `SPS${rowNumber - 1}`; // Adjust if needed
    document.getElementById('tableNo').value = tableNo;
    document.getElementById('startTime').value = startTime;
    document.getElementById('players').value = players;
}

// Implement the updateFrameData function if needed
// This function would typically send updated data back to the sheet
