const express = require('express');
const router = express.Router();
const { insertBoard, deleteBoard, getBoard, updateBoard, getBoardAll } = require("../sql/board/sql");

/**
 * @swagger
 * tags:
 *   - name: 게시글
 *     description: 게시글 CRUD API
 */

/**
 * @swagger
 * /createBoard:
 *   post:
 *     summary: 게시글 등록
 *     tags: [게시글]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 게시글 등록 성공
 *       400:
 *         description: 필수 항목 누락 또는 로그인 안 됨
 *       500:
 *         description: 서버 오류
 */
router.post('/createBoard', async (req, res) => {
    const req2 = req.body;
    if (!req2.title || !req2.content) {
        return res.status(400).json({ status: 400, message: '제목과 내용은 필수입니다.' });
    }
    try {
        const result = await insertBoard(req.cookies.auth, req2.title, req2.content);
        if (!result) return res.status(400).json({ status: 400, message: '사용자가 없습니다.' });
        res.status(201).json({ status: 201, message: '게시글이 성공적으로 등록되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
});

/**
 * @swagger
 * /deleteBoard:
 *   post:
 *     summary: 게시글 삭제
 *     tags: [게시글]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       400:
 *         description: 게시글이 없거나 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.post('/deleteBoard', async (req, res) => {
    const { boardId } = req.body;
    if (!boardId) return res.status(400).json({ status: 400, message: 'boardId가 필요합니다.' });
    try {
        const result = await deleteBoard(boardId, req.cookies.auth);
        if (!result) return res.status(400).json({ status: 400, message: '삭제할 게시글이 없거나 사용자 게시물이 아닙니다.' });
        res.status(200).json({ status: 200, message: '게시글 삭제 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
});

/**
 * @swagger
 * /board/{id}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [게시글]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 게시글 정보
 *       404:
 *         description: 게시글 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/board/:id', async (req, res) => {
    const boardId = req.params.id;
    try {
        const board = await getBoard(boardId);
        if (!board) return res.status(404).json({ status: 404, message: '게시글이 존재하지 않습니다.' });
        res.status(200).json({ status: 200, data: board });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
});

/**
 * @swagger
 * /updateBoard:
 *   post:
 *     summary: 게시글 수정
 *     tags: [게시글]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: number
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *       400:
 *         description: 게시글 없음 또는 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.post('/updateBoard', async (req, res) => {
    const { boardId, title, content } = req.body;
    if (!boardId || !title || !content) return res.status(400).json({ status: 400, message: 'boardId, title, content 모두 필요합니다.' });

    try {
        const result = await updateBoard(boardId, req.cookies.auth, title, content);
        if (!result) return res.status(400).json({ status: 400, message: '수정할 게시글이 없거나 사용자 게시물이 아닙니다.' });
        res.status(200).json({ status: 200, message: '게시글 수정 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
});

/**
 * @swagger
 * /boardAll/{page}:
 *   get:
 *     tags: [게시글]
 *     summary: 게시글 전체 조회 (페이지네이션)
 *     description: |
 *       페이지 번호를 입력하여 게시글 목록을 조회합니다.
 *       한 페이지 당 10개의 게시글을 제공합니다.
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 조회할 페이지 번호 (1 이상)
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   description: 게시글 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 게시글 ID
 *                         example: 12
 *                       title:
 *                         type: string
 *                         description: 제목
 *                         example: "게시글 제목입니다"
 *                       contents:
 *                         type: string
 *                         description: 내용
 *                         example: "게시글 본문 내용입니다."
 *                       user:
 *                         type: string
 *                         description: 작성자 ID 또는 이름
 *                         example: "testUser"
 *                       createdAt:
 *                         type: string
 *                         description: 작성일
 *                         example: "2025-11-30 12:00:00"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: 유효하지 않은 페이지 번호 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: 유효하지 않은 페이지 번호입니다.
 *       404:
 *         description: 요청한 페이지에 게시글이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: 요청하신 페이지에 게시글이 없습니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: 게시글 조회 중 서버 내부 오류가 발생했습니다.
 */
router.get('/boardAll/:page', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const keyword = req.params.keyword || "";
    if (page < 1) {
        return res.status(400).json({ status: 400, message: '유효하지 않은 페이지 번호입니다.' });
    }

    try{
        const data = await getBoardAll(page, '');

        if(!data) {
            return res.status(500).json({ status: 500, message: '게시글 조회 중 서버 내부 오류가 발생했습니다.' });
        }
        if (data.length === 0 && page > 1) {
            return res.status(404).json({ status: 404, message: '요청하신 페이지에 게시글이 없습니다.' });
        }
        res.status(200).json({ status: 200, data: data, page: page, pageSize: 10 });
    }catch(err){
        console.error(err);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
})

router.get('/boardAll/:page/:keyword', async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const keyword = req.params.keyword || "";
    if (page < 1) {
        return res.status(400).json({ status: 400, message: '유효하지 않은 페이지 번호입니다.' });
    }

    try{
        const data = await getBoardAll(page, keyword);

        if(!data) {
            return res.status(500).json({ status: 500, message: '게시글 조회 중 서버 내부 오류가 발생했습니다.' });
        }
        if (data.length === 0 && page > 1) {
            return res.status(404).json({ status: 404, message: '요청하신 페이지에 게시글이 없습니다.' });
        }
        res.status(200).json({ status: 200, data: data, page: page, pageSize: 10 });
    }catch(err){
        console.error(err);
        res.status(500).json({ status: 500, message: '서버 오류' });
    }
})

module.exports = router;
