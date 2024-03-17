async function updateFrameData() {
    const frameId = document.getElementById('frameNo').textContent;
    const tableNo = document.getElementById('tableNo').value;
    const startTime = document.getElementById('startTime').value;
    const players = document.getElementById('players').value.split(',').map(player => player.trim()); // Ensure players are trimmed

    const payload = {
        frameId: frameId,
        tableNo: tableNo,
        startTime: startTime,
        players: players
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby_9EXahpgMDdWjjs4aBxqlUqaoWP4rVYHUV-IrqEOeiHFHRu4hELpmssMv7DGDPYIkWg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            mode: 'no-cors' // This should generally be avoided unless necessary
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        if (result.success) {
            alert('Frame updated successfully!');
            window.location.href = 'https://leaderboard.snookerplus.in/clubframes'; // Redirect back to the frames page
        } else {
            alert('Failed to update the frame. Please try again.');
        }
    } catch (error) {
        console.error('Error updating frame:', error);
        alert('An error occurred while updating the frame. Please check the console for more details.');
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

    // Replace 'YOUR_WEB_APP_URL_HERE' with your actual Web App URL
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
