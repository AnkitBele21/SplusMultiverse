// Your API Key and Sheet ID
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
const SHEET_NAME = 'Rank';

// Load the Google Sheets API
gapi.load('client', initClient);

// Initialize the Google Sheets API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        fetchSheetData();
    });
}

// Function to fetch data from Google Sheets
function fetchSheetData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: SHEET_NAME,
    }).then(function (response) {
        const values = response.result.values;
        if (values && values.length > 0) {
            const players = values.map((row, index) => ({
                rank: index + 1,
                name: row[1],
                coins: parseInt(row[2], 10),
                youtubeLink: row[5],
                status: row[10] // Assuming the status is in the 11th column (K)
            }));
            displayPlayers(players);
        } else {
            console.log('No data found.');
        }
    }, function (response) {
        console.error('Error fetching data:', response.result.error.message);
    });
}

// Function to create a player card element
function createPlayerCard(player) {
    const { rank, name, coins, youtubeLink, status } = player;

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

    // Add "Playing at Club" above S+ Coins if the status is "Playing Now"
    if (status && status.toLowerCase() === 'playing now') {
        const playingAtClub = document.createElement('span');
        playingAtClub.textContent = 'Playing .';
        playingAtClub.className = 'playing-at-club';
        playerInfo.appendChild(playingAtClub);

        // Add green border for players playing at the club
        playerCard.classList.add('playing-at-club-border');
    }

    const playerCoins = document.createElement('span');
    playerCoins.className = 'player-coins';
    playerCoins.textContent = `S+: ${coins}`;
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

    progressBar.appendChild(progressBarInner);

    playerCard.appendChild(playerInfo);
    playerCard.appendChild(progressBar);
    if (coins > 70) {
        playerCard.className = 'player-card black-level-card';
        progressBar.remove();
    }
    playerName.addEventListener('click', function () {
        window.location.href = `https://ankitbele21.github.io/SplusMultiverse/playerinfo?player=${encodeURIComponent(name)}`;
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

// Function to search and filter data
function searchTable() {
    var input = document.getElementById("searchInput");
    var filter = input.value.toUpperCase();
    var cards = document.getElementsByClassName("player-card");
    for (var i = 0; i < cards.length; i++) {
        var name = cards[i].getElementsByClassName("player-name")[0].textContent;
        if (name.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// Global variable to track the toggle state
var showPlayingNowOnly = false;

// Function to toggle display of players based on "Playing Now" status
function togglePlayingNowPlayers() {
    showPlayingNowOnly = !showPlayingNowOnly;
    var cards = document.getElementsByClassName("player-card");
    var toggleButton = document.getElementById('toggleButton');

    for (var i = 0; i < cards.length; i++) {
        var status = cards[i].getElementsByClassName("playing-at-club")[0];
        if (showPlayingNowOnly) {
            if (status) {
                cards[i].style.display = "";
            } else {
                cards[i].style.display = "none";
            }
        } else {
            cards[i].style.display = "";
        }
    }

    if (showPlayingNowOnly) {
        toggleButton.classList.add('on');
        toggleButton.textContent = 'Show All';
    } else {
        toggleButton.classList.remove('on');
        toggleButton.textContent = 'Available';
    }
}
