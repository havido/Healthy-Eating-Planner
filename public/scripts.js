/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// Logs in the user by sending a request to the backend with the username
async function login() {
    const messageElement = document.getElementById('loginResultMsg');
    messageElement.textContent = "";

    const userID = document.getElementById('userID').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: userID
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        localStorage.setItem('LocalStorage-userID', userID);
        messageElement.textContent = "Login successful!";

        // TODO: if user is admin display all users table and meals and stuff
        // if user is not admin display only his dashboard page
        // Redirect to dashboard.html after successful login
        if (responseData.isAdmin) {
            window.location.href = 'dashboard_admin.html';
        } else {
        window.location.href = 'dashboard.html';
        }
    } else {
        messageElement.textContent = "Login failed!";
    }
}

// ======================= Update Processed Food Function =================================

// Deals with the table 
async function fetchAndDisplayProcessedFoods() {
    const tableElement = document.getElementById('processedFoodTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-processed-foods', {
        method: 'GET'
    });

    const responseData = await response.json();
    const processedFoods = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    processedFoods.forEach(food => {
        const row = tableBody.insertRow();
        food.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Updates description
async function updateDescription(event) {
    event.preventDefault();

    const foodId = document.getElementById('foodId').value;
    const userDescript = document.getElementById('userDescript').value;

    const response = await fetch('/update-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: foodId,
            description: userDescript
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateDescriptionResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Description updated successfully!";
        fetchTableData(); 
    } else {
        messageElement.textContent = "Error updating description!";
    }
}

// Updates Units
async function updateUnit(event) {
    event.preventDefault();

    const foodId = document.getElementById('foodId').value;
    const pfUnit = document.getElementById('pfUnit').value;

    const response = await fetch('/update-unit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: foodId,
            unit: pfUnit
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateUnitResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Unit updated successfully!";
        fetchTableData(); 
    } else {
        messageElement.textContent = "Error updating unit!";
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);

    // New Event Listeners:
    document.getElementById('userDescriptUpdate').addEventListener('submit', updateDescription);
    document.getElementById('updateUnits').addEventListener('submit', updateUnit);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayProcessedFoods();
}
