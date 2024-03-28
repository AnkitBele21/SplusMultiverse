const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";

async function fetchData(sheetName, range = '') {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

async function displayClubDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const studioName = urlParams.get('studio');

    if (!studioName) {
        console.error("Studio name not found in the URL.");
        return;
    }

    try {
        const studiosData = await fetchData('Studios', '!A:F'); // Fetching data from columns A through F
        const studioRow = studiosData.find(row => row[0] === studioName);

        if (studioRow) {
            const clubDetailsContainer = document.getElementById('clubDetails');
            clubDetailsContainer.innerHTML = ""; // Clear existing details

            // Display club details
            const labels = ['Table Money', 'Received', 'Goods', 'Credit Balance'];
            const values = studioRow.slice(8, 12); // Data from columns I to L
            values.forEach((value, index) => {
                const detailElement = document.createElement('p');
                detailElement.innerText = `${labels[index]}: ${value}`;
                clubDetailsContainer.appendChild(detailElement);
            });
        } else {
            console.error("Studio not found in the Studios sheet.");
        }
    } catch (error) {
        console.error("Error fetching club details:", error);
        alert("An error occurred while fetching club details. Please try again later.");
    }
}

function createGraph(data, labels, canvasId, graphTitle, backgroundColors) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: graphTitle,
                data: data,
                backgroundColor: backgroundColors || '#01AB7A', // Use provided colors or default color
                borderColor: '#018a5e',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    display: canvasId !== 'dateWisePerformanceChart' // Hide axis for 'dateWisePerformanceChart'
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Details for ${labels[context[0].dataIndex]}`;
                        }
                    }
                }
            },
            title: {
                display: true,
                text: graphTitle,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                color: '#01AB7A'
            }
        }
    });
}

async function createTableWisePerformanceGraph() {
    const urlParams = new URLSearchParams(window.location.search);
    const studioName = urlParams.get('studio');

    if (!studioName) {
        console.error("Studio name not found in the URL.");
        return;
    }

    try {
        const tablesData = await fetchData('Tables', '!C:K'); // Fetching data from columns C to K
        const studioTables = tablesData.filter(row => row[2] === studioName);
        
        if (studioTables.length > 0) {
            const tables = studioTables.map(row => row[4]); // Table names from column E
            const performance = studioTables.map(row => row[10]); // Performance from column K

            // Set bar colors based on performance status
            const barColors = performance.map(value => value === '1' ? '#01AB7A' : '#CCCCCC');

            createGraph(performance, tables, 'tableWisePerformanceChart', 'Table\'s Performance', barColors);
        } else {
            console.error("No tables found for the studio.");
        }
    } catch (error) {
        console.error("Error creating table-wise performance graph:", error);
        alert("An error occurred while creating the table-wise performance graph. Please try again later.");
    }
}

async function createDateWisePerformanceGraph() {
    const urlParams = new URLSearchParams(window.location.search);
    const studioName = urlParams.get('studio');

    if (!studioName) {
        console.error("Studio name not found in the URL.");
        return;
    }

    try {
        const studiosData = await fetchData('Studios', '!A:AR'); // Fetching data from columns A through AR
        const studioRow = studiosData.find(row => row[0] === studioName);

        if (studioRow) {
            const dates = studiosData[1].slice(14); // Dates from column O to AR in the second row
            const occupancy = studioRow.slice(14); // Occupancy data from column O to AR

            // Prepare datasets for maximum and average values
            const maxValues = [];
            const avgValues = [];
            const barColorsMax = [];
            const barColorsAvg = [];

            occupancy.forEach((value, index) => {
                if (!isNaN(value)) {
                    maxValues.push(value); // Maximum value
                    avgValues.push(null); // No average value
                    barColorsMax.push(dates[index] === 'Sunday' ? '#F6AE2D' : '#01AB7A'); // Color based on day
                    barColorsAvg.push('rgba(0,0,0,0)'); // Transparent for average
                }
            });

            createDualGraph(maxValues, avgValues, dates, 'dateWisePerformanceChart', 'Club Performance', barColorsMax, barColorsAvg);
        } else {
            console.error("Studio not found in the Studios sheet.");
        }
    } catch (error) {
        console.error("Error creating date-wise performance graph:", error);
        alert("An error occurred while creating the date-wise performance graph. Please try again later.");
    }
}

function createDualGraph(maxData, avgData, labels, canvasId, graphTitle, backgroundColorsMax, backgroundColorsAvg) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Maximum',
                data: maxData,
                backgroundColor: backgroundColorsMax
            }, {
                label: 'Average',
                data: avgData,
                backgroundColor: backgroundColorsAvg
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Details for ${labels[context[0].dataIndex]}`;
                        }
                    }
                }
            },
            title: {
