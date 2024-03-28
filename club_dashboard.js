const API_KEY = "AIzaSyC8Vuysinrwm5ww5WPM5W-GxBnGm1pOUr8";
const SHEET_ID = "18Op0z2LfDIHV_o2vUNZxI1jMjZRvKQaiymMRNLzVrG4";

async function fetchData(sheetName, range = '') {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

async function displayClubDetails() {
    const clubName = getParameterByName('clubname');
    const data = await fetchData(clubName, '!H:I'); // Fetching data from columns H and I in the specified sheet
    const clubDetailsContainer = document.getElementById('clubDetails');
    data.forEach(([label, value]) => {
        const detailElement = document.createElement('p');
        detailElement.innerText = `${label}: ${value}`;
        clubDetailsContainer.appendChild(detailElement);
    });
}

async function createTableWisePerformanceGraph() {
    const clubName = getParameterByName('clubname');
    const data = await fetchData(clubName, '!A:F'); // Fetching data from columns A through F in the specified sheet
    const tables = data.map(row => row[0]);
    const occupancy = data.map(row => row[1]);
    const tableStatus = data.map(row => row[5]); // Column F data is now at index 5

    // Set bar colors based on table status
    const barColors = tableStatus.map(status => status === '1' ? '#01AB7A' : '#CCCCCC');

    createGraph(occupancy, tables, 'tableWisePerformanceChart', 'Table\'s Performance', barColors);
}

async function createDateWisePerformanceGraph() {
    const clubName = getParameterByName('clubname');
    const data = await fetchData(clubName, '!M:P'); // Fetching data from columns M, O, and P in the specified sheet
    const dates = data.map(row => row[0]);
    const occupancy = data.map(row => row[2]);
    const dayOfWeek = data.map(row => row[3]); // Column P data

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



// Rest of your code remains the same


window.onload = function() {
    displayClubDetails();
    createTableWisePerformanceGraph();
    createDateWisePerformanceGraph();
};
