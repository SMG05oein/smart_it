const mysql = require('mysql2/promise');

const { getConnection } = require('../config/config');


const selectQuery = 'SELECT * FROM item';

// console.log(con);

async function testSql() {
    let con = await getConnection();
    return con.query(selectQuery);
}


module.exports = {
    testSql
};