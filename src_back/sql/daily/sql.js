const { getConnection } = require('../../config/config');
const { isMeDaily } = require('../auth/sql');

let con;

/**
 * 년 월로 일지 가져오기
 */
const getDailyByMonth = async (userId, year, month) => {

    con = await getConnection()

    const sqlMember = `SELECT members_id FROM members WHERE user_id = ?`;
    const [memberRows] = await con.query(sqlMember, [userId]);

    if (memberRows.length === 0) {
        return null;
    }

    const membersId = memberRows[0].members_id;

    const sql = `
        SELECT 
            calender_id,
            fk_members_id,
            DATE_FORMAT(use_date, '%Y-%m-%d') AS use_date_local,
            title,
            content
        FROM calender
        WHERE fk_members_id = ?
          AND YEAR(use_date) = ?
          AND MONTH(use_date) = ?
        ORDER BY use_date DESC
    `;

    const [rows] = await con.query(sql, [membersId, year, month]);
    return rows;
};

async function getMembersId(userId) {
    const sql = `SELECT members_id FROM members WHERE user_id = ?`;
    const [rows] = await con.query(sql, [userId]);
    return rows.length ? rows[0].members_id : null;
}

async function createDaily(userId, title, content, use_date) {
    con = await getConnection()

    const membersId = await getMembersId(userId);
    if (!membersId) throw new Error("회원 정보가 존재하지 않습니다.");

    const sql = `
        INSERT INTO calender (fk_members_id, title, content, use_date)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await con.query(sql, [
        membersId,
        title,
        content,
        use_date
    ]);

    return result;
}

async function updateDaily(userId, id, title, content, use_date) {
    con = await getConnection()

    const membersId = await getMembersId(userId);
    if (!membersId) throw new Error("회원 정보가 존재하지 않습니다.");

    const check = await isMeDaily(id);
    if(check.user_id !== userId) return false;

    const sql = `
        UPDATE calender
        SET title = ?, content = ?, use_date = ?
        WHERE calender_id = ? AND fk_members_id = ?
    `;

    const [result] = await con.query(sql, [title,content,use_date,id, membersId]);

    return result;
}

async function deleteDaily(userId, id) {
    con = await getConnection()

    const check = await isMeDaily(id);
    if(check.user_id !== userId) return false;

    const membersId = await getMembersId(userId);
    if (!membersId) throw new Error("회원 정보가 존재하지 않습니다.");

    const sql = `DELETE FROM calender WHERE calender_id = ? AND fk_members_id = ?`;

    const [result] = await con.query(sql, [id, membersId]);
    return result;
}

async function getDailyDetail(userId, dailyId) {

    con = await getConnection()

    const membersId = await getMembersId(userId);
    if (!membersId) throw new Error("회원 정보가 존재하지 않습니다.");

    const sql = `
        SELECT c.*, m.user_id
        FROM calender c
        JOIN members m On c.fk_members_id=m.members_id
        WHERE c.calender_id = ?
        LIMIT 1
    `;

    try {
        const [rows] = await con.query(sql, [dailyId]);

        if (rows.length === 0) return null;

        return rows[0];
    } catch (err) {
        console.error("getDailyDetail SQL Error:", err);
        throw err;
    }
}

module.exports = {
    getDailyByMonth,
    createDaily,
    updateDaily,
    deleteDaily,
    getDailyDetail
};