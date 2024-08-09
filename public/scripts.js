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
    // const statusElem = document.getElementById('dbStatus');
    // const loadingGifElem = document.getElementById('loadingGif');

    // const response = await fetch('/check-db-connection', {
    //     method: "GET"
    // });

    // // Hide the loading GIF once the response is received.
    // //loadingGifElem.style.display = 'none';
    // // Display the statusElem's text in the placeholder.
    // //statusElem.style.display = 'inline';

    // response.text()
    //     .then((text) => {
    //         statusElem.textContent = text;
    //     })
    //     .catch((error) => {
    //         statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    //     });
}


// Projection
async function fetchAllDBTables() {

    const tableSelect = document.getElementById('tableSelect');
    const response = await fetch('/tables', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tables = responseData.data;
    tableSelect.innerHTML = '';

    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        tableSelect.appendChild(option);
    });

    const option = document.createElement('option');
    option.value = '----';
    option.textContent = '----';
    option.selected = true;
    tableSelect.prepend(option);


}

async function updateAttributes() {

    const table = document.getElementById('tableSelect').value;
    const attributesDiv = document.getElementById('attributesCheckboxes');
    if (table === '----') {
        attributesDiv.innerHTML = '';
        return;
    }

    const response = await fetch(`/attributes?table=${table}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const attributes = responseData.data;

    console.log(attributes);

    attributesDiv.innerHTML = '';

    attributes.forEach(attr => {
        const label = document.createElement('label');
        label.textContent = attr;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'attributes';
        checkbox.value = attr;

        attributesDiv.appendChild(checkbox);
        attributesDiv.appendChild(label);
        attributesDiv.appendChild(document.createElement('br'));
    });
}


async function fetchProjection() {
    const table = document.getElementById('tableSelect').value;
    const attributes = Array.from(document.querySelectorAll('input[name="attributes"]:checked'))
        .map(cb => cb.value);

    const response = await fetch(`/projection?table=${table}&attributes=${attributes.join(',')}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const projectionTable = document.getElementById('projection');
    projectionTable.innerHTML = '';

    const headers = attributes;
    const data = responseData.data;

    // Create table headers
    const headerRow = projectionTable.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Create table rows
    data.forEach(row => {
        const tr = projectionTable.insertRow();
        row.forEach(cell => {
            const td = tr.insertCell();
            td.textContent = cell;
        });
    });
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
async function updateProcessedFood(event) {



    const productName = document.getElementById('productNameProcFood').value;
    const brand = document.getElementById('brandNameProcFood').value;
    const unit = document.getElementById('pfUnit').value;
    const description = document.getElementById('userDescript').value;

    if (unit === '' && description === '') {
        alert('Please enter a valid unit or description to update!');
        return
    }

    const response = await fetch('/update-processed-food', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: productName,
            brand: brand,
            unit: unit,
            description: description,
        })
    });

    const responseData = await response.json();

    updateProcessedFoodResultMsg = document.getElementById('updateProcessedFoodResultMsg');
    if (responseData.success) {
        updateProcessedFoodResultMsg.textContent = "Description updated successfully!";
        fetchAndDisplayProcessedFoods();
    } else {
        updateProcessedFoodResultMsg.textContent = "Error updating description!";
    }
}

// Count items for each brand (aggregation group by)
async function fetchCountProcessedFood() {
    const tableElement = document.getElementById('processedFoodTableCount');
    const tableBody = tableElement.querySelector('tbody');
    const brand = document.getElementById('brandNameCount').value.trim();

    const response = await fetch('/count-processed-foods', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            brand: brand
        })
    });
    // console.log('a');
    const responseData = await response.json();
    // console.log('b');
    console.log(responseData);
    const processedFoodTableCount = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (processedFoodTableCount.length === 0) {
        alert('Name does not match with any brand in database!');
        return;
    }

    processedFoodTableCount.forEach(brand => {
        const row = tableBody.insertRow();
        brand.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// ---------------- Regular User Part ------------------------


// Need to insert user present into regular user table
async function insertRegularUsertoTable(event) {
    const insetRegularUserID = document.getElementById('insertRegularUserID').value;
    if (!insetRegularUserID) {
        alert('Please enter a valid userID!');
        return
    }
    const username = document.getElementById('insertUsername').value;
    if (!username) {
        alert('Please enter a valid username!');
        return
    }
    const subscriptionType = document.getElementById('subscriptionType').value;
    if (!subscriptionType) {
        alert('Please enter a valid subscription type!');
        return
    }
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;


    const response = await fetch('/insert-regular-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: insetRegularUserID,
            subscriptionType: subscriptionType,
            username: username,
            age: age,
            gender: gender,
            height: height,
            weight: weight
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertRegularUserNewPart');

    if (responseData.success) {
        messageElement.textContent = "Regular user inserted successfully!";
    } else {
        messageElement.textContent = "Error inserting regular user!";
    }
    generateUsersTable();
}


// Retrieve the userID from local storage
const g_userID = localStorage.getItem('LocalStorage-userID')
if (g_userID === null || g_userID === '' || g_userID === undefined) {
    alert('Please login first!');
    window.location.href = '/index.html';
};

// Logs in the user by sending a request to the backend with the username
async function setUserGreeting() {


    const response = await fetch('/user-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: g_userID
        })
    });

    const responseData = await response.json();
    const welcomeMsgElement = document.getElementById('welcomeMsg');

    if (responseData.success && responseData.data.length > 0 && responseData.data[0].length > 1) {
        // Display the user info
        const data = responseData.data;
        welcomeMsgElement.innerHTML = 'Welcome, ' + data[0][1] + '!';
    } else {
        welcomeMsgElement.textContent = "Failed to get into!";
    }
}

async function generateUsersTable() {


    const tableHeaders = document.getElementById('userTableHeaders');
    const tableBody = document.getElementById('userTableBody');
    const response = await fetch('/admin-get-all-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: g_userID
        })
    });


    const responseData = await response.json();
    const allUsersData = responseData.data;

    if (tableHeaders) {
        tableHeaders.innerHTML = '';
    }
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    // Display the table headers
    const headerRow = tableHeaders.insertRow();
    if (allUsersData.length === 0) {
        alert('The users table in your DB is empty!');
        return;
    }
    const keys = Object.keys(allUsersData[0]);
    keys.forEach(key => {
        if (key.includes('_')) {
            return;
        }
        const cell = headerRow.insertCell();
        cell.textContent = key.toUpperCase();
    });


    // Display the table rows
    allUsersData.forEach(user => {
        const row = tableBody.insertRow();
        keys.forEach(key => {
            if (key.includes('_')) {
                return;
            }
            const cell = row.insertCell();
            const value = user[key];
            if (value === null) {
                cell.textContent = 'N/A'; // TODO might want to make N/A and empty string or ---
                return;
            }
            cell.textContent = user[key];
        });
    });

}


async function deleteUser() {
    const userIDElement = document.getElementById('deleteUserID');
    const userID = userIDElement.value.trim();

    if (!userID) {
        alert('Please enter a valid userID!');
        return
    }
    if (userID === g_userID) {
        alert('Cannot delete your own account!');
        return
    }

    const response = await fetch('/admin-delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: userID
        })
    });

    const responseData = await response.json();
    generateUsersTable();
    if (responseData.success) {
        alert('User deleted successfully!');
    } else {
        alert('Failed to delete user!');
    }

    userIDElement.value = '';
}

async function filterRows() {
    const conditions = [];

    var bad_key = false;
    document.querySelectorAll('.condition').forEach(condition => {
        const attribute = condition.querySelector('.attribute').value;
        const value = condition.querySelector('.value').value;
        const logical = condition.querySelector('.logical').value;

        // spacial case for empty PRIMARY KEY
        if (attribute === 'USERID' && value === '') {
            alert('Please enter a valid userID!');
            bad_key = true;
            return;
        }

        if (value === '' || value == 'N/A' || value.toUpperCase() == 'NULL') {
            conditions.push(`${attribute} IS NULL ${logical}`);
        } else {
            conditions.push(`${attribute}='${value}' ${logical}`);
        }
    });

    if (bad_key) {
        return;
    }

    const query = conditions.join(' ').replace(/\s*(AND|OR)\s*$/, ''); // Remove trailing AND/OR


    const response = await fetch('/admin-filter-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: g_userID,
            QUERY: query
        })
    });

    // Display the filtered users
    const responseData = await response.json();
    const allUsersData = responseData.data;

    const tableHeaders = document.getElementById('userTableHeaders');
    const tableBody = document.getElementById('userTableBody');
    if (tableHeaders) {
        tableHeaders.innerHTML = '';
    }
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    // Display the table headers
    const headerRow = tableHeaders.insertRow();
    if (allUsersData.length === 0) {
        alert('The filtering did not match anything in the database!');
        return;
    }
    const keys = Object.keys(allUsersData[0]);
    keys.forEach(key => {
        if (key.includes('_')) {
            return;
        }
        const cell = headerRow.insertCell();
        cell.textContent = key.toUpperCase();
    });

    // Display the table rows
    allUsersData.forEach(user => {
        const row = tableBody.insertRow();
        keys.forEach(key => {
            if (key.includes('_')) {
                return;
            }
            const cell = row.insertCell();
            const value = user[key];
            if (value === null) {
                cell.textContent = 'N/A'; // TODO might want to make N/A and empty string or ---
                return;
            }
            cell.textContent = user[key];
        });
    });

}


// ---------------- Division -------------------------------
async function generateLogDates() {

    const response = await fetch('/admin-get-all-log-datetimes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: g_userID,
        })


    });
    const responseData = await response.json();
    const dates = responseData.data;
    const logDatesDiv = document.getElementById('logDatesCheckboxes');
    logDatesDiv.innerHTML = '';

    dates.forEach(date_ => {
        const label = document.createElement('label');
        label.textContent = date_;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'logDates';
        checkbox.classList.add('logdate');

        checkbox.value = date_;

        logDatesDiv.appendChild(checkbox);
        logDatesDiv.appendChild(label);
        logDatesDiv.appendChild(document.createElement('br'));
    });

    // We don't need to generate the table here because we only have the dates here
    // and nothing is selected yet
    // generateTableForUsersWhoLogged()
}

async function generateTableForUsersWhoLogged() {
    const logDates = Array.from(document.querySelectorAll('input[name="logDates"]:checked'))
        .map(cb => cb.value);
    console.log(logDates);
    if (logDates.length === 0) {
        return;
    }
    const response = await fetch('/admin-get-all-users-who-logged', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            USERID: g_userID,
            DATES: logDates
        })
    });

    const responseData = await response.json();
    const allUsersData = responseData.data;

    const tableHeaders = document.getElementById('usersWhoLoggedOnTheseDatesHeaders');
    const tableBody = document.getElementById('usersWhoLoggedOnTheseDatesBody');
    if (tableHeaders) {
        tableHeaders.innerHTML = '';
    }
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    // Display the table headers
    const headerRow = tableHeaders.insertRow();
    if (allUsersData.length === 0) {
        alert('The filtering did not match anything in the database!');
        return;
    }
    const keys = Object.keys(allUsersData[0]);
    keys.forEach(key => {
        if (key.includes('_')) {
            return;
        }
        const cell = headerRow.insertCell();
        cell.textContent = key.toUpperCase();
    });

    // Display the table rows
    allUsersData.forEach(user => {
        const row = tableBody.insertRow();
        keys.forEach(key => {
            if (key.includes('_')) {
                return;
            }
            const cell = row.insertCell();
            const value = user[key];
            if (value === null) {
                cell.textContent = 'N/A'; // TODO might want to make N/A and empty string or ---
                return;
            }
            cell.textContent = user[key];
        });
    });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    const currentPath = window.location.pathname;

    if (g_userID === null || g_userID === '' || g_userID === undefined) {
        alert('Please login first!');
        window.location.href = '/index.html';
    }

    // for grating the user info
    setUserGreeting();

    if (currentPath === '/dashboard.html') {
        document.getElementById('updateProceedsFood').addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the form from submitting    
            updateProcessedFood();
        }); // GOOD

        fetchAndDisplayProcessedFoods();
    }

    if (currentPath === '/dashboard_admin.html') {
        fetchAllDBTables();
        generateLogDates();

        // Filter form
        document.getElementById('resetFilter').addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the form from submitting
            generateUsersTable(); // rest the table to original state

            // reset the filter form
            document.getElementById('filterForm').reset();


            // remove all conditions except the first one
            const conditions = document.getElementsByClassName('condition');
            while (conditions.length > 1) {
                conditions[conditions.length - 1].remove();
            }
        });
        // Delete user form
        document.getElementById('deleteUserForm').addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the form from submitting
            deleteUser(); // Call the login function
        });

        // Insert regular user form
        document.getElementById('insertRegularUserForm').addEventListener('submit', function (event) {
            event.preventDefault();
            insertRegularUsertoTable();
        });

        generateUsersTable();

        // Division on log dates
        let logDatesCheckboxesDiv = document.getElementById('logDatesCheckboxes');
        logDatesCheckboxesDiv.addEventListener('change', function (event) {
            if (event.target && event.target.type === 'checkbox' && event.target.classList.contains('logdate')) {
                generateTableForUsersWhoLogged();
            }
        });
    }
};
