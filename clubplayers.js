const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
const PLAYER_SHEET_NAME = 'snookerplus';

const loaderInstance = new FullScreenLoader();

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

    // Add event listener to the Back button
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "https://ankitbele21.github.io/SplusMultiverse/clubframes";
        });
    }
});

function fetchPlayerData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}?key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const tableBody = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows
            
            // Find the column index based on the URL Studio and fixed "Purchase" label
            getIndexesFromURL().then(({ studioIndex, purchaseIndex }) => {
                if (studioIndex !== -1 && purchaseIndex !== -1) {
                    rows.slice(3).forEach((row, index) => {
                        if (row.length > studioIndex && row.length > purchaseIndex) { // Check if the row contains data in the desired columns
                            const playerName = row[studioIndex]; // Get player name from the specified column
                            const balance = parseFloat(row[15]); // Assuming balance is always in column P
                            
                            // Process player data...
                            if (playerName.trim() !== '') { // Check if player name is not empty or null
                                const rowElement = tableBody.insertRow();

                                // Apply classes based on conditions
                                if (!isNaN(parseFloat(balance)) && parseFloat(balance) > 5) {
                                    rowElement.classList.add('balance-high');
                                } else if (!isNaN(parseFloat(balance)) && parseFloat(balance) < -5) {
                                    rowElement.classList.add('balance-low');
                                }

                                const playerNameCell = rowElement.insertCell(0);
                                playerNameCell.textContent = playerName;

                                // Adjust color based on balance
                                if (!isNaN(parseFloat(balance)) && parseFloat(balance) > 5) {
                                    playerNameCell.style.color = '#F44336'; // Example color, adjust as needed
                                } else if (!isNaN(parseFloat(balance)) && parseFloat(balance) < -5) {
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
                    console.error('Studio or purchase column not found in URL or invalid indices.');
                }
            });
        })
        .catch(error => console.error('Error fetching player data:', error));
}

// Function to extract studio index and "Purchase" index from the URL
function getIndexesFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const studio = urlParams.get('studio');

    // Fetch data from the 'snookerplus' sheet to access the first two rows
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_SHEET_NAME}!1:2?key=${API_KEY}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const firstRow = data.values[0]; // Extract the first row of the sheet
            const secondRow = data.values[1]; // Extract the second row of the sheet

            const studioIndex = firstRow.findIndex(value => value.toLowerCase() === studio.toLowerCase());
            const purchaseIndex = secondRow.indexOf('Purchase');

            return { studioIndex, purchaseIndex };
        })
        .catch(error => {
            console.error('Error fetching data from sheet:', error);
            return { studioIndex: -1, purchaseIndex: -1 }; // Return -1 if an error occurs
        });
}

// Function to handle top-up balance action
function topUpBalance(playerName) {
    const amount = prompt(`Enter top-up amount for ${playerName}:`);
    if (amount) {
        recordTopUp(playerName, amount);
    }
}

// Function to handle purchase action
function makePurchase(playerName) {
    const amount = prompt(`Enter purchase amount for ${playerName}:`);
    if (amount) {
        recordAppPurchase(playerName, amount);
    }
}

// Rest of the functions remain unchanged

// Removed the redundant window.onload function as it was causing issues with loading the player data correctly.

// Function to record top-up action
function recordTopUp(playerName, amount) {
    try {
      loaderInstance.showLoader();
  
      fetch("https://payment.snookerplus.in/record_top_up/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: playerName,
          amount_paid: amount,
        }),
      })
        .then((resp) => {
          loaderInstance.hideLoader();
          if (!resp.ok) {
            throw new Error("Network response was not ok");
          }
          return resp.json();
        })
        .then((_body) => {
          // Just reload to get the latest info
          window.location.reload();
        });
    } catch (error) {
      loaderInstance.hideLoader();
      console.error("Fetch error:", error);
      alert(
        "Something went wrong while handling payment success. Contact support."
      );
    }
}

// Function to record purchase action
function recordAppPurchase(playerName, amount) {
    try {
      loaderInstance.showLoader();
  
      fetch("https://payment.snookerplus.in/record_app_purchase/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: playerName,
          amount_paid:amount,
}),
})
.then((resp) => {
loaderInstance.hideLoader();
if (!resp.ok) {
throw new Error("Network response was not ok");
}
return resp.json();
})
.then((_body) => {
// Just reload to get the latest info
window.location.reload();
});
} catch (error) {
loaderInstance.hideLoader();
console.error("Fetch error:", error);
alert(
"Something went wrong while handling payment success. Contact support."
);
}
}
