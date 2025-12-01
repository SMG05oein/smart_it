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

/**
 * 모든 게시글 조회
 */
async function getBoardAll(page){
    let con;

    // 페이지당 게시글 수 설정
    const pageSize = 10;
    // OFFSET 계산: (페이지 번호 - 1) * 페이지당 게시글 수
    const offset = (page - 1) * pageSize;

    try{
        con = await getConnection();

        // LIMIT와 OFFSET을 사용하여 페이지네이션 적용
        // 최신 글부터 보여주기 위해 created_at 기준 내림차순 정렬
        const sql = `
            SELECT b.board_id, b.title, b.board_reg_date, b.board_update_date, m.user_id 
            FROM board b
            inner join members m on b.fk_members_id = m.members_id
            ORDER BY b.board_id DESC 
            LIMIT ? OFFSET ?
        `;

        const [data] = await con.query(sql, [pageSize, offset]);

        return data;

    } catch (error) {
        console.error("모든 게시글 불러오기 오류:", error);
        return false;
    }
}

module.exports = {
    insertBoard,
    deleteBoard,
    getBoard,
    updateBoard,
    getBoardAll
};
