// Updated Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyHFvuKZ3cg3E65jDfzvJM56d9qoD21DUP-re4uqH0pkPcKQdXGuNCDfsNV_zartWL5eQ/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Function to parse URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Extract the Frame ID from the URL and populate the form field
    const frameId = getQueryParam('frameId');
    if (frameId) {
        document.getElementById('frameNo').value = frameId; // Set the Frame ID in the form
        fetchExistingData(frameId); // Fetch and pre-fill existing data for the frame
    }

    // Listen for form submission
    document.getElementById('updateFrameForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        updateFrameData();
    });
});

async function fetchExistingData(frameId) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=fetch&frameId=${frameId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data && data.tableNo) {
            document.getElementById('tableNo').value = data.tableNo;
            document.getElementById('startTime').value = data.startTime;
            document.getElementById('players').value = data.players.join(', ');
        } else {
            console.error('Failed to fetch frame data or frame data is incomplete.');
        }
    } catch (error) {
        console.error('Error fetching frame data:', error);
    }
}

async function updateFrameData() {
    const frameId = document.getElementById('frameNo').value;
    const rowNumber = frameId.replace('SPS', '');
    const tableNo = document.getElementById('tableNo').value;
    const startTime = document.getElementById('startTime').value;
    const players = document.getElementById('players').value.split(',').map(player => player.trim());

    const payload = {
        action: 'update', // Specify the action for clarity and future-proofing
        rowNumber: rowNumber,
        tableNo: tableNo,
        startTime: startTime,
        players: players
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            alert('Frame updated successfully!');
            window.location.href = 'https://ankitbele21.github.io/centurydewas/clubframes';
        } else {
            alert('Failed to update the frame. Please try again.');
        }
    } catch (error) {
        console.error('Error updating frame:', error);
        alert('An error occurred while updating the frame.');
    }
}
