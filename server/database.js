const sql = require('mssql/msnodesqlv8');

const sqlConfig = {
    server: 'DESKTOP-T99PB5S\\SQLEXPRESS',
    database: "FaceJournal",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    },
    driver: "ODBC Driver 18 for SQL Server"
};


async function testQuery() {
    console.log(sqlConfig);
    try {
        console.log("Trying");
        await sql.connect(sqlConfig);
        console.log("Trying harder")
        const result = await sql.query(`insert into Profile VALUES ('John', 'John2')`);
        console.dir(result);
    } catch (err) {
        console.error(err);
    }

}

async function addPostQuery(profileID, text) {
    let result;
    try {
        await sql.connect(sqlConfig);
        result = await sql.query(`INSERT INTO Post VALUES ('${profileID}', '${text}', '0', '0')`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
    //return result.postID
}

async function addCommentQuery(profileID, text, postID) {
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query(`INSERT INTO Comment VALUES ('${profileID, text, postID})`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
}

async function likePostQuery(postID) {
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query(`INSERT INTO Post VALUES ('${profileID, text})`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { testQuery, addPostQuery, addCommentQuery, sqlConfig};