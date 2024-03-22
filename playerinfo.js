document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss';

    // Function to get URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Pre-fill the name input if 'player' param is in the URL
    const playerNameParam = getQueryParam('player');
    if (playerNameParam) {
        document.getElementById('name').value = decodeURIComponent(playerNameParam);
    }

    document.getElementById('playerInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        fetchPlayerInfo();
    });

    function fetchPlayerInfo() {
        const name = document.getElementById('name').value;
        const pin = document.getElementById('pin').value;

        if (!name || !pin) {
            alert('Please enter name and pin');
            return;
        }

        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/snookerplus!A2:Z1000?key=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const playerRow = data.values.find(row => row[2] === name && row[4] === pin);
                if (playerRow) {
                    window.location.href = `player_details.html?player=${encodeURIComponent(name)}`;
                } else {
                    alert('Player not found or pin does not match');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('There was an error fetching the player information.');
            });
    }
});
