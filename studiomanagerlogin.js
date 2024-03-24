// Google Sheets API Key
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
// Google Sheets ID
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
// Sheet name
const SHEET_NAME = "Studios";

function login() {
  const studioName = document.getElementById('studioName').value;
  const pin = document.getElementById('pin').value;

  const url = `${API_URL}${SHEET_ID}/values/Studios?key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const studioRow = data.values.find(row => row[5] === studioName);
      
      if (studioRow) {
        const storedPin = studioRow[3]; // Pin is in column D (index 3)

        if (pin === storedPin) {
          const securityKey = studioRow[4]; // Security key is in column E (index 4)
          window.location.href = `nextpage.html?security=${securityKey}`;
        } else {
          alert('Invalid PIN. Please try again.');
        }
      } else {
        alert('Studio name not found. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('An error occurred. Please try again later.');
    });
}

