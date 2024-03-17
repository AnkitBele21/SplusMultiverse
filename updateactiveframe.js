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
    // Directly using frameId as row number assuming 'SPS' prefix is followed by the row number
    const rowNumber = frameId.replace('SPS', '');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:Z${rowNumber}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.values && data.values.length > 0) {
            const rowData = data.values[0];
            prefillForm(rowData, frameId);
        } else {
            console.error('No data found for the given frame ID.');
        }
    } catch (error) {
        console.error('Error fetching frame data:', error);
    }
}

function prefillForm(rowData, frameId) {
    // Adjust the indexes based on your sheet's structure
    // Example: Assuming column H (index 7) has tableNo, column K (index 10) has startTime, and columns M to R (indexes 12 to 17) have player names
    const tableNo = rowData[7];
    const startTime = rowData[10];
    const players = rowData.slice(12, 18).filter(Boolean).join(', '); // Join non-empty player names

    document.getElementById('frameNo').textContent = frameId; // Display the Frame ID as is
    document.getElementById('tableNo').value = tableNo || ''; // Fallback to empty string if undefined
    document.getElementById('startTime').value = startTime || '';
    document.getElementById('players').value = players || '';
}

// Note: Ensure your HTML elements (e.g., 'frameNo', 'tableNo', 'startTime', 'players') match these IDs.
