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
    const tableNo = rowData[7];
    const startTime = rowData[10];
    const players = rowData.slice(12, 18).filter(Boolean).join(', ');

    document.getElementById('frameNo').textContent = frameId;
    document.getElementById('tableNo').value = tableNo || '';
    document.getElementById('startTime').value = startTime || '';
    document.getElementById('players').value = players || '';
}

document.getElementById('updateFrameForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    await updateFrameData();
});

async function updateFrameData() {
    const frameId = document.getElementById('frameNo').textContent;
    const tableNo = document.getElementById('tableNo').value;
    const startTime = document.getElementById('startTime').value;
    const players = document.getElementById('players').value;

    const payload = {
        frameId: frameId,
        tableNo: tableNo,
        startTime: startTime,
        players: players.split(',').map(player => player.trim()) // Ensure players are trimmed
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycby_9EXahpgMDdWjjs4aBxqlUqaoWP4rVYHUV-IrqEOeiHFHRu4hELpmssMv7DGDPYIkWg/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
        alert('Frame updated successfully!');
        window.location.href = 'https://leaderboard.snookerplus.in/clubframes'; // Redirect back to the frames page
    } else {
        alert('Failed to update the frame. Please try again.');
    }
}
