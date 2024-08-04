

// Retrieve the userID from local storage
const g_userID = localStorage.getItem('LocalStorage-userID');

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

	if (responseData.success) {
		// Display the user info
		const data = responseData.data;
		welcomeMsgElement.innerHTML = 'Welcome, ' + data[0][1] + '!';
	} else {
		messageElement.textContent = "Failed to get into!";
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
	const userID = document.getElementById('deleteUserID').value;

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
	if (responseData.success) {
		alert('User deleted successfully!');
	} else {
		alert('Failed to delete user!');
	}

	generateUsersTable();
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
	getUserInfo();
	generateUsersTable();
};
