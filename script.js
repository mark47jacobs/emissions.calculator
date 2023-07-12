// Wait for the DOM to be loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Get the upload form and attach a submit event handler
  var uploadForm = document.getElementById('uploadForm');
  uploadForm.addEventListener('submit', handleFormSubmit);
});

// Event handler for form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get the selected file from the input field
  var fileInput = document.getElementById('csvFileInput');
  var file = fileInput.files[0];

  if (file) {
    // Read the contents of the file
    var reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(file);
  }
}

// Event handler for file load
function handleFileLoad(event) {
  // Extract the CSV data from the file
  var csvData = event.target.result;
  var parsedData = parseCSV(csvData);

  // Calculate the emissions based on the parsed CSV data
  var emissions = calculateEmissions(parsedData);

  // Display the calculated emissions
  displayEmissions(emissions);
}

// Function to parse CSV data into a structured format
function parseCSV(csvData) {
  var lines = csvData.split('\n');
  var parsedData = [];

  // Iterate over each line of the CSV data
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();

    // Check if the line is not empty
    if (line) {
      // Split the line into individual values
      var row = line.split(',');

      // Add the row to the parsed data array
      parsedData.push(row);
    }
  }

  // Return the parsed data
  return parsedData;
}

// Function to calculate emissions based on the parsed CSV data
function calculateEmissions(data) {
  // Initialize emissions object with scope-specific totals
  var emissions = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
    scope4: 0,
    scope5: 0
  };

  // Iterate over each data row
  for (var i = 0; i < data.length; i++) {
    // Extract individual data values from the row
    var coalConsumption = parseFloat(data[i][0]);
    var biomassConsumption = parseFloat(data[i][1]);
    var electricityConsumption = parseFloat(data[i][2]);
    var roadLogisticsIncoming = parseFloat(data[i][3]);
    var roadLogisticsOutgoing = parseFloat(data[i][4]);

    // Calculate emissions for each scope and accumulate the totals
    emissions.scope1 += coalConsumption * 2.93; // Assuming emission factor of 2.93 CO2e per ton of coal
    emissions.scope2 += biomassConsumption * 1.54; // Assuming emission factor of 1.54 CO2e per ton of biomass
    emissions.scope2 += electricityConsumption * 0.45; // Assuming emission factor of 0.45 CO2e per MWh of electricity
    emissions.scope3 += roadLogisticsIncoming * 0.0000136; // Assuming emission factor of 0.0000136 CO2e per ton-km for incoming logistics
    emissions.scope3 += roadLogisticsOutgoing * 0.0000136; // Assuming emission factor of 0.0000136 CO2e per ton-km for outgoing logistics
    emissions.scope4 += coalConsumption * 3.1; // Assuming emission factor of 3.1 CO2e per ton of coal for Scope 4
    emissions.scope5 += electricityConsumption * 0.31; // Assuming emission factor of 0.31 CO2e per MWh of electricity for Scope 5
  }

  // Return the calculated emissions
  return emissions;
}

// Function to display the calculated emissions
function displayEmissions(emissions) {
  // Retrieve the DOM elements for each emissions scope
  var scope1Element = document.getElementById('emissionsScope1');
  var scope2Element = document.getElementById('emissionsScope2');
  var scope3Element = document.getElementById('emissionsScope3');
  var scope4Element = document.getElementById('emissionsScope4');
  var scope5Element = document.getElementById('emissionsScope5');

  // Update the content of each emissions scope element with the calculated values
  scope1Element.textContent = 'Scope 1: ' + emissions.scope1.toFixed(2) + ' tons CO2e';
  scope2Element.textContent = 'Scope 2: ' + emissions.scope2.toFixed(2) + ' tons CO2e';
  scope3Element.textContent = 'Scope 3: ' + emissions.scope3.toFixed(2) + ' tons CO2e';
  scope4Element.textContent = 'Scope 4: ' + emissions.scope4.toFixed(2) + ' tons CO2e';
  scope5Element.textContent = 'Scope 5: ' + emissions.scope5.toFixed(2) + ' tons CO2e';

  // Show the emissions container
  document.getElementById('emissionsContainer').style.display = 'block';
}
