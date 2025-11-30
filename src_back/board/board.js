const express = require('express');
const router = express.Router();
const { insertBoard, deleteBoard, getBoard, updateBoard } = require("../sql/board/sql");

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

module.exports = router;
