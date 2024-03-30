// player_details.js
// Your API Key and Sheet ID
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
const PLAYER_SHEET_NAME = "snookerplus";
const RANK_SHEET_NAME = "Rank";

const SHEET_PLAYER_CELLS_CONSTANTS = {
  playerName: 3, // Assuming column D
  amountToPay: 7, // Assuming column G
  razorPayPaid: 58, // Assuming column BF
};

const loaderInstance = new FullScreenLoader();

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
    })
    .then(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const playerName = urlParams.get("player");

      if (playerName) {
        fetchPlayerInfo(playerName);
        fetchStudiosSheet(playerName);
        fetchRankInfo(playerName);
        setupPayNowButton(playerName);
      } else {
        console.error("Player name not provided.");
      }
    });
}

function fetchPlayerInfo(playerName) {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: `${PLAYER_SHEET_NAME}`,
    })
    .then(
      (response) => {
        const values = response.result.values;
        const playerInfo = values.find((row) => row[2] === playerName); // Assuming name is in column C
        if (playerInfo) {
          displayPlayerInfo(playerInfo);
        } else {
          console.log("Player info not found.");
        }
      },
      (response) => {
        console.error(
          "Error fetching player data:",
          response.result.error.message
        );
      }
    );
}

function fetchStudiosSheet(playerName) {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: "Studios!G:G", // Assuming sheet names are in column G of Studios sheet
    })
    .then(
      (response) => {
        const sheetNames = response.result.values;
        if (sheetNames && sheetNames.length > 0) {
          sheetNames.forEach((sheetName) => {
            const framesSheetName = sheetName[0];
            fetchFramesInfo(playerName, framesSheetName);
          });
        } else {
          console.log("No sheet names found in the Studios sheet.");
        }
      },
      (response) => {
        console.error(
          "Error fetching sheet names:",
          response.result.error.message
        );
      }
    );
}

function fetchFramesInfo(playerName, framesSheetName) {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: `${framesSheetName}`,
    })
    .then(
      (response) => {
        const values = response.result.values;
        const framesData = values.filter((row) =>
          [row[5], row[33]].includes(playerName)
        ); // Assuming player names are in columns F and AH
        if (framesData.length > 0) {
          displayFramesInfo(framesData, playerName);
        } else {
          console.log(`No frames found for player in ${framesSheetName}.`);
        }
      },
      (response) => {
        console.error(
          `Error fetching frames data from ${framesSheetName}:`,
          response.result.error.message
        );
      }
    );
}

function fetchRankInfo(playerName) {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: SHEET_ID,
      range: `${RANK_SHEET_NAME}`,
    })
    .then(
      (response) => {
        const values = response.result.values;
        const rankInfo = values.find((row) => row[1] === playerName); // Matching player name in column B
        if (rankInfo) {
          displayRankInfo(rankInfo);
        } else {
          console.log("Rank info not found.");
        }
      },
      (response) => {
        console.error(
          "Error fetching rank data:",
          response.result.error.message
        );
      }
    );
}

function displayPlayerInfo(playerInfo) {
  document.getElementById("playerName").innerText = playerInfo[2]; // Assuming name is in column C
  const totalMoneyElement = document.getElementById("totalMoney");
  totalMoneyElement.innerText = `Balance: ₹ ${playerInfo[6]}`; // Assuming balance is in column G

  // Check if balance is more than 0 and color it red
  if (parseInt(playerInfo[6]) > 0) {
    totalMoneyElement.classList.add("positive");
  } else {
    totalMoneyElement.classList.remove("positive");
  }

  // Check if balance is more than 2000 and display warning
  if (parseInt(playerInfo[6]) > 2000) {
    document.getElementById("warning").style.display = "block";
  } else {
    document.getElementById("warning").style.display = "none";
  }
}

function displayFramesInfo(framesData, playerName) {
  const framesContainer = document.getElementById("framesInfo");

  framesData.reverse().forEach((frame) => {
    const frameElement = document.createElement("div");
    frameElement.className = "frame-card";

    // Format the date
    const dateParts = frame[2].split("/");
    const formattedDate = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0]
    );
    const dateStr = `${formattedDate.getDate()} ${formattedDate.toLocaleString(
      "default",
      { month: "short" }
    )}, ${formattedDate.getFullYear()}`;

    const durationStr = `${frame[3]} Min`;
    const winner = frame[5];
    const loser = frame[34];

    // Determine the opponent's name
    let opponentName = winner === playerName ? loser : winner;

    // Determine the frame card color
    if (winner === playerName) {
      frameElement.classList.add("winner");
    } else if (winner === "Rummy") {
      frameElement.classList.add("rummy");
    } else if (winner === "Tie") {
      frameElement.classList.add("tie");
    } else {
      frameElement.classList.add("loser");
    }

    // Check if the frame was a Rummy, Tie, or a regular frame
    if (opponentName === "Rummy") {
      frameElement.innerHTML = `
                <p><span class="icon">&#128197;</span>${dateStr}, <span class="icon">&#128337;</span>${durationStr}</p>
                <p>Format: Rummy</p>
            `;
    } else if (winner === "Tie") {
      // Fetch additional data for Tie
      const additionalNameM = frame[12]; // Assuming column M is at index 12
      const additionalNameN = frame[13]; // Assuming column N is at index 13

      // Determine the name to display based on additional columns M and N
      opponentName =
        additionalNameM === playerName ? additionalNameN : additionalNameM;

      frameElement.innerHTML = `
                <p><span class="icon">&#128197;</span>${dateStr}, <span class="icon">&#128337;</span>${durationStr}</p>
                <p>Opponent: ${opponentName}</p>
                <p>Result: Tie</p>
            `;
    } else {
      const isWinner = frame[5] === playerName;
      const currencyValue = frame[9] || "LP";
      const sPlusValue = isWinner ? frame[50] : frame[51];
      const currencyDisplay = isWinner
        ? `+${currencyValue}`
        : `-${currencyValue}`;
      const sPlusDisplay = `Coins ${sPlusValue}`;

      frameElement.innerHTML = `
                <p><span class="icon">&#128197;</span>${dateStr}, <span class="icon">&#128337;</span>${durationStr}</p>
                <p>Opponent: ${opponentName}</p>
                <p>${currencyDisplay}, ${sPlusDisplay}</p>
            `;
    }
    framesContainer.appendChild(frameElement);
  });
}

function displayRankInfo(rankInfo) {
  document.getElementById("playerRank").innerText = `Rank: ${rankInfo[0]}`; // Rank in column A
  document.getElementById("winRate").innerText = `Win Rate: ${rankInfo[4]}%`; // Win rate in column E

  // Determine the background color based on the coins
  let playercardColor = '';
  const coins = parseInt(rankInfo[2]); // Assuming coins are in column C
  if (coins >= 21 && coins <= 30) {
    playercardColor = '#FFEB3B'; // Yellow
  } else if (coins >= 31 && coins <= 40) {
    playercardColor = '#4CAF50'; // Green
  } else if (coins >= 41 && coins <= 50) {
    playercardColor = '#795548'; // Brown
  } else if (coins >= 51 && coins <= 60) {
    playercardColor = '#2196F3'; // Blue
  } else if (coins >= 61 && coins <= 70) {
    playercardColor = '#E91E63'; // Pink
  } else if (coins > 70) {
    playercardColor = '#000000'; // Black
  }

  // Apply the background color to the player card
  document.getElementById("playerCard").style.backgroundColor = playercardColor;

  // New code to display the Offer
  const offer = rankInfo[8]; // Assuming Offer is in column I
  document.getElementById("playerOffer").innerText = `Offer: ${offer}`;
}

function setupPayNowButton(playerName) {
  document
    .getElementById("payNowButton")
    .addEventListener("click", function () {
      const playerBalance = document
        .getElementById("totalMoney")
        .innerText.replace("Balance: ₹ ", "");
      initiatePayment(playerName, playerBalance);
    });
}

/**
 * Retrieves the row of a player from the spreadsheet using the player's name.
 * Assumption: PlayerName is unique and can be used for identification
 *
 * @param {string} playerName - The name of the player.
 * @return {Array} - An array representing the player's information if found, otherwise undefined.
 */
function getPlayerRow(playerName) {
  return new Promise((resolve, reject) => {
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SHEET_ID,
        range: `${PLAYER_SHEET_NAME}`,
      })
      .then(
        (response) => {
          const values = response.result.values;
          const playerInfo = values.find(
            (row) => row[SHEET_PLAYER_CELLS_CONSTANTS.playerName] === playerName
          );
          if (playerInfo) {
            resolve(playerInfo);
          } else {
            console.log("Player info not found.");
            resolve(null); // Resolve with null if player info is not found
          }
        },
        (response) => {
          console.error(
            "Error fetching player row:",
            response.result.error.message
          );
          reject([]);
        }
      );
  });
}

/**
 * Handles the payment success for a player.
 * - Updates the player's RazorPay paid amount in the sheet.
 *
 * @param {string} playerName - The name of the player.
 * @param {number} amount - The amount of the payment.
 * @param {string} _paymentId - The ID of the payment.
 */
async function handlePaymentSuccess(playerName, amount, _paymentId) {
  try {
    loaderInstance.showLoader();

    fetch("https://payment.snookerplus.in/record_payment/", {
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

const preparePayment = (playerName, paymentAmount) => {
  try {
    loaderInstance.showLoader();

    fetch("https://payment.snookerplus.in/payment/options/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: paymentAmount,
      }),
    })
      .then((resp) => {
        console.log(resp);
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json(); // Return the response json (a Promise)
      })
      .then((body) => {
        
        const defaultOptions = {
          ...body,
          handler: function (response) {
            // Handle the payment success
            handlePaymentSuccess(
              playerName,
              paymentAmount,
              response.razorpay_payment_id
            );
          },
          prefill: {
            name: playerName,
            // Add other prefill information if available
          },
          theme: {
            color: "#3399cc",
          },
        };
        loaderInstance.hideLoader();
        var rzp = new Razorpay(defaultOptions);
        rzp.open();
      })
  } catch (error) {
    loaderInstance.hideLoader();
    console.error("Fetch error:", error);
    alert(
      "Something went wrong while preparing payment link. Contact support."
    );
  }
};

function initiatePayment(playerName, amount) {
  // Convert amount to a number and check if it's valid
  let paymentAmount = Number(amount);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    console.warn("Invalid payment amount", paymentAmount);
    alert("Invalid payment amount");
    return;
  }

  preparePayment(playerName, paymentAmount);
}

// Load the Google API client and call initClient
gapi.load("client", initClient);
