const express = require('express');
const appService = require('./appService');

const router = express.Router();

const LOGGIN = true

function log1(s) {
    if (LOGGIN) {
        console.log(s)
    }
}

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
        res.json({ success: true, isAdmin: false})
        return
    }

    // if the user is not found in the USER2 table, try to find it in the ADMINAPP table
    const isAdminFound = await appService.readRowsWithValuesFromTable('ADMINAPP', selected_attr, condition_dict);
    if (isAdminFound) {
        res.json({ success: true, isAdmin: true})
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

    const result = await appService.readRowsWithValuesFromTable('USER2', ['*'], condition_dict);
    res.json({ success: true, data: result })
    return
});

// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
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

router.post("/update-description", async (req, res) => {
    const { productName, brand, description } = req.body;
    const updateResult = await appService.updateDescription('ProcessedFood', productName, brand, description);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-unit", async (req, res) => {
    const { productName, brand, unit } = req.body;
    const updateResult = await appService.updateUnit('ProcessedFood', productName, brand, unit);
    if (updateResult) {
        res.json({ success: true });
     } else {
         res.status(500).json({ success: false });
    }
});

// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================



// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function =================================

// Route to get data from User2 table
router.get('/get-user-2', async (req, res) => {
    try {
        const tableContent = await appService.fetchTableFromDb('User2');
        res.json({ data: tableContent });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Deaks with the post for insert functionality part.
router.post("/insert-user-2", async (req, res) => {
    const { userID, username, age, gender, height, weight } = req.body;
    
    const insertResult = await appService.insertIntoUser2Table('User2', userID, username, age, gender, height, weight);
    
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

        // ----------------- Dealing with now instead of the regular user stuff. ------------------

// Actual regular user table in this case.
router.get('/get-regular-user', async (req, res) => {
    try {
        const tableContent = await appService.fetchTableFromDb('RegularUser');
        res.json({ data: tableContent });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-regular-user", async (req, res) => {
    const { userID, subscriptionType } = req.body;

    const insertResult = await appService.insertIntoRegularUserTable('RegularUser', userID, subscriptionType);

    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function =================================
// ======================= Insert Proc Meal Function ================================= !!!!!


router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {

    // TODO check that the name of the table not null
    const tableContent = await appService.fetchTableFromDb('DEMOTABLE');
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    // TODO check that the name of the table not null
    const initiateResult = await appService.initiateTable('DEMOTABLE');
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    // TODO check that the name of the table not null
    const { id, name } = req.body;
    const insertResult = await appService.insertIntoTable('DEMOTABLE', id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    // TODO check that the name of the table not null
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameTable('DEMOTABLE', oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countTable('DEMOTABLE');
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;