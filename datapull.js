// Your API Key and Sheet ID
const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';
const SHEET_NAME = 'Rank';

// Load the Google Sheets API
gapi.load('client', initClient);

// Initialize the Google Sheets API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        // Fetch data
        fetchSheetData();
    });
}

// Function to create a player card element
function createPlayerCard(player) {
    const { rank, name, coins, youtubeLink } = player;

    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';

    const playerInfo = document.createElement('div');
    playerInfo.className = 'player-info';

    const playerName = document.createElement('span');
    playerName.className = 'player-name';
    playerName.textContent = `${rank}. ${name}`;

    // Check if player is a champion and add a medal icon
    if (["Arpit", "Saurav Johari"].includes(name)) {
        const championIcon = document.createElement('span');
        championIcon.textContent = '🎖️'; // Using a medal emoji
        championIcon.className = 'champion-icon';
        playerName.appendChild(championIcon);
    }

    playerInfo.appendChild(playerName);

    // Add YouTube play button if link exists
    if (youtubeLink) {
        const playButton = document.createElement('a');
        playButton.href = youtubeLink;
        playButton.target = "_blank";
        playButton.className = 'play-button';
        playButton.textContent = '▶️';
        playerInfo.appendChild(playButton);
    }

    const playerCoins = document.createElement('span');
    playerCoins.className = 'player-coins';
    playerCoins.textContent = `S+ Coins: ${coins}`;
    playerInfo.appendChild(playerCoins);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressBarInner = document.createElement('div');
    progressBarInner.className = 'progress-bar-inner';

    let progressBarColor = '#F44336'; // Default: Red
    if (coins >= 21 && coins <= 30) {
        progressBarColor = '#FFEB3B'; // Yellow
    } else if (coins >= 31 && coins <= 40) {
        progressBarColor = '#4CAF50'; // Green
    } else if (coins >= 41 && coins <= 50) {
        progressBarColor = '#795548'; // Brown
    } else if (coins >= 51 && coins <= 60) {
        progressBarColor = '#2196F3'; // Blue
    } else if (coins >= 61 && coins <= 70) {
        progressBarColor = '#E91E63'; // Pink
    } else if (coins > 70) {
        progressBarColor = '#000000'; // Black
    }

    progressBarInner.style.backgroundColor = progressBarColor;

    const colorMinCoins = [0, 21, 31, 41, 51, 61, 71];
    const colorMaxCoins = [20, 30, 40, 50, 60, 70, 1000];
    let progressBarWidth = 0;

    for (let i = 0; i < colorMinCoins.length; i++) {
        if (coins >= colorMinCoins[i] && coins <= colorMaxCoins[i]) {
            progressBarWidth = ((coins - colorMinCoins[i]) + 1) / (colorMaxCoins[i] - colorMinCoins[i] + 1) * 100;
            break;
        }
    }

    progressBarInner.style.width = `${progressBarWidth}%`;

    progressBar.appendChild(progressBarInner); // Append the inner div to the progress bar

    playerCard.appendChild(playerInfo);
    playerCard.appendChild(progressBar);
    if (coins > 70) {
        playerCard.className = 'player-card black-level-card';
        // Remove the progress bar for Black level players
        progressBar.remove();
    } else {
        // ... existing progress bar code ...
    }
    playerName.addEventListener('click', function() {
    window.location.href = `https://leaderboard.snookerplus.in/playerinfo?player=${encodeURIComponent(name)}`;
});

    return playerCard;
}


// Function to display players
function displayPlayers(players) {
    const playerContainer = document.getElementById('playerContainer');
    playerContainer.innerHTML = '';
    players.forEach(player => {
        playerContainer.appendChild(createPlayerCard(player));
    });
}

// Function to fetch data from Google Sheets
function fetchSheetData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: SHEET_NAME,
    }).then(function(response) {
        const values = response.result.values;
        if (values && values.length > 0) {
            const players = values.map((row, index) => ({
                rank: index + 1,
                name: row[1],
                coins: parseInt(row[2]),
                youtubeLink: row[5] // Fetching the YouTube link from column F
            }));
            displayPlayers(players);
        } else {
            console.log('No data found.');
        }
    }, function(response) {
        console.error('Error fetching data:', response.result.error.message);
    });
}

// Function to search and filter data
function searchTable() {
    var input, filter, cards, name, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    cards = document.getElementsByClassName("player-card");
    for (i = 0; i < cards.length; i++) {
        name = cards[i].getElementsByClassName("player-name")[0].textContent;
        if (name.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

let lastScrollTop = 0;
const floatingButton = document.getElementById('floatingButton');

window.addEventListener("scroll", function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        floatingButton.style.opacity = "0";
    } else {
        floatingButton.style.opacity = "1";
    }
    lastScrollTop = scrollTop;
});

// Call the initClient function to start fetching data
initClient();
