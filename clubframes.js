const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';

async function fetchData(sheetName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values.slice(1);
}

function displayFrameEntries(frameEntries) {
    const frameEntriesContainer = document.getElementById('frameEntries');
    frameEntriesContainer.innerHTML = ''; 
    
    frameEntries.forEach((entry, index) => {
        const frameElement = document.createElement('div');
        frameElement.className = entry.isActive ? 'frame-card active-frame' : 'frame-card';
        
        // Include Frame ID
        const frameIdElement = document.createElement('p');
        frameIdElement.innerText = `Frame ID: SPS${entry.rowNumber}`;
        frameIdElement.style.fontSize = 'small'; // Making the font size small
        frameElement.appendChild(frameIdElement);
        
        
        const dateElement = document.createElement('h5');
        dateElement.innerText = `Date: ${entry.date}`;
        frameElement.appendChild(dateElement);

        const tableNoElement = document.createElement('p');
        tableNoElement.innerText = `Table No: ${entry.tableNo || 'N/A'}`;
        frameElement.appendChild(tableNoElement);
        
        if (!entry.isActive) {
            const durationElement = document.createElement('p');
            durationElement.innerText = `Duration: ${entry.duration} min`;
            frameElement.appendChild(durationElement);
        }
        
        const startTimeElement = document.createElement('p');
        startTimeElement.innerText = `Start Time: ${entry.startTime}`;
        frameElement.appendChild(startTimeElement);
        
        if (!entry.isActive) {
            const tableMoneyElement = document.createElement('p');
            tableMoneyElement.innerText = `Table Money: ${entry.tableMoney}`;
            frameElement.appendChild(tableMoneyElement);
        }
        
        const playersElement = document.createElement('p');
        playersElement.innerText = `Players: ${entry.playerNames.filter(name => name).join(', ')}`;
        frameElement.appendChild(playersElement);

        const paidByElement = document.createElement('p');
        paidByElement.innerText = `Paid by: ${entry.paidByNames.filter(name => name).join(', ') || 'N/A'}`;
        frameElement.appendChild(paidByElement);
        
    // Status for active frames
        if (entry.isActive) {
            const statusElement = document.createElement('p');
            statusElement.innerText = `Status: ${entry.offStatus ? entry.offStatus : 'Active'}`;
            statusElement.style.color = entry.offStatus ? 'red' : 'green'; // Red for "Off", green for "Active"
            frameElement.appendChild(statusElement);
        }

        // Edit Button for active frames
        // Edit Button for active frames
// Inside displayFrameEntries, for each active frame
if (entry.isActive) {
    // Assuming this is within the loop that generates each frame card
const editButton = document.createElement('button');
editButton.innerText = 'Edit';
editButton.className = 'btn btn-primary edit-btn';
editButton.onclick = function() {
    window.location.href = `https://leaderboard.snookerplus.in/updateactiveframe.html?frameId=SPS${entry.rowNumber}`;
};
frameElement.appendChild(editButton);

const offButton = document.createElement('button');
offButton.innerText = 'Off';
offButton.className = 'btn btn-danger off-btn';
//offButton.onclick = function() {
    //showOffPopup(entry.rowNumber, entry.playerNames);
//};
    offButton.addEventListener('click', () => showOffPopup(rowNumber, playerName));
frameElement.appendChild(offButton);

    
}

        
        frameEntriesContainer.appendChild(frameElement);
    });
}
function showOffPopup(rowNumber, playerName) {
    const amount = prompt(`Enter top-up amount for ${playerName}:`);
    if (amount) {
        console.log(`Marking frame at row ${rowNumber} as off. Paid by: ${playerName}`);
        // Here, you would typically make a fetch call to your server or Google Apps Script to update the sheet accordingly.
    }
}

function applyFilters() {
    const playerNameFilter = document.getElementById('playerNameFilter').value.toLowerCase();
    let dateFilter = document.getElementById('dateFilter').value;
    
    if(dateFilter) {
        const [year, month, day] = dateFilter.split('-');
        dateFilter = `${day}/${month}/${year}`;
    }
    
    fetchData('Frames').then(data => {
        let frameEntries = data.map((row, index) => ({
            rowNumber: index + 2, // Correctly scoped index
            date: row[2],
            duration: row[3],
            startTime: row[10],
            tableMoney: row[20],
            tableNo: row[7],
            playerNames: row.slice(12, 18),
            paidByNames: row.slice(23, 29),
            isValid: row[6],
            isActive: row[6] && !row[8]
        })).filter(entry => entry.isValid).reverse();
        
        if (playerNameFilter) {
            frameEntries = frameEntries.filter(entry =>
                entry.playerNames.some(name => name.toLowerCase().includes(playerNameFilter))
            );
        }
        
        if (dateFilter) {
            frameEntries = frameEntries.filter(entry => entry.date === dateFilter);
        }
        
        displayFrameEntries(frameEntries);
    });
}

function populatePlayerNames() {
    fetchData('SnookerPlus').then(data => {
        const nameDatalist = document.getElementById('playerNames');
        data.forEach(row => {
            const optionElement = document.createElement('option');
            optionElement.value = row[2];
            nameDatalist.appendChild(optionElement);
        });
    });
}

function markFrameOn() {
    fetch(WEB_APP_URL, {
        method: 'POST',
        // Google Apps Script does not use the Content-Type header, so we use a query string
        body: 'action=frameOn',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
.then(data => {
    if (data.status === "success") {
        alert("Frame marked as 'On' successfully.");
        window.location.reload();
    } else {
        // If the status is not "success", log or alert the error message if available
        console.error('Error marking frame as On:', data.message || 'Unknown error');
        alert("There was an error marking the frame as 'On'. " + (data.message || ''));
    }
})
.catch(error => {
    console.error('Fetch error:', error);
    alert("There was an error marking the frame as 'On'.");
});

}

window.onload = function() {
    fetchData('Frames').then(data => {
        const frameEntries = data.map((row, index) => ({
            rowNumber: index + 2, // Correctly scoped index
            date: row[2],
            duration: row[3],
            startTime: row[10],
            tableMoney: row[20],
            tableNo: row[7],
            playerNames: row.slice(12, 18),
            paidByNames: row.slice(23, 29),
            offStatus: row[8],
            isValid: row[6],
            isActive: row[6] && !row[8]
        })).filter(entry => entry.isValid).reverse();

        displayFrameEntries(frameEntries);
    });

    populatePlayerNames();
};
