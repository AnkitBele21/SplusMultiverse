const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
const PLAYER_SHEET_NAME = 'snookerplus';

const loaderInstance = new FullScreenLoader();

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const studio = urlParams.get('studio');
    fetchPlayerData(studio);
    
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

    // Add event listener to the Adjustment button to show the modal
    const adjustmentButton = document.getElementById("adjustmentButton");
    if (adjustmentButton) {
        adjustmentButton.addEventListener("click", function () {
            const modal = document.getElementById("adjustmentModal");
            modal.style.display = "block";
        });
    }

    // Add event listener to the close button of the modal to hide the modal
    const closeAdjustmentModalButton = document.querySelector("#adjustmentModal .close");
    if (closeAdjustmentModalButton) {
        closeAdjustmentModalButton.addEventListener("click", function () {
            const modal = document.getElementById("adjustmentModal");
            modal.style.display = "none";
        });
    }

    // Add event listener to the form submit event to handle adjusting balance
    const adjustmentForm = document.getElementById("adjustmentForm");
    if (adjustmentForm) {
        adjustmentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const winnerName = document.getElementById("winnerName").value;
            const loserName = document.getElementById("loserName").value;
            const amount = document.getElementById("amount").value;

            // Call the function to record the adjustment
            recordAdjustment(winnerName, loserName, amount);
            
            // Hide the modal after submission
            const modal = document.getElementById("adjustmentModal");
            modal.style.display = "none";
            
            // Clear the input fields
            document.getElementById("winnerName").value = "";
            document.getElementById("loserName").value = "";
            document.getElementById("amount").value = "";
        });
    }

    // Add event listener to the Back button
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "https://ankitbele21.github.io/SplusMultiverse/clubframes";
        });
    }

    // Add event listener to the Add Player button to show the modal
    const addPlayerButton = document.getElementById("addPlayerButton");
    if (addPlayerButton) {
        addPlayerButton.addEventListener("click", function () {
            const modal = document.getElementById("addPlayerModal");
            modal.style.display = "block";
        });
    }

    // Add event listener to the close button of the modal to hide the modal
    const closeModalButton = document.querySelector("#addPlayerModal .close");
    if (closeModalButton) {
        closeModalButton.addEventListener("click", function () {
            const modal = document.getElementById("addPlayerModal");
            modal.style.display = "none";
        });
    }

    // Add event listener to the form submit event to handle adding a new player
    const addPlayerForm = document.getElementById("addPlayerForm");
    if (addPlayerForm) {
        addPlayerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const playerName = document.getElementById("playerName").value;
            const playerMobile = document.getElementById("playerMobile").value;
            
            // You can implement the logic to add the new player here, for now, let's just log the details
            console.log("New Player Name:", playerName);
            console.log("New Player Mobile:", playerMobile);
            
            // After adding the player, hide the modal
            const modal = document.getElementById("addPlayerModal");
            modal.style.display = "none";
            
            // Clear the input fields
            document.getElementById("playerName").value = "";
            document.getElementById("playerMobile").value = "";
        });
    }
    
    // Add event listener to the player mobile input box to check for matching mobile numbers
    const playerMobileInput = document.getElementById("playerMobile");
    if (playerMobileInput) {
        playerMobileInput.addEventListener("input", function () {
            const playerMobile = playerMobileInput.value;
            // Fetch corresponding player name if the mobile number exists in the sheet
            fetchPlayerNameByMobile(playerMobile).then(playerName => {
                if (playerName) {
                    document.getElementById("playerName").value = playerName;
                }
            });
        });
    }
});

// Function to fetch player name by mobile number
function fetchPlayerNameByMobile(playerMobile) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}?key=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            for (let i = 7; i < rows.length; i++) {
                if (rows[i][8] === playerMobile) { // Assuming mobile number is in column I (index 8)
                    return rows[i][7]; // Return the corresponding name from column 9 (index 2)
                }
            }
            return null; // Return null if no matching mobile number is found
        })
        .catch(error => {
            console.error('Error fetching player data:', error);
            return null;
        });
}


function fetchPlayerData(studio) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}?key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const tableBody = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows
            
            // Find the column index based on the URL Studio
             getStudioIndexFromURL(studio).then(studioIndex => {
                if (studioIndex !== -1) {
                    rows.slice(3).forEach((row, index) => {
                        // Check if the studio value in the row matches the studio value from URL
                        const studios = row[9] ? row[9].split(',').map(s => s.trim().toLowerCase()) : [];
                        if (studios.includes(studio.toLowerCase())) {
                            const playerName = row[3]; // Get player name from column D (index 3)
                            const balance = parseFloat(row[15]); // Assuming balance is always in column P

                            // Check if player name and balance exist
                            if (playerName && !isNaN(balance)) {
                                const rowElement = tableBody.insertRow();

                                // Apply classes based on balance
                                if (balance > 5) {
                                    rowElement.classList.add('balance-high');
                                } else if (balance < -5) {
                                    rowElement.classList.add('balance-low');
                                }

                                const playerNameCell = rowElement.insertCell(0);
                                playerNameCell.textContent = playerName;

                                // Adjust color based on balance
                                if (balance > 5) {
                                    playerNameCell.style.color = '#F44336'; // Example color, adjust as needed
                                } else if (balance < -5) {
                                    playerNameCell.style.color = '#4CAF50'; // Example color, adjust as needed
                                }

                                const balanceCell = rowElement.insertCell(1);
                                balanceCell.textContent = balance; // Directly display the balance without conversion

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
                        }
                    });
                } else {
                    console.error('Studio not found in URL or invalid column index.');
                }
            });
        })
        .catch(error => console.error('Error fetching player data:', error));
}


// Function to extract studio index from the URL
function getStudioIndexFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const studio = urlParams.get('studio');

    // Fetch data from the 'snookerplus' sheet to access the first row
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}!1:1?key=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const firstRow = data.values[0]; // Extract the first row of the sheet
            const studioIndex = firstRow.findIndex(value => value.toLowerCase() === studio.toLowerCase());
            return studioIndex;
        })
        .catch(error => {
            console.error('Error fetching studio data:', error);
            return -1; // Return -1 if an error occurs
        });
}


function topUpBalance(playerName) {
    const amount = prompt(`Enter top-up amount for ${playerName}:`);
    if (amount) {
        recordTopUp(playerName, amount);
    }
}

function makePurchase(playerName) {
    const amount = prompt(`Enter purchase amount for ${playerName}:`);
    if (amount) {
        recordAppPurchase(playerName, amount);
    }
}

// Function to record adjustment
function recordAdjustment(winnerName, loserName, amount) {
    console.log("Adjustment Recorded:");
    console.log("Winner Name:", winnerName);
    console.log("Loser Name:", loserName);
    console.log("Amount:", amount);
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
