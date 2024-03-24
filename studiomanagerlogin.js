// Google Sheets API Key
const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
// Google Sheets ID
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";
// Sheet name
const SHEET_NAME = "Studios";

// Function to fetch data from Google Sheets
async function fetchData(sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.values.slice(1);
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  // Get input values
  const studioName = document.getElementById("studioName").value.trim();
  const pin = document.getElementById("pin").value.trim();

  // Fetch data from Google Sheets
  fetchData(SHEET_NAME).then((data) => {
    // Find matching studio name and pin
    const studio = data.find((row) => row[5] === studioName && row[3] === pin);

    if (studio) {
      // Redirect to next page with security key
      const securityKey = studio[4];
      window.location.href = `clubframes.html?security=${securityKey}`;
    } else {
      // Display error message for invalid credentials
      alert("Invalid studio name or pin.");
    }
  });
}

// Event listener for form submission
document.getElementById("loginForm").addEventListener("submit", handleSubmit);
