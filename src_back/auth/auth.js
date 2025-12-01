const express = require('express');
const router = express.Router();
const { checkId, addMember, login, isMe } = require("../sql/auth/sql");

/** 로그인, 회원가입 API 시작*/

/**
 * @swagger
 * tags:
 *   - name: 회원인증
 *     description: 사용자 로그인/회원가입 API
 */

/**
 * @swagger
 * /checkId/{id}:
 *   get:
 *     summary: 아이디 중복 확인
 *     tags: [회원인증]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 확인할 사용자 ID
 *     responses:
 *       200:
 *         description: 사용 가능한 아이디
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: 이미 사용 중인 아이디
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 */
router.get(`/checkId/:id`, async (req, res) => {
    const id = req.params.id;
    const exists = await checkId(id);
    const status = exists ? 401 : 200;
    res.send({ status });
});

/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: 회원가입
 *     tags: [회원인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               pass:
 *                 type: string
 *               isAdmin:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: 회원가입 성공 여부(status 반환)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 */
router.post(`/signUp`, async (req, res) => {
    const req2 = req.body;
    if (!req2.userId || !req2.pass) {
        return res.status(400).json({ status: 400, message: 'userId와 pass는 필수입니다.' });
    }
    try {
        const result = await addMember(req2);
        res.status(200).json({ status: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '회원가입 중 서버 오류' });
    }
});

/**
 * @swagger
 * /Login:
 *   post:
 *     summary: 로그인
 *     tags: [회원인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공 또는 실패(status 반환)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 */
router.post(`/Login`, async (req, res) => {
    const req2 = req.body;
    if (!req2.userId || !req2.pass) {
        return res.status(400).json({ status: 400, message: 'userId와 pass는 필수입니다.' });
    }
    try {
        console.log(req2)
        const result = await login(req2);
        const status = result ? 200 : 401; // login 함수 성공 시 true라면 200, 실패면 401

        if (status === 200) {
            res.cookie('auth', req2.userId, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24,
            });
        }

        res.status(200).json({ status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: '로그인 중 서버 오류' });
    }
});

/**
 * @swagger
 * /Test:
 *   get:
 *     summary: 테스트용 쿠키 생성
 *     tags: [회원인증]
 *     responses:
 *       200:
 *         description: 테스트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Sss"
 */
router.get('/Test', async (req, res) => {
    res.cookie('testCookie', 'Temp');
    res.send({ status: 'Sss' });
});

/**
 * @swagger
 * /isLogin:
 *   get:
 *     summary: 로그인 상태 확인
 *     tags: [회원인증]
 *     responses:
 *       200:
 *         description: 로그인 상태 확인(로그인됨)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: 로그인 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get('/isLogin', (req, res) => {
    const userId = req.cookies.auth;
    if (userId) {
        res.status(200).json({ isLoggedIn: true, userId, name: '사용자 이름' });
    } else {
        res.status(401).json({ isLoggedIn: false, message: '로그인 필요' });
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: 로그아웃
 *     tags: [회원인증]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "logout success"
 */
router.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.status(200).json({ status: "logout success" });
});

/**
 * @swagger
 * /isMe:
 *   post:
 *     tags: [회원인증]
 *     summary: 특정 게시글의 작성자가 나인지 확인
 *     description: |
 *       JSON으로 전달한 `boardId`와 쿠키의 `auth`(user_id)를 비교하여
 *       해당 게시글의 작성자가 로그인한 사용자 본인인지 확인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: 본인 여부 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 isMe:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "본인입니다."
 *       400:
 *         description: boardId 없거나 잘못된 요청
 *       401:
 *         description: 로그인되어 있지 않음
 *       404:
 *         description: 게시글이 존재하지 않음
 *       500:
 *         description: 서버 오류
 */
router.post('/isMe', async (req, res) => {
    const userId = req.cookies.auth;
    const { boardId } = req.body;

    if (!userId) {
        return res.status(401).json({ status: 401, message: '로그인이 되어 있지 않습니다.' });
    }

    if (!boardId) {
        return res.status(400).json({ status: 400, message: 'boardId가 필요합니다.' });
    }

    try {
        const data = await isMe(boardId);

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: '게시글을 찾을 수 없습니다.'
            });
        }

        const isMine = data.user_id === userId;

        return res.status(200).json({
            status: 200,
            isMe: isMine,
            message: isMine ? '본인입니다.' : '본인이 아닙니다.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: '서버 오류'
        });
    }
});


/** 로그인, 회원가입 API 끝 */

module.exports = router;
