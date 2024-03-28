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

async function fetchDateWisePerformanceData(studioRow, data) {
    const performanceData = data[studioRow].slice(13, 47); // Extract performance data from corresponding row
    return performanceData;
}



function createGraph(data, labels, canvasId, graphTitle) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: graphTitle,
                data: data,
                backgroundColor: '#01AB7A',
                borderColor: '#018a5e',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    display: true
                }
            },
            plugins: {
                legend: {
                    display: false
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

function createDualGraph(maxData, avgData, labels, canvasId, graphTitle) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Maximum',
                data: Array(labels.length).fill(maxData),
                backgroundColor: '#A0A0A0'
            }, {
                label: 'Average',
                data: Array(labels.length).fill(avgData),
                backgroundColor: '#2196F3'
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
