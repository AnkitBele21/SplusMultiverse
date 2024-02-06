document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
    const SHEET_NAME = 'Matches';

    async function fetchData(round) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
        const data = await response.json();
        return data.values.slice(1).filter(match => match[1].toLowerCase() === round);
    }

    window.changeRound = async function(round) {
        const data = await fetchData(round);
        const matchesContainer = document.getElementById('matchesContainer');
        matchesContainer.innerHTML = '';
        data.forEach(match => {
            const matchCard = createMatchCard(match);
            matchesContainer.appendChild(matchCard);
        });
        updateCurrentRoundIndicator(round);
        updateRoundSelectorColor(round);
    }

    function createMatchCard(match) {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${match[2]} vs ${match[3]}</h5>
                <p class="card-text">Table: ${match[4]}</p>
                <p class="card-text">Date & Time: ${match[5]}, ${match[6]}</p>
                <p class="card-text">Winner: ${match[7]}</p>
                <a href="${match[8]}" class="card-link" target="_blank">Match Link</a>
            </div>
        `;
        return card;
    }

    function updateCurrentRoundIndicator(round) {
        const roundNames = {
            'groupStage': 'Group Stage',
            'knockout': 'Knockout',
            'quarterFinals': 'Quarter Finals',
            'semiFinals': 'Semi Finals',
            'finals': 'Finals'
        };
        document.getElementById('currentRoundText').textContent = roundNames[round];
    }

    function updateRoundSelectorColor(round) {
        const colors = {
            'groupStage': '#28a745',
            'knockout': '#964b00',
            'quarterFinals': '#0000ff',
            'semiFinals': '#ff69b4',
            'finals': '#000000'
        };
        document.getElementById('roundSelector').style.backgroundColor = colors[round];
    }

    // Directly attach event listener to toggle the dropdown
    document.getElementById('roundSelector').addEventListener('click', function() {
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Initially display Group Stage matches
    changeRound('groupStage');
});
