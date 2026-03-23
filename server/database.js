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
        var postID = await sql.query(`SELECT MAX(PostID) FROM Post`);
        var id = postID.recordset.toTable().rows[0]
        return id[0];
    }
    catch (err) {
        console.error(err);
    }
}

async function addCommentQuery(profileID, text, postID) {
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query(`INSERT INTO Comment VALUES ('${profileID}', '${text}', '0', '0', '${postID}')`);
        console.dir(result);
        var postID = await sql.query(`SELECT MAX(CommentID) FROM Comment`);
        var id = postID.recordset.toTable().rows[0]
        return id[0];
    }
    catch (err) {
        console.error(err);
    }
}

async function likePostQuery(postID, value) {
    try {
        console.log(value);
        let isLike;
        if (value){
            isLike = "Likes"
        }
        else{
            isLike = "Dislikes"
        }
        console.log(isLike);
        await sql.connect(sqlConfig);
        const result = await sql.query(`UPDATE Post SET ${isLike} = ${isLike} + 1 WHERE PostID = ${postID}`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
}

async function likeCommentQuery(commentID, value){
     try {
        console.log(value);
        let isLike;
        if (value){
            isLike = "Likes"
        }
        else{
            isLike = "Dislikes"
        }
        console.log(isLike);
        await sql.connect(sqlConfig);
        const result = await sql.query(`UPDATE Comment SET ${isLike} = ${isLike} + 1 WHERE CommentID = ${commentID}`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { testQuery, addPostQuery, addCommentQuery, likePostQuery, likeCommentQuery, sqlConfig};