const { getConnection } = require('../../config/config');

/**
 * 게시글 등록
 */
async function insertBoard(userId, title, content) {
    let con;
    const selectMemberIdSql = `SELECT members_id FROM members WHERE user_id = ?`;
    const insertBoardSql = `INSERT INTO board (fk_members_id, title, contents) VALUES (?, ?, ?)`;

    try {
        con = await getConnection();

        const [memberRows] = await con.query(selectMemberIdSql, [userId]);
        if (memberRows.length === 0) return false;

        const fk_member_id = memberRows[0].members_id;
        await con.query(insertBoardSql, [fk_member_id, title, content]);

        return true;
    } catch (error) {
        console.error("게시글 등록 오류:", error);
        return false;
    }
}

/**
 * 게시글 삭제
 */
async function deleteBoard(boardId, userId) {
    let con;
    const selectSql = `SELECT b.board_id FROM board b 
                                JOIN members m ON b.fk_members_id = m.members_id 
                                WHERE b.board_id = ? AND m.user_id = ?`;
    const deleteSql = `DELETE FROM board WHERE board_id = ?`;

    try {
        con = await getConnection();

        const [rows] = await con.query(selectSql, [boardId, userId]);
        if (rows.length === 0) return false; // 존재하지 않거나 권한 없음

        await con.query(deleteSql, [boardId]);
        return true;
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
        return false;
    }
}

/**
 * 게시글 상세 조회
 */
async function getBoard(boardId) {
    let con;
    const selectSql = `
        SELECT *
        FROM board
        WHERE board_id = ?
    `;

    try {
        con = await getConnection();
        const [rows] = await con.query(selectSql, [boardId]);
        if (rows.length === 0) return null;
        return rows[0];
    } catch (error) {
        console.error("게시글 조회 오류:", error);
        return null;
    }
}

/**
 * 게시글 수정
 */
async function updateBoard(boardId, userId, title, content) {
    let con;
    const selectSql = `SELECT b.board_id FROM board b 
                                JOIN members m ON b.fk_members_id = m.members_id 
                                WHERE b.board_id = ? AND m.user_id = ?`;

    const updateSql = `UPDATE board SET title = ?, contents = ?, board_update_date = NOW() WHERE board_id = ?`;

    try {
        con = await getConnection();

        const [rows] = await con.query(selectSql, [boardId, userId]);
        if (rows.length === 0) return false; // 존재하지 않거나 권한 없음

        await con.query(updateSql, [title, content, boardId]);
        return true;
    } catch (error) {
        console.error("게시글 수정 오류:", error);
        return false;
    }
}

module.exports = {
    insertBoard,
    deleteBoard,
    getBoard,
    updateBoard
};
