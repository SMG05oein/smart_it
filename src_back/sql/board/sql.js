const mysql = require('mysql2/promise');

const { getConnection } = require('../../config/config');

async function insertBoard(userId, title, content) {
    let con;

    const selectMemberIdSql = `SELECT members_id FROM members WHERE user_id = ?`;
    const insertBoardSql = `
        INSERT INTO board (fk_members_id, title, contents)
        VALUES (?, ?, ?)
    `;

    try {
        con = await getConnection(); // DB 연결을 가져옵니다.

        // 1. members_id 조회
        // DB 드라이버에 따라 .query의 응답 형태가 다를 수 있습니다. (여기서는 [rows, fields] 형태 가정)
        const [memberRows] = await con.query(selectMemberIdSql, [userId]);

        if (memberRows.length === 0) {
            console.error(`ERROR: User ID ${userId} not found.`);
            // 사용자가 없으므로 게시글 등록 불가
            return false;
        }
        const fk_member_id = memberRows[0].members_id;

        // 2. board 테이블에 게시글 삽입
        // [fk_member_id, title, content] 순서로 쿼리에 값을 바인딩합니다.
        const [result] = await con.query(insertBoardSql, [fk_member_id, title, content]);

        console.log(`게시글 등록 성공. 삽입된 ID: ${result.insertId}`);
        return true;

    } catch (error) {
        console.error("게시글 등록 중 데이터베이스 오류 발생:", error);
        return false;
    }
}


module.exports = {
    insertBoard
};