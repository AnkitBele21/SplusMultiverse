document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
    const SHEET_NAME = 'Matches';

    async function fetchData(round) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
        const data = await response.json();
        return data.values.filter(match => match[1] === round);
    }

    async function displayRoundData(round) {
        const data = await fetchData(round);
        const roundContainer = document.querySelector('.row');
        roundContainer.innerHTML = '';
        data.forEach(match => {
            const matchCard = createMatchCard(match, round);
            roundContainer.appendChild(matchCard);
        });
        updateCurrentRoundIndicator(round);
    }

    function createMatchCard(match, round) {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card', 'h-100', 'p-3');

        const cardContent = `
            <h5 class="card-title">${match[2]} vs ${match[3]}</h5>
            <div class="card-text">
                Table: ${match[4]} | ${match[5]}, ${match[6]}<br>
                Winner: <strong>${match[7]}</strong><br>
                <a href="${match[8]}" target="_blank">Match Link</a>
            </div>
        `;

        cardBody.innerHTML = cardContent;
        card.appendChild(cardBody);

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
        document.getElementById('currentRoundText').textContent = roundNames[round] || 'Unknown Round';
    }

    displayRoundData('groupStage');

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const round = this.getAttribute('href').substring(1);
            displayRoundData(round);
            $('.dropdown-toggle').dropdown('hide'); // Hide dropdown after selection
        });
    });
});
