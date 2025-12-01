const { getConnection } = require('../../config/config');

let con;

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

module.exports = {
    getDailyByMonth,
};