// Logs in the user by sending a request to the backend with the username
async function login() {
	
	const messageElement = document.getElementById('loginResultMsg');
	messageElement.textContent = "";

	const userID = document.getElementById('userID').value.trim();

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