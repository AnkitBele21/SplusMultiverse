const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
const SHEET_NAME = 'Matches';
const ROUND_COLUMN_INDEX = 1; // Assuming Round information is in column B

async function fetchData(sheetName, range = '') {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Filter data based on selected round
    const selectedRound = 'Group Stage'; // Replace with actual selected round
    return data.values.filter(row => row[ROUND_COLUMN_INDEX] === selectedRound);
}

async function displayRoundData(round) {
    const data = await fetchData('Matches', '!A:I');
    const tabContent = document.getElementById(round);
    tabContent.innerHTML = data.map(match => `<p>${match.join(' | ')}</p>`).join('');
}

// Example: Display Group Stage matches on page load
displayRoundData('groupStage');
