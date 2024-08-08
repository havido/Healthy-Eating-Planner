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

async function updateProcessedFood(productName, brandName, newUnit, newDescription) {
    return await withOracleDB(async (connection) => {
        try {

            var q_ = 'UPDATE PROCESSEDFOOD SET '
            var arr = []

            if (newUnit !== '') {
                q_ += 'pfUnit = :newUnit '
                arr.push(newUnit)
            }
            if (newDescription !== '') {
                q_ += ', userDescript = :newDescription '
                arr.push(newDescription)
            }

            q_ += 'WHERE procName = :productName AND brand = :brandName'
            arr.push(productName)
            arr.push(brandName)

            q_ = q_.trim()
            console.log(q_)

            const result = await connection.execute(
                q_,
                arr,
                { autoCommit: true }
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

// This would be in regular user table
async function insertIntoRegularUserTable(userID, username, subscriptionType, age, gender, height, weight) {
    return await withOracleDB(async (connection) => {

        // Validate if user already exists
        const qq_ = `
        SELECT * FROM USER2 WHERE USERID = '${userID}'
        `.trim()
        const isUser = await connection.execute(qq_);
        if (isUser.rows && isUser.rows.length > 0) {
            return false;
        }

        const user2Result = await connection.execute(
            `INSERT INTO USER2(userID, username, age, gender, height, weights) VALUES(: userID, : username, : age, : gender, : height, : weight)`,
            [userID, username, age, gender, height, weight],
            { autoCommit: true }
        );

        if (user2Result.rowsAffected && user2Result.rowsAffected > 1) {
            return false
        }

        const regularUserResult = await connection.execute(
            `INSERT INTO REGULARUSER(userID, subscriptionType) VALUES(: userID, : subscriptionType)`,
            [userID, subscriptionType],
            { autoCommit: true }
        );
        if (regularUserResult.rowsAffected && regularUserResult.rowsAffected > 1) {
            return false
        }

        return true;
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
            LEFT JOIN USER1 ON USER2.HEIGHT = USER1.HEIGHT AND USER1.WEIGHTS = USER2.WEIGHTS
            LEFT JOIN ADMINAPP ON USER2.USERID = ADMINAPP.USERID
            LEFT JOIN REGULARUSER ON USER2.USERID = REGULARUSER.USERID`
        );
        return result;
    }).catch(() => {
        return false;
    });
}

async function filterUserTablesUsingAttrs(condition_attrs) {
    return await withOracleDB(async (connection) => {

        var q = `
        SELECT *
        FROM USER2 
        LEFT JOIN USER1 ON USER2.HEIGHT = USER1.HEIGHT AND USER1.WEIGHTS = USER2.WEIGHTS 
        LEFT JOIN ADMINAPP ON USER2.USERID = ADMINAPP.USERID 
        LEFT JOIN REGULARUSER ON USER2.USERID = REGULARUSER.USERID
        `.trim();

        if (condition_attrs) {
            q += ` WHERE ` + condition_attrs.trim();
        }

        console.log(q);

        const result = await connection.execute(q);
        return result;

    }).catch(() => {
        return false;
    });
}

async function fetchTablesFromDB() {
    return await withOracleDB(async (connection) => {

        var result = ''
        try {
            result = await connection.execute('SELECT table_name FROM user_tables'.trim());
        } catch (error) {
            console.log('Error fetching tables:', error);
            return ['Error1'];
        }
        // SELECT table_name
        // FROM information_schema.tables
        // WHERE table_schema = 'public'
        const z = result.rows.flatMap(row => row);
        return z
    }).catch(() => {
        return ['Error2'];
    });
}

async function getAttributes(table) {
    return await withOracleDB(async (connection) => {
        const q = "SELECT * FROM " + table;
        const result = await connection.execute(q);
        const zz = result.metaData.map(row => row.name);
        return zz;

    }).catch(() => {
        return ['Error'];
    });
}

async function getProjection(table, attributes) {
    return await withOracleDB(async (connection) => {
        const columns = attributes.length > 0 ? attributes.join(', ') : '*';
        const result = await connection.execute(`
            SELECT ${columns}
            FROM ${table}
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Count processed food brands (aggregration group by)
async function fetchPFCount(brand) {
    console.log(brand);
    var query = 'SELECT BRAND, COUNT(*) FROM PROCESSEDFOOD GROUP BY BRAND';
    if (brand) {
        query += ' HAVING BRAND LIKE \'%' + brand + '%\'';
    }
    console.log(query);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        console.log(result);
        return result.rows;
    }).catch(() => {
        return [];
    });
}


module.exports = {
    testOracleConnection,
    fetchTableFromDb,
    // general functions
    readRowsWithValuesFromTable,
    deleteFromTable,
    // hard coded functionalities
    joinAllUserTables,
    filterUserTablesUsingAttrs,

    // Proc Food: ==============================
    updateProcessedFood,

    // ==============================

    // Insert user: ==================
    insertIntoRegularUserTable,

    fetchTablesFromDB,
    getAttributes,
    getProjection,
    fetchPFCount
};