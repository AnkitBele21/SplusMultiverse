document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
    const SHEET_NAME = 'Matches';

    async function fetchData(round) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
        const data = await response.json();
        // Adjust for case sensitivity and ensure matching with sheet data
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
        const colorClass = round.replace(/\s+/g, '').toLowerCase(); // Convert round to a single word lowercase for CSS class
        const card = document.createElement('div');
        card.className = `card mb-3 ${colorClass}`;
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
            'groupstage': '#28a745',
            'knockout': '#964b00',
            'quarterfinals': '#0000ff',
            'semifinals': '#ff69b4',
            'finals': '#000000'
        };
        const colorClass = round.replace(/\s+/g, '').toLowerCase();
        document.getElementById('roundSelector').style.backgroundColor = colors[colorClass] || '#33363B'; // Default color if not matched
    }

    document.getElementById('roundSelector').addEventListener('click', function() {
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    changeRound('Group Stage'); // Initialize with the "Group Stage" round
});
