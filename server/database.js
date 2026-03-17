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
        //const result = await sql.query(`insert into Profile VALUES ('John', 'John2')`);
        const result = await sql.query(`select * from Profile where ProfileID = ${1}`)
        console.dir(result);
    } catch (err) {
        console.error(err);
    }

}

module.exports = { testQuery, sqlConfig};