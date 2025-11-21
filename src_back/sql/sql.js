const mysql = require('mysql2/promise');

const { getConnection } = require('../config/config');



// console.log(con);

async function testSql() {
    const query  = 'SELECT * FROM members WHERE members_id=1';
    let con = await getConnection();
    return con.query(query );
}

async function checkId(id) {
    const query  = `SELECT * FROM members WHERE user_id='${id}'`;
    let con = await getConnection();
    let result = await con.query(query );
    return result[0].length === 0; // 있다면 false 없으면 true
}

async function addMember(req2) {
    const memberData = {
        user_id: req2.userId,
        pass: req2.pass,
        is_admin: req2.isAdmin,
    }
    const query  = `INSERT INTO members SET ?`;
    let con = await getConnection();
    let result = await con.query(query, [memberData]);
    return result; // 있다면 false 없으면 true
}

async function login(req2) {
    const query  = `SELECT * FROM members WHERE user_id = ? AND pass = ? `;
    let con = await getConnection();
    let result = await con.query(query, [req2.userId, req2.pass] );
    return result[0].length === 0; // 있다면 false 없으면 true
}

module.exports = {
    testSql,
    checkId,
    addMember,
    login
};