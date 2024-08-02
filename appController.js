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

    // we only expect the username and NO password (for now)
    if (attrs.length > 1 || values.length > 1) {
        res.status(500).json({ success: false });
    }

    selected_attr = attrs
    condition_dict = req.body

    //const initiateResult = await appService.initiateTable('USERS', attrsAndTargetValues);
    const initiateResult = await appService.readRowsWithValuesFromTable('USER2', selected_attr, condition_dict);
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



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