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
async function getBoardAll(page, keyword){
    let con;

    // 페이지당 게시글 수 설정
    const pageSize = 10;
    // OFFSET 계산: (페이지 번호 - 1) * 페이지당 게시글 수
    const offset = (page - 1) * pageSize;

    // 1. WHERE 절 및 파라미터 구성
    const params = [];
    let likeWhere = '';

    // 검색어 유효성 검사 (null, undefined, 공백만 있는 경우 모두 처리)
    if (keyword && keyword.trim() !== "") {
        // 검색어가 있을 경우: WHERE b.title LIKE ? 만 사용
        likeWhere = ` WHERE b.title LIKE ? `;
        // **중요:** 와일드카드(%)를 값 자체에 포함시켜 파라미터 배열에 추가
        params.push(`%${keyword}%`);
    }

    // 2. 쿼리별 파라미터 배열 준비
    // countSql은 검색 파라미터만 사용
    const countParams = [...params];

    // dataSql은 검색 파라미터 + LIMIT + OFFSET 파라미터 사용
    const dataParams = [...params, pageSize, offset];

    try{
        con = await getConnection();

        // 1. 전체 개수 조회 쿼리 (검색 조건 적용)
        const countSql = `
            SELECT COUNT(*) AS total_count
            FROM board b
                ${likeWhere}
        `;

        // 2. 게시글 목록 조회 쿼리 (검색 조건 및 페이지네이션 적용)
        const dataSql = `
            SELECT b.board_id, b.title, b.board_reg_date, b.board_update_date, m.user_id
            FROM board b
                INNER JOIN members m ON b.fk_members_id = m.members_id
                ${likeWhere}
            ORDER BY b.board_id DESC
                LIMIT ? OFFSET ?
        `;


        // 전체 개수 조회: countParams 배열 사용
        const [countResult] = await con.query(countSql, countParams);
        const totalCount = countResult.length > 0 ? countResult[0].total_count : 0;

        // 게시글 목록 조회: dataParams 배열 사용
        const [data] = await con.query(dataSql, dataParams);

        // 총 페이지 수 계산: 전체 개수를 pageSize로 나누고 올림
        const totalPages = Math.ceil(totalCount / pageSize);

        // 데이터, 총 페이지 수, 전체 개수를 담은 객체 반환
        return {
            data: data,
            totalPages: totalPages,
            totalCount: totalCount
        };

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
