const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";

async function fetchData(sheetName, range = '') {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

async function displayClubDetails() {
    const studioName = getParameterByName('studio');
    const data = await fetchData('Studios', '!A:L');
    const studioRow = data.find(row => row[0] === studioName);
    if (studioRow) {
        const clubDetailsContainer = document.getElementById('clubDetails');
        const details = {
            'Table Money': studioRow[8], // Column I
            'Credits': studioRow[11], // Column L
            'Goods': studioRow[9], // Column J
            'Received': studioRow[10] // Column K
        };
        Object.entries(details).forEach(([label, value]) => {
            const detailElement = document.createElement('p');
            detailElement.innerText = `${label}: ${value}`;
            clubDetailsContainer.appendChild(detailElement);
        });
    } else {
        console.error('Studio not found');
    }
}

async function createTableWisePerformanceGraph() {
    const studioName = getParameterByName('studio');
    const data = await fetchData('Tables');
    const filteredData = data.filter(row => row[2] === studioName);
    const tables = filteredData.map(row => row[4]); // Table Names (Column E)
    const performanceValues = filteredData.map(row => row[10]); // Performance Values (Column K)

    createGraph(performanceValues, tables, 'tableWisePerformanceChart', 'Table\'s Performance');
}

async function createDateWisePerformanceGraph(studioName) {
    const data = await fetchData('Studios');
    const studioRow = await findStudioRow(studioName, data);
    if (studioRow === -1) {
        console.log('Studio not found.');
        return;
    }
    const dates = data[studioRow].slice(13, 47); // Extract dates from row 2 (index 1)
    const performanceData = await fetchDateWisePerformanceData(studioRow, data);
    createGraph(performanceData, dates, 'dateWisePerformanceChart', 'Date-wise Performance');
}

async function createDateWisePerformanceGraph() {
    const data = await fetchData('club2', '!A:D'); // Fetching data from columns A, C, and D
    const dates = data.map(row => row[0]);
    const occupancy = data.map(row => row[2]);
    const dayOfWeek = data.map(row => row[3]); // Column D data

    // Prepare datasets for maximum and average values
    const maxValues = [];
    const avgValues = [];
    const barColorsMax = [];
    const barColorsAvg = [];

    dates.forEach((date, index) => {
        if (!isNaN(date) && dayOfWeek[index] === 'Max') {
            maxValues.push(occupancy[index]); // Maximum value
            avgValues.push(date); // Average value (from the date column)
            barColorsMax.push('#A0A0A0'); // Grey color for maximum
            barColorsAvg.push('#2196F3'); // Blue color for average
        } else {
            maxValues.push(occupancy[index]); // Regular value
            avgValues.push(null); // No average value
            barColorsMax.push(dayOfWeek[index] === 'Sunday' ? '#F6AE2D' : '#01AB7A'); // Color based on day
            barColorsAvg.push('rgba(0,0,0,0)'); // Transparent for average
        }
    });

    createDualGraph(maxValues, avgValues, dates, 'dateWisePerformanceChart', 'Club Performance', barColorsMax, barColorsAvg);
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



function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.onload = function() {
    displayClubDetails();
    createTableWisePerformanceGraph();
    createDateWisePerformanceGraph();
};
