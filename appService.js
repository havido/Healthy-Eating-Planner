const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const { query } = require('express');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

function generateQuery(tableName, selected_attr, condition_dict) {

    selected_attr = selected_attr.join(", ").toUpperCase()
    var res = "SELECT " + selected_attr + " FROM " + tableName + " WHERE "

    const keys = Object.keys(condition_dict);
    const vals = Object.values(condition_dict);
    const length = Object.keys(condition_dict).length;

    for (let i = 0; i < length; i++) {
        const key = keys[i].toUpperCase();
        res += key + "=\'" + vals[i] + "\'";
        if (i != length - 1) {
            res += " AND ";
        }
    }

    return res
}

// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================

async function updateDescription(tableName, productName, brandName, newDescription) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                'UPDATE ' + tableName + ' SET userDescript = :newDescription WHERE procName = :productName AND brand = :brandName',
                [newDescription, productName, brandName],
                { autoCommit: true }
            );

            return result.rowsAffected && result.rowsAffected > 0;
        } catch (error) {
            return false;
        }
    });
}

async function updateUnit(tableName, productName, brandName, newUnit) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                ' UPDATE ' + tableName +  ' SET pfUnit = :newUnit WHERE procName = :productName AND brand = :brandName',
                [newUnit, productName, brandName],
            );

            return result.rowsAffected && result.rowsAffected > 0;
        } catch (error) {
            return false;
        }
    });
}


// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================
// ======================================= Update Food =================================================


// ======================================= Insert User =================================================
// ======================================= Insert User =================================================
// ======================================= Insert User =================================================
// ======================================= Insert User =================================================

// This would be in user2 table
async function insertIntoUser2Table(tableName, userID, username, age, gender, height, weight) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ` + tableName + ` (userID, username, age, gender, height, weights) VALUES (:userID, :username, :age, :gender, :height, :weight)`,
            [userID, username, age, gender, height, weight],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


// This would be in regular user table
async function insertIntoRegularUserTable(tableName, userID, subscriptionType) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ` + tableName + ` (userID, subscriptionType) VALUES (:userID, :subscriptionType)`,
            [userID, subscriptionType],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// ======================================= Insert User =================================================
// ======================================= Insert User =================================================
// ======================================= Insert User =================================================
// ======================================= Insert User =================================================






// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchTableFromDb(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ' + tableName.toUpperCase());
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateTable(tableName) {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }
        // TODO will have to read the attributes from the request
        // but this feature might not be needed in the first palce
        const result = await connection.execute(`
            CREATE TABLE `+ tableName + ` (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertIntoTable(tableName, id, name) {
    return await withOracleDB(async (connection) => {
        // TODO will have to read the attributes from the request
        const result = await connection.execute(
            `INSERT INTO ` + tableName + ` (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function readRowsWithValuesFromTable(tableName, selected_attr, condition_dict) {
    return await withOracleDB(async (connection) => {

        query_ = generateQuery(tableName, selected_attr, condition_dict)
        const result = await connection.execute(
            query_
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function deleteFromTable(tableName, condition_dict) {
    return await withOracleDB(async (connection) => {
        const keys = Object.keys(condition_dict);
        const vals = Object.values(condition_dict);
        const length = Object.keys(condition_dict).length;

        var query = "DELETE FROM " + tableName + " WHERE ";

        for (let i = 0; i < length; i++) {
            const key = keys[i].toUpperCase();
            query += key + "=\'" + vals[i] + "\'";
            if (i != length - 1) {
                query += " AND ";
            }
        }

        const result = await connection.execute(
            query,
            [],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function joinAllUserTables() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM USER2 
            LEFT JOIN USER1 ON USER2.HEIGHT=USER1.HEIGHT AND USER1.WEIGHTS=USER2.WEIGHTS
            LEFT JOIN ADMINAPP ON USER2.USERID=ADMINAPP.USERID
            LEFT JOIN REGULARUSER ON USER2.USERID=REGULARUSER.USERID`
        );
        return result;
    }).catch(() => {
        return false;
    });
}


// Q: not sure if name=: can be anything or this is a syntax of SQl that we will not change
// and doest not need to be a variable
async function updateNameTable(tableName, oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ` + tableName + ` SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countTable(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM ' + tableName);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchTableFromDb,
    initiateTable,
    insertIntoTable,
    updateNameTable,
    countTable,
    // general functions
    readRowsWithValuesFromTable,
    deleteFromTable,
    // hard coded functionalities
    joinAllUserTables,

    // Proc Food: ==============================
    updateDescription,
    updateUnit,    
    // ==============================

    // Insert user: ==================
    insertIntoUser2Table,
    insertIntoRegularUserTable
};