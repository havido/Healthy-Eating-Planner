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
// ======================= Update Processed Food Function =================================
// ======================= Update Processed Food Function =================================
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

// Update description
async function updateDescription(event) {
    const productName = document.getElementById('productNameProcFoodDesc').value;
    const brand = document.getElementById('brandNameProcFoodDesc').value;
    const description = document.getElementById('userDescript').value;

    const response = await fetch('/update-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: productName,
            brand: brand,
            description: description
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


// Update the units (This works now as well.)
async function updateUnit(event) {
    const productName = document.getElementById('productNameProcFood').value;
    const brand = document.getElementById('brandNameProcFood').value;
    const unit = document.getElementById('pfUnit').value;

    const response = await fetch('/update-unit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: productName,
            brand: brand,
            unit: unit
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


// ======================= Update Processed Food Function =================================
// ======================= Update Processed Food Function =================================
// ======================= Update Processed Food Function =================================
// ======================= Update Processed Food Function ================================= !!!!!


// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function =================================

// Deals with the User2 table 
async function fetchAndDisplayUser2() {
    const tableElement = document.getElementById('user2Table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-user-2', {
        method: 'GET'
    });

    const responseData = await response.json();
    const users = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    users.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// Insert user into table:
async function insertUser2toTable(event) {
    const userID = document.getElementById('userID').value;
    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    const response = await fetch('/insert-user-2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            username: username,
            age: age,
            gender: gender,
            height: height,
            weight: weight
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertUser2NewPart');

    if (responseData.success) {
        messageElement.textContent = "User inserted successfully!";
        fetchAndDisplayUser2();
    } else {
        messageElement.textContent = "Error inserting user!";
    }
}


        // ---------------- Regular User Part ------------------------

// This is the regular table displayed.
async function fetchAndDisplayRegularUser() {
    const tableElement = document.getElementById('insertRegularUserTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/get-regular-user', {
        method: 'GET'
    });

    const responseData = await response.json();
    const regularUsers = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    regularUsers.forEach(regularUser => {
        const row = tableBody.insertRow();
        regularUser.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Need to insert user present into regular user table
async function insertRegularUsertoTable(event) {
    const regularUserID = document.getElementById('regularUserID').value;
    const subscriptionType = document.getElementById('subscriptionType').value;

    const response = await fetch('/insert-regular-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: regularUserID,
            subscriptionType: subscriptionType
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertRegularUserNewPart');

    if (responseData.success) {
        messageElement.textContent = "Regular user inserted successfully!";
        fetchAndDisplayRegularUser();
    } else {
        messageElement.textContent = "Error inserting regular user!";
    }
}



// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function =================================
// ======================= Insert Admin User Function ================================= !!!!!


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

    document.getElementById('insertUser2toTable').addEventListener('submit', insertUser2toTable);
    document.getElementById('insertRegularUsertoTable').addEventListener('submit', insertRegularUsertoTable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();


    fetchAndDisplayProcessedFoods();
    fetchAndDisplayUser2();
    fetchAndDisplayRegularUser();
}
