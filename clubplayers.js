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
});


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

// Rest of the functions remain unchanged

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


function recordTopUp(playerName, amount,) {
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
          // Just reload to get latest info
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


  function recordAppPurchase(playerName, amount,) {
    try {
      loaderInstance.showLoader();
  
      fetch("https://payment.snookerplus.in/record_app_purchase/", {
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
          // Just reload to get latest info
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
