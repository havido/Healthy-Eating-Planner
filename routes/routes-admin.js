const express = require('express');
const appService = require('../appService');

const router = express.Router();

router.post('/admin-get-all-users', async (req, res) => {
	if (!req.body) {
		res.status(500).json({ success: false });
	}
	// fail if body does not have userID key and value
	if (!req.body.hasOwnProperty('USERID') || !req.body.USERID || Object.keys(req.body).length > 1) {
		res.status(500).json({ success: false });
	}

	const allUsersResult = await appService.joinAllUserTables()
	if (!allUsersResult || !allUsersResult.metaData) {
		throw new Error("No data returned or invalid query");
	}
	const allUsersResultAttrs = allUsersResult.metaData.map(col => col.name);
	const allUsersJsonData = allUsersResult.rows.map(row => {
		let rowObject = {};
		allUsersResultAttrs.forEach((col, index) => {
			if (index == 6 || index == 7 || index == 9 || index == 11) {
				return
			}
			rowObject[col] = row[index];
		});
		return rowObject;
	});

	res.json({ success: true, data: allUsersJsonData });
	return;
});

router.post('/admin-delete-user', async (req, res) => {
	if (!req.body) {
		res.status(500).json({ success: false });
	}
	// fail if body does not have userID key and value
	if (!req.body.hasOwnProperty('USERID') || !req.body.USERID || Object.keys(req.body).length > 1) {
		res.status(500).json({ success: false });
	}

	const condition_dict = req.body
	const deleteResult = await appService.deleteFromTable('USER2', condition_dict);
	if (deleteResult) {
		res.json({ success: true });
	} else {
		res.status(500).json({ success: false });
	}
});


router.post('/admin-filter-users', async (req, res) => {
	if (!req.body) {
		res.status(500).json({ success: false });
	}
	// fail if body does not have userID key and value
	if (!req.body.hasOwnProperty('USERID') || !req.body.USERID || Object.keys(req.body).length > 2) {
		res.status(500).json({ success: false });
	}

	const filterResult = await appService.filterUserTablesUsingAttrs(req.body.QUERY);

	if (!filterResult || !filterResult.metaData) {
		throw new Error("No data returned or invalid query");
	}

	const filterResultAttrs = filterResult.metaData.map(col => col.name);
	const filterResultJsonData = filterResult.rows.map(row => {
		let rowObject = {};
		filterResultAttrs.forEach((col, index) => {
			rowObject[col] = row[index];
		});
		return rowObject;
	});

	res.json({ success: true, data: filterResultJsonData });
});



module.exports = router;