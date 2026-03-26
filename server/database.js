const { eventWrapper } = require('@testing-library/user-event/dist/utils');
const sql = require('mssql/msnodesqlv8');

const sqlConfig = {
    server: '.\\SQLEXPRESS',//'DESKTOP-T99PB5S\\SQLEXPRESS',
    database: "FaceJournal",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    },
    driver: "ODBC Driver 17 for SQL Server"
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

async function addPostQuery(profileID, title, text) {
    let result;
    try {
        await sql.connect(sqlConfig);
        result = await sql.query(`INSERT INTO Post VALUES ('${profileID}', '${title}', '${text}', '0', '0')`);
        console.dir(result);
        var postID = await sql.query(`SELECT * FROM Post ORDER BY PostID DESC`);
        var id = postID.recordset[0].PostID;
        return id;
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
        var CommentID = await sql.query(`SELECT * FROM Comment ORDER BY CommentID DESC`);
        var id = CommentID.recordset[0].CommentID;
        return id;
    }
    catch (err) {
        console.error(err);
    }
}

async function likePostQuery(postID, value) {
    try {
        let isLike;
        if (value){
            isLike = "Likes"
        }
        else{
            isLike = "Dislikes"
        }
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
        let isLike;
        if (value){
            isLike = "Likes"
        }
        else{
            isLike = "Dislikes"
        }
        await sql.connect(sqlConfig);
        const result = await sql.query(`UPDATE Comment SET ${isLike} = ${isLike} + 1 WHERE CommentID = ${commentID}`);
        console.dir(result);
    }
    catch (err) {
        console.error(err);
    }
}

async function loginQuery(username, password){
    try {
        await sql.connect(sqlConfig);
        var result = await sql.query(`SELECT * FROM Profile WHERE Username = '${username}'`);
        // console.dir(result);
        if (result.recordset[0].Passwrd === password){
            console.log("Correct password!")
        }
        else{
            console.log("Something went wrong")
            return null
        }
        return result.recordset[0].ProfileID;
    }
    catch (err){
        console.error(err);
    }
}

async function signupQuery(username, password){
    try {
        await sql.connect(sqlConfig);
        var checkuser = await sql.query(`SELECT * FROM Profile WHERE Username = '${username}'`)
        // console.dir(checkuser)
        if (checkuser.recordset[0] ==! null && checkuser.recordset[0].Username === username){
            console.log("That's not right");
            return null
        }
        else{
            console.log("That one's allowed")
        }
        var result = await sql.query(`INSERT INTO Profile VALUES ('${username}', '${password}')`);
        // console.dir(result);
        var postID = await sql.query(`SELECT * FROM Profile ORDER BY ProfileID DESC`);
        var id = postID.recordset[0].ProfileID;
        return id;
    }
    catch (err){
        console.error(err);
    }
}

async function postHistoryQuery(){
    try {
        await sql.connect(sqlConfig);
        var postList = await sql.query(`SELECT * FROM Post ORDER BY PostID DESC`);
        // console.log(postList.recordset[0].PostID);
        return postList
    }
    catch (err) {
        console.error(err);
    }
}

async function usernameListQuery(){
    try {
        await sql.connect(sqlConfig);
        var usernameList = await sql.query(`SELECT Username FROM Profile ORDER BY ProfileID ASC`);
        var output = [];
        for (let i = 0; i < usernameList.recordset.length; i++){
            output[i+1] = usernameList.recordset[i].Username;
        }
        return output
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { testQuery, addPostQuery, addCommentQuery, likePostQuery, likeCommentQuery, loginQuery, signupQuery, postHistoryQuery, usernameListQuery, sqlConfig};