// Logs in the user by sending a request to the backend with the username
async function getUserInfo() {
	// Retrieve the userID from local storage
	const userID = localStorage.getItem('LocalStorage-userID');

	const response = await fetch('/user-info', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			USERID: userID
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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
	getUserInfo();
};
