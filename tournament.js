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
        roundContainer.innerHTML = ''; // Clear existing content

        data.forEach(match => {
            const matchCard = createMatchCard(match, round);
            roundContainer.appendChild(matchCard);
        });

        applyRoundStyles(round); // Apply styles after cards are displayed
    }

    function createMatchCard(match, round) {
        // Function body remains the same
    }

    function applyRoundStyles(round) {
        // Instead of changing individual card styles, add a class to the container
        const roundContainer = document.querySelector('.row');
        // Remove any existing round-specific class
        roundContainer.className = 'row'; // Reset to default class
        // Add new round-specific class
        roundContainer.classList.add(`round-${round}`);
    }

    function getRoundColor(round) {
        // Function body remains the same
    }

    displayRoundData('groupStage'); // Initial display

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const round = this.getAttribute('href').substring(1);
            displayRoundData(round);
        });
    });
});
