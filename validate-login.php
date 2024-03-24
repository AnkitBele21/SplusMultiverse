<?php
// Load the Google Sheets API library
require __DIR__ . '/vendor/autoload.php';

use Google\Spreadsheet\DefaultServiceRequest;
use Google\Spreadsheet\ServiceRequestFactory;

// Set up Google Sheets API client
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . '/your-credentials-file.json');
$client = new Google_Client;
$client->useApplicationDefaultCredentials();
$client->setApplicationName("Your Application Name");
$client->setScopes(['https://www.googleapis.com/auth/drive', 'https://spreadsheets.google.com/feeds']);

// Initialize Sheets API service
$service = new Google_Service_Sheets($client);

// Fetch the studio name and pin from the URL
$studioName = $_GET['studioName'];
$pin = $_GET['pin'];

// Fetch data from the Studios spreadsheet
$spreadsheetId = 'YOUR_SPREADSHEET_ID';
$range = 'Studios!F:D';
$response = $service->spreadsheets_values->get($spreadsheetId, $range);
$values = $response->getValues();

// Find the row where studio name and pin match
$securityKey = null;
foreach ($values as $row) {
    if ($row[0] == $studioName && $row[1] == $pin) {
        $securityKey = $row[2]; // Security Key is in Column E
        break;
    }
}

if ($securityKey) {
    // Redirect to the main page with the generated URL
    $url = "https://ankitbele21.github.io/SplusMultiverse/clubframes?studio=$studioName&security=$securityKey";
    header("Location: $url");
    exit();
} else {
    // Redirect back to the login page with an error message
    header("Location: login.html?error=1");
    exit();
}
?>
