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
async function updateFrameData() {
    const frameId = document.getElementById('frameNo').textContent;
    const tableNo = document.getElementById('tableNo').value;
    const startTime = document.getElementById('startTime').value;
    const players = document.getElementById('players').value;

    const payload = {
        frameId: frameId,
        tableNo: tableNo,
        startTime: startTime,
        players: players
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxidFKEmKheHMmTi7BwCg_8-X2fF6jq3JFZIybY0AzUBCcs_19bDALC_e-l48OAR8Vk-A/exec', { // Replace WEB_APP_URL with your deployed web app URL
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Frame updated successfully!');
            // Redirect or update UI as needed
        } else {
            alert('Failed to update the frame. Please try again.');
        }
    } catch (error) {
        console.error('Error updating frame:', error);
        alert('An error occurred while updating the frame.');
    }
}
