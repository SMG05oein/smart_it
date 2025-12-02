const mysql = require('mysql2/promise');

const { getConnection } = require('../../config/config');



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
    console.log(result[0]);
    return result[0].length !== 0; // 있다면 false 없으면 true
}


async function isMeBoard(boardId) {
    let con;

    const sql = `
        SELECT 
            b.board_id,
            m.user_id
        FROM board b
        JOIN members m ON b.fk_members_id = m.members_id
        WHERE b.board_id = ?
        LIMIT 1
    `;

    try {
        con = await getConnection();
        const [rows] = await con.query(sql, [boardId]);

        if (rows.length === 0) return null;

        return rows[0];   // { board_id, user_id }
    } catch (err) {
        console.error("isMe SQL Error:", err);
        return null;
    }
}

async function isMeDaily(calender_id) {
    let con;

    const sql = `
        SELECT 
            c.calender_id,
            m.user_id
        FROM calender c
        JOIN members m ON c.fk_members_id = m.members_id
        WHERE c.calender_id = ?
        LIMIT 1
    `;

    try {
        con = await getConnection();
        const [rows] = await con.query(sql, [calender_id]);

        if (rows.length === 0) return null;

        return rows[0];   // { board_id, user_id }
    } catch (err) {
        console.error("isMe SQL Error:", err);
        return null;
    }
}


module.exports = {
    testSql,
    checkId,
    addMember,
    login,
    isMeBoard, isMeDaily
};