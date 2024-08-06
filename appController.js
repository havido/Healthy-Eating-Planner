const express = require('express');
const appService = require('./appService');

const router = express.Router();

// Import the admin router
const adminRouter = require('./routes/routes-admin');
router.use(adminRouter);


// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

router.post("/login", async (req, res) => {
    if (!req.body) {
        res.status(500).json({ success: false });
    }

    attrs = Object.keys(req.body) // gives the attributes of the DB table
    values = Object.values(req.body) // gives the values of those attributes

    // we only expect the userID and NO password (for now)
    if (attrs.length > 1 || values.length > 1) {
        res.status(500).json({ success: false });
    }

    selected_attr = attrs
    condition_dict = req.body

    // try to find the user in the USER2 table first
    const isUserFound = await appService.readRowsWithValuesFromTable('REGULARUSER', selected_attr, condition_dict);
    if (isUserFound.length > 0) {
        res.json({ success: true, isAdmin: false })
        return
    }

    // if the user is not found in the USER2 table, try to find it in the ADMINAPP table
    const isAdminFound = await appService.readRowsWithValuesFromTable('ADMINAPP', selected_attr, condition_dict);
    if (isAdminFound) {
        res.json({ success: true, isAdmin: true })
        return
    }

    // if the user is not found in the USER2 table or the ADMINAPP table, return false
    res.status(500).json({ success: false });

});

router.post('/user-info', async (req, res) => {

    if (!req.body) {
        res.status(500).json({ success: false });
    }
    // fail if body does not have userID key and value
    if (!req.body.hasOwnProperty('USERID') || !req.body.USERID || Object.keys(req.body).length > 1) {
        res.status(500).json({ success: false });
    }
    condition_dict = req.body
    const result = await appService.readRowsWithValuesFromTable('USER2', ['*'], condition_dict);
    res.json({ success: true, data: result })
    return
});


// ======================================= Update Food =================================================

router.get('/get-processed-foods', async (req, res) => {
    try {
        const tableContent = await appService.fetchTableFromDb('ProcessedFood');
        res.json({ data: tableContent });
    } catch (error) {
        console.error('Error fetching processed foods:', error);
        res.status(500).json({ success: false });
    }
});

router.post("/update-processed-food", async (req, res) => {
    const { productName, brand, unit, description } = req.body;
    const updateResult = await appService.updateProcessedFood(productName, brand, unit, description);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// ----------------- Dealing with now instead of the regular user stuff. ------------------

router.post("/insert-regular-user", async (req, res) => {

    const { userID, subscriptionType, username, age, gender, height, weight } = req.body;

    const insertResult = await appService.insertIntoRegularUserTable(userID, username, subscriptionType, age, gender, height, weight);

    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// ======================= Insert User Function =================================
// ======================= Insert User Function =================================
// ======================= Insert User Function =================================
// ======================= Insert User Function ================================= !!!!!


router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

module.exports = router;