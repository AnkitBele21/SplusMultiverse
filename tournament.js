document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
    const SHEET_NAME = 'Matches';

    async function fetchData(round) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
        const data = await response.json();
        return data.values.slice(1).filter(match => match[1].trim().toLowerCase() === round.toLowerCase());
    }

    window.changeRound = async function(round) {
        const data = await fetchData(round);
        const matchesContainer = document.getElementById('matchesContainer');
        matchesContainer.innerHTML = '';
        data.forEach(match => {
            const matchCard = createMatchCard(match, round);
            matchesContainer.appendChild(matchCard);
        });
        updateCurrentRoundIndicator(round);
        updateRoundSelectorColor(round);
    }

    function createMatchCard(match, round) {
        const card = document.createElement('div');
        card.className = `card mb-3 round-${round.replace(/\s+/g, '').toLowerCase()}`;
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
        document.getElementById('currentRoundText').textContent = round;
    }

    function updateRoundSelectorColor(round) {
        const colors = {
            'groupstage': '#28a745', // Green
            'knockout': '#964b00', // Brown
            'quarterfinals': '#0000ff', // Blue
            'semifinals': '#ff69b4', // Pink
            'finals': '#000000' // Black
        };
        const colorKey = round.replace(/\s+/g, '').toLowerCase();
        document.getElementById('roundSelector').style.backgroundColor = colors[colorKey];
    }

    document.getElementById('roundSelector').addEventListener('click', function() {
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    changeRound('Group Stage');
});
