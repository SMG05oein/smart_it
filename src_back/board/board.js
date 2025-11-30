const express = require('express');
const router = express.Router();
const { insertBoard } = require("../sql/board/sql");

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
 *     description: 유저 아이디(쿠키), 제목, 내용을 이용해 게시글을 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "게시글 제목"
 *               content:
 *                 type: string
 *                 example: "게시글 내용"
 *     responses:
 *       201:
 *         description: 게시글 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "게시글이 성공적으로 등록되었습니다."
 *       400:
 *         description: 필수 입력값 누락 혹은 사용자 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 */

router.post('/createBoard', async (req, res) => {
    const req2 = req.body;

    // 필수 값 체크
    if (!req2.title || !req2.content) {
        return res.status(400).json({
            status: 400,
            message: '제목과 내용은 필수 입력 항목입니다.'
        });
    }

    try {
        let result = await insertBoard(req.cookies.auth, req2.title, req2.content);

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: '사용자가 없습니다.'
            });
        }

        return res.status(201).json({
            status: 201,
            message: '게시글이 성공적으로 등록되었습니다.'
        });

    } catch (error) {
        console.error('게시글 등록 중 오류 발생:', error);
        return res.status(500).json({
            status: 500,
            message: '서버 오류로 인해 게시글 등록에 실패했습니다.'
        });
    }
});

module.exports = router;
