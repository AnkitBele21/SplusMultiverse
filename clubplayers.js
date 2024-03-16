const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1RmMxuj_taiFoFx9V20xa_l8E74Wg-jaKTMexCfYpCTw';
const PLAYER_SHEET_NAME = 'snookerplus';

document.addEventListener('DOMContentLoaded', function() {
    fetchPlayerData();

    document.getElementById('playerSearch').addEventListener('input', function(e) {
        const searchValue = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#playersTable tbody tr');
        
        rows.forEach(row => {
            const playerName = row.querySelector('td:first-child').textContent.toLowerCase();
            if (playerName.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    fetchPlayerData();
});

function fetchPlayerData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}?key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const tableBody = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows
            rows.slice(3).forEach((row, index) => {
                if (row.length > 0) { // Check if row is not empty
                    const playerName = row[3]; // Assuming player names are in column D
                    const balance = parseFloat(row[6]); // Assuming balances are in column G
                    const rowElement = tableBody.insertRow();

                    // Apply classes based on balance conditions
                    if (balance > 5) {
                        rowElement.classList.add('balance-high');
                    } else if (balance < -5) {
                        rowElement.classList.add('balance-low');
                    }

                    const playerNameCell = rowElement.insertCell(0);
                    playerNameCell.textContent = playerName;
                    // Apply text color based on balance directly to playerNameCell and balanceCell
                    if (balance > 5) {
                        playerNameCell.style.color = '#F44336'; // Red for high balance
                    } else if (balance < -5) {
                        playerNameCell.style.color = '#4CAF50'; // Green for low balance
                    }

                    const balanceCell = rowElement.insertCell(1);
                    balanceCell.textContent = balance.toFixed(2);
                    if (balance > 5) {
                        balanceCell.style.color = '#F44336'; // Red for high balance
                    } else if (balance < -5) {
                        balanceCell.style.color = '#4CAF50'; // Green for low balance
                    }

                    const actionsCell = rowElement.insertCell(2);
                    const topUpButton = document.createElement('button');
                    topUpButton.textContent = 'Top Up';
                    topUpButton.className = 'btn btn-primary mr-2';
                    topUpButton.addEventListener('click', () => topUpBalance(playerName));
                    actionsCell.appendChild(topUpButton);

                    const purchaseButton = document.createElement('button');
                    purchaseButton.textContent = 'Purchase';
                    purchaseButton.className = 'btn btn-warning';
                    purchaseButton.addEventListener('click', () => makePurchase(playerName));
                    actionsCell.appendChild(purchaseButton);
                }
            });
        })
        .catch(error => console.error('Error fetching player data:', error));
}


function topUpBalance(playerName) {
    const amount = prompt(`Enter top-up amount for ${playerName}:`);
    if (amount) {
        console.log(`Top up ${amount} for ${playerName}`);
        // Here, you would typically make a fetch call to your server or Google Apps Script to update the sheet accordingly.
    }
}

function makePurchase(playerName) {
    const amount = prompt(`Enter purchase amount for ${playerName}:`);
    if (amount) {
        console.log(`Purchase ${amount} for ${playerName}`);
        // Similar to top-up, handle the purchase amount update here.
    }
}

function applyFilter() {
    const filterValue = document.getElementById('playerFilter').value.toLowerCase();
    const tableBody = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let playerName = rows[i].getElementsByTagName('td')[0].textContent;
        if (playerName.toLowerCase().indexOf(filterValue) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function addPlayer() {
    console.log('Add Player button clicked');
    // Implement the functionality to add a new player
    // This could involve displaying a modal to enter the new player's details or redirecting to a new page/form
}

// Removed the redundant window.onload function as it was causing issues with loading the player data correctly.
