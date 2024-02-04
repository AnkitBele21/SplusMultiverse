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

    playerInfo.appendChild(playerName);

    if (youtubeLink) {
        const playButton = document.createElement('a');
        playButton.href = youtubeLink;
        playButton.target = "_blank";
        playButton.className = 'play-button';
        playButton.textContent = '▶️';
        playerInfo.appendChild(playButton);
    }

    if (status && status.toLowerCase() === 'playing now') {
        const playingAtClub = document.createElement('span');
        playingAtClub.textContent = 'Playing at Studio';
        playingAtClub.className = 'playing-at-club';
        playerInfo.appendChild(playingAtClub);
        playerCard.classList.add('playing-at-club-border');
    }

    const playerCoins = document.createElement('span');
    playerCoins.className = 'player-coins';
    playerCoins.textContent = `S+ Coins: ${coins}`;
    playerInfo.appendChild(playerCoins);

    playerCard.appendChild(playerInfo);

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
