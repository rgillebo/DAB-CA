function populateDatabase() {
    // Disable the button to prevent multiple clicks
    document.querySelector('.btn-info').disabled = true;

    fetch('/populate', {
      method: 'POST',
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Error populating database. Please try again.');
        // Re-enable the button in case the user wants to try again
        document.querySelector('.btn-info').disabled = false;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error populating database. Please try again.');
      // Re-enable the button in case the user wants to try again
      document.querySelector('.btn-info').disabled = false;
    });
}

function sqlQuery1() {
  fetchAndPopulateData('/animals/popularAnimalNames');
}

function fetchAndPopulateData(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('.list-group'); 

        tableBody.innerHTML = `
          <!-- Query buttons preserved -->
          <div class="row px-3 py-1 w-100 text-center">
            <span class="col py-1 bg-light"><button class="btn-sm btn-success" onclick="sqlQuery1()">Popular Animal Names</button></span>
            <span class="col py-1 bg-light"><button class="btn-sm btn-success" onclick="sqlQuery2()">All Adoption Details</button></span>
            <span class="col py-1 bg-light"><button class="btn-sm btn-success" onclick="sqlQuery3()">Animals By Age</button></span>
            <span class="col py-1 bg-light"><button class="btn-sm btn-success" onclick="sqlQuery4()">Animals Born In Date Range</button></span>
            <span class="col py-1 bg-light"><button class="btn-sm btn-warning" onclick="allAnimals()">All Animals</button></span>
          </div>
          <!-- Table Headers manually added -->
          <div class="row px-3 py-1 w-100">
          <span class="col py-1 bg-noroff">Count</span>
            <span class="col py-1 bg-noroff">Name</span>
            <span class="col py-1 bg-noroff">Options</span>
          </div>
        `;

        data.forEach(animal => {
            const row = document.createElement('div');
            row.classList.add('row', 'px-3', 'py-1', 'w-100');
            row.innerHTML = `
                <span class="col py-1 bg-light">${animal.popularity}</span>
                <span class="col py-1 bg-light">${animal.name}</span>
                <span class="col py-1 bg-light text-center">Press "All Animals" to display more options</span>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function sqlQuery2() {
  fetchAdoptedAnimals('/animals/adoptedAnimals');
}

function fetchAdoptedAnimals() {
  fetch('/animals/adoptedAnimals')
      .then(response => response.json())
      .then(adoptedAnimals => {
          const tableBody = document.querySelector('.list-group');

          tableBody.innerHTML = `
              <!-- Query buttons preserved -->
              <div class="row px-3 py-1 w-100 text-center">
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery1()">Popular Animal Names</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery2()">All Adoption Details</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery3()">Animals By Age</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery4()">Animals Born In Date Range</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-warning" onclick="allAnimals()">All Animals</button></span>
              </div>
              <!-- Table Headers manually added -->
              <div class="row px-3 py-1 w-100">
                <span class="col py-1 bg-noroff">Id</span>
                <span class="col py-1 bg-noroff">Name</span>
                <span class="col py-1 bg-noroff">Species</span>
                <span class="col py-1 bg-noroff">Birthday</span>
                <span class="col py-1 bg-noroff">Temperament</span>
                <span class="col py-1 bg-noroff">Size</span>
                <span class="col py-1 bg-noroff">Age</span>
                <span class="col py-1 bg-noroff">Adopted</span>
                <span class="col py-1 bg-noroff">Options</span>
              </div>
          `;

          adoptedAnimals.forEach(animal => {
            // Process the Temperaments to a string
            let temperamentDescriptions = "None"; 
            if (animal.Temperaments && animal.Temperaments.length > 0) {
                temperamentDescriptions = animal.Temperaments.map(t => t.description).join(", ");
            }

            const rowHtml = `
                <div class="row px-3 py-1 w-100">
                    <span class="col py-1 bg-light">${animal.id}</span>
                    <span class="col py-1 bg-light">${animal.name}</span>
                    <span class="col py-1 bg-light">${animal.Species.name}</span>
                    <span class="col py-1 bg-light">${animal.birthday}</span>
                    <span class="col py-1 bg-light">${temperamentDescriptions}</span> <!-- Updated to use variable -->
                    <span class="col py-1 bg-light">${animal.size}</span>
                    <span class="col py-1 bg-light">${calculateAge(animal.birthday)}</span>
                    <span class="col py-1 bg-light">${animal.adopted ? 'Yes' : 'No'}</span>
                    <span class="col py-1 bg-light text-center">Press "All Animals" to display more options</span>
                </div>
            `;
            tableBody.innerHTML += rowHtml;
        });
    })
    .catch(error => console.error('Error fetching adopted animals:', error));
}


function sqlQuery3() {
  fetchAnimalsByAge('/animals/animalsByAge');
}

function fetchAnimalsByAge() {
  fetch('/animals/animalsByAge')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.querySelector('.list-group');

          tableBody.innerHTML = `
              <!-- Query buttons preserved -->
              <div class="row px-3 py-1 w-100 text-center">
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery1()">Popular Animal Names</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery2()">All Adoption Details</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery3()">Animals By Age</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery4()">Animals Born In Date Range</button></span>
                <span class="col py-1 bg-light "><button class="btn-sm btn-warning" onclick="allAnimals()">All Animals</button></span>
              </div>
              <!-- Table Headers manually added -->
              <div class="row px-3 py-1 w-100">
                <span class="col py-1 bg-noroff">Id</span>
                <span class="col py-1 bg-noroff">Name</span>
                <span class="col py-1 bg-noroff">Species</span>
                <span class="col py-1 bg-noroff">Birthday</span>
                <span class="col py-1 bg-noroff">Temperament</span>
                <span class="col py-1 bg-noroff">Size</span>
                <span class="col py-1 bg-noroff">Age</span>
                <span class="col py-1 bg-noroff">Adopted</span>
                <span class="col py-1 bg-noroff">Options</span>
              </div>
          `;

          data.forEach(animal => {
            // Process the Temperaments to a string
            let temperamentDescriptions = "None";
            if (animal.Temperaments && animal.Temperaments.length > 0) {
                temperamentDescriptions = animal.Temperaments.map(t => t.description).join(", ");
            }

            const rowHtml = `
                <div class="row px-3 py-1 w-100">
                    <span class="col py-1 bg-light">${animal.id}</span>
                    <span class="col py-1 bg-light">${animal.name}</span>
                    <span class="col py-1 bg-light">${animal.Species.name}</span>
                    <span class="col py-1 bg-light">${animal.birthday}</span>
                    <span class="col py-1 bg-light">${temperamentDescriptions}</span> <!-- Updated to use variable -->
                    <span class="col py-1 bg-light">${animal.size}</span>
                    <span class="col py-1 bg-light">${calculateAge(animal.birthday)}</span>
                    <span class="col py-1 bg-light">${animal.adopted ? 'Yes' : 'No'}</span>
                    <span class="col py-1 bg-light text-center">Press "All Animals" to display more options</span>
                </div>
            `;
            tableBody.innerHTML += rowHtml;
        });
    })
    .catch(error => console.error('Error fetching adopted animals:', error));
}

function sqlQuery4() {
  // Prompt user for start and end dates
  const startDate = prompt('Enter start date (YYYY-MM-DD):', '');
  const endDate = prompt('Enter end date (YYYY-MM-DD):', '');

  // Check if both dates are provided
  if (!startDate || !endDate) {
      alert("You must enter both a start and end date.");
      return; // Exit if not both dates are provided
  }

  // Construct the URL with query parameters
  const url = `/animals/animalsByDateRange?startDate=${startDate}&endDate=${endDate}`;

  // Call the function to fetch and populate the table based on the date range
  fetchAnimalsByDateRange(url);
}


function fetchAnimalsByDateRange(url) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          const tableBody = document.querySelector('.list-group');
          tableBody.innerHTML = `
              <!-- Keep the query buttons and table headers -->
              <div class="row px-3 py-1 w-100 text-center">
                  <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery1()">Popular Animal Names</button></span>
                  <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery2()">All Adoption Details</button></span>
                  <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery3()">Animals By Age</button></span>
                  <span class="col py-1 bg-light "><button class="btn-sm btn-success" onclick="sqlQuery4()">Animals Born In Date Range</button></span>
                  <span class="col py-1 bg-light "><button class="btn-sm btn-warning" onclick="allAnimals()">All Animals</button></span>
              </div>
              <div class="row px-3 py-1 w-100">
                  <span class="col py-1 bg-noroff">Id</span>
                  <span class="col py-1 bg-noroff">Name</span>
                  <span class="col py-1 bg-noroff">Species</span>
                  <span class="col py-1 bg-noroff">Birthday</span>
                  <span class="col py-1 bg-noroff">Temperament</span>
                  <span class="col py-1 bg-noroff">Size</span>
                  <span class="col py-1 bg-noroff">Age</span>
                  <span class="col py-1 bg-noroff">Adopted</span>
                  <span class="col py-1 bg-noroff">Options</span>
              </div>
          `;
          data.forEach(animal => {
              let temperamentDescriptions = "None";
              if (animal.Temperaments && animal.Temperaments.length > 0) {
                  temperamentDescriptions = animal.Temperaments.map(t => t.description).join(", ");
              }

              const age = calculateAge(animal.birthday);
              const adoptedText = animal.adopted ? 'Yes' : 'No';
              const speciesName = animal.Species ? animal.Species.name : 'Unknown';

              const rowHtml = `
                  <div class="row px-3 py-1 w-100">
                      <span class="col py-1 bg-light">${animal.id}</span>
                      <span class="col py-1 bg-light">${animal.name}</span>
                      <span class="col py-1 bg-light">${speciesName}</span>
                      <span class="col py-1 bg-light">${animal.birthday}</span>
                      <span class="col py-1 bg-light">${temperamentDescriptions}</span>
                      <span class="col py-1 bg-light">${animal.size}</span>
                      <span class="col py-1 bg-light">${age}</span>
                      <span class="col py-1 bg-light">${adoptedText}</span>
                      <span class="col py-1 bg-light text-center">Press "All Animals" to display more options</span>
                  </div>
              `;
              tableBody.innerHTML += rowHtml;
          });
      })
      .catch(error => {
          console.error('Error fetching animals by date range:', error);
          alert('Failed to fetch animals by date range.');
      });
}


function sqlQuery5() {
  fetch('/animals/animalsPerSize')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          let alertMessage = 'Number of Animals Per Size:\n';
          data.forEach(sizeData => {
              alertMessage += `${sizeData.size}: ${sizeData.numberOfAnimals}\n`;
          });
          alert(alertMessage);
      })
      .catch(error => console.error('Error:', error));
}

function allAnimals() {
  window.location.href = '/animals';
}

// Utility function to calculate age
function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}




