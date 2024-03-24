document.addEventListener('DOMContentLoaded', () => {
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
// Google Sheets ID
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";

    document.getElementById('studioManagerLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    function login() {
        const studioName = document.getElementById('studioName').value;
        const pin = document.getElementById('pin').value;

        if (!studioName || !pin) {
            alert('Please enter studio name and PIN');
            return;
        }

        fetchStudioInfo(studioName, pin);
    }

    function fetchStudioInfo(studioName, pin) {
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Studios?key=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const studioRow = data.values.find(row => row[5] === studioName && row[3] === pin);
                if (studioRow) {
                    const securityKey = studioRow[4]; // Security key is in column E
                    window.location.href = `clubframes.html?studio=${encodeURIComponent(studioName)}&security=${securityKey}`;
                } else {
                    alert('Invalid studio name or PIN. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('There was an error fetching the studio information.');
            });
    }
});


