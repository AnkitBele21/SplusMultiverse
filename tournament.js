document.addEventListener('DOMContentLoaded', function () {
  const API_KEY = 'AIzaSyCfxg14LyZ1hrs18WHUuGOnSaJ_IJEtDQc';
  const SHEET_ID = '1JPEv5JyfQOluFCdrtVSMt1FADXTwOpKnLVDOCOVxMk8';
  const SHEET_NAME = 'Matches';

  // Function to fetch match data for a specific round
  async function fetchData(round) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:I?key=${API_KEY}`);
    const data = await response.json();
    return data.values.filter(match => match[1] === round); // Filter matches for the selected round
  }

  // Function to display match cards for a specific round
  async function displayRoundData(round) {
    const data = await fetchData(round);

    const roundContainer = document.querySelector('.row');
    roundContainer.innerHTML = ''; // Clear existing content

    data.forEach(match => {
      const matchCard = createMatchCard(match);
      roundContainer.appendChild(matchCard);
    });
  }

  // Function to create a match card
  function createMatchCard(match) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card', 'h-100');

    const cardContent = `
      <div class="card-body">
        <h5 class="card-title">Match ID: ${match[0]}</h5>
        <p class="card-text">Round: ${match[1]}</p>
        <p class="card-text">Players: ${match[2]} vs ${match[3]}</p>
        <p class="card-text">Table: ${match[4]}</p>
        <p class="card-text">Date & Time: ${match[5]}, ${match[6]}</p>
        <p class="card-text">Winner: ${match[7]}</p>
        <p class="card-text">Link: ${match[8]}</p>
      </div>
    `;

    cardBody.innerHTML = cardContent;
    card.appendChild(cardBody);

    return card;
  }

  // Initial display of the Group Stage
    displayRoundData('Group Stage');

  // Event listeners for navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const round = this.getAttribute('href').substring(1); // Extract round name from href
      displayRoundData(round);
    });
  });
});
