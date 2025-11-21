const user = { name: 'Alice', age: 25 };
const query = 'INSERT INTO members SET ?';

connection.query(query, user, (err, results) => {
    if (err) {
        console.error('데이터 삽입 중 오류 발생:', err);
        return;
    }
    console.log('데이터 삽입 성공:', results.insertId);
});

const mysql = require('mysql2/promise');

const { getConnection } = require('../config/config');



// console.log(con);

async function addMember(id) {
    const selectQuery = `SELECT * FROM members WHERE user_id='${id}'`;

    let con = await getConnection();
    let result = await con.query(selectQuery);
    return result[0].length === 0; // 있다면 false 없으면 true
}


module.exports = {
    addMember
};