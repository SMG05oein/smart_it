const mysql = require('mysql2/promise');

const { getConnection } = require('../config/config');



// console.log(con);

async function checkId(id) {
    const selectQuery = `SELECT * FROM members WHERE user_id='${id}'`;
    let con = await getConnection();
    let result = await con.query(selectQuery);
    return result[0].length === 0; // 있다면 false 없으면 true
}


module.exports = {
    checkId
};