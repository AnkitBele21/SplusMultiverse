document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
    const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
    const SHEET_NAME = 'Matches';

    async function fetchData(round) {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
        const data = await response.json();
        return data.values.filter(match => match[1] === round);
    }

    window.displayRoundData = async function(round) {
        const data = await fetchData(round);
        const roundContainer = document.querySelector('.row');
        roundContainer.innerHTML = '';
        data.forEach(match => {
            const matchCard = createMatchCard(match);
            roundContainer.appendChild(matchCard);
        });
        updateCurrentRoundIndicator(round);
        updateRoundSelectorColor(round);
        toggleDropdown(); // Hide dropdown after selection
    }

    function createMatchCard(match) {
        // Implementation remains the same as previously provided
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
            'groupStage': '#28a745', // Green
            'knockout': '#964b00', // Brown
            'quarterFinals': '#0000ff', // Blue
            'semiFinals': '#ff69b4', // Pink
            'finals': '#000000' // Black
        };
        const roundSelector = document.getElementById('roundSelector');
        roundSelector.style.backgroundColor = colors[round];
    }

    function toggleDropdown() {
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }

    // Initial display for Group Stage
    displayRoundData('groupStage');
});
