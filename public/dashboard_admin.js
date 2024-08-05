

// Retrieve the userID from local storage
const g_userID = localStorage.getItem('LocalStorage-userID').trim();

// Logs in the user by sending a request to the backend with the username
async function getUserInfo() {


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

	console.log('Generating users table...');

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
	console.log('Response:', response);

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
			return;}

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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
	getUserInfo();
	generateUsersTable();
};
