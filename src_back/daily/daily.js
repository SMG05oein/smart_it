const express = require('express');
const router = express.Router();
const { getDailyByMonth, createDaily,updateDaily, deleteDaily, getDailyDetail} = require("../sql/daily/sql");

/**
 * @swagger
 * tags:
 *   - name: 일지
 *     description: 일지 조회 API
 */

/**
 * @swagger
 * /daily/{year}/{month}:
 *   get:
 *     tags: [일지]
 *     summary: "특정 년/월의 일지 목록 조회"
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 연도
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 월 (1~12)
 *     responses:
 *       200:
 *         description: 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 오류
 */
router.get("/daily/:year/:month", async (req, res) => {
    const userId = req.cookies.auth;
    const { year, month } = req.params;

    if (!userId) {
        return res.status(401).json({ status: 401, message: "로그인 필요" });
    }

    try {
        const result = await getDailyByMonth(userId, year, month);

        return res.status(200).json({
            status: 200,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "서버 오류" });
    }
});

/**
 * @swagger
 * /createDaily:
 *   post:
 *     tags: [일지]
 *     summary: "일지 등록"
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
 *               use_date:
 *                 type: string
 *                 example: "2025-01-12"
 *     responses:
 *       200:
 *         description: 성공
 *       401:
 *         description: 인증 필요
 */
router.post("/createDaily", async (req, res) => {
    const userId = req.cookies.auth;
    if (!userId)
        return res.status(401).json({ status: 401, message: "로그인 필요" });

    const { title, content, use_date } = req.body;

    try {
        const result = await createDaily(userId, title, content, use_date);
        res.status(200).json({ status: 200, message: "등록 완료", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "서버 오류" });
    }
});


/**
 * @swagger
 * /updateDaily/{id}:
 *   post:
 *     tags: [일지]
 *     summary: "일지 수정"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 일지 ID
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
 *               use_date:
 *                 type: string
 *                 example: "2025-01-12"
 *     responses:
 *       200:
 *         description: 수정 성공
 *       403:
 *         description: 권한 없음
 *       401:
 *         description: 인증 필요
 */
router.post("/updateDaily/:id", async (req, res) => {

    const userId = req.cookies.auth;
    if (!userId)
        return res.status(401).json({ status: 401, message: "로그인 필요" });

    const { id } = req.params;
    const { title, content, use_date } = req.body;

    try {
        const r = await updateDaily(userId, id, title, content, use_date);
        if(!r) res.status(403).json({ status: 403, message: "권한 없음" })
        res.status(200).json({ status: 200, message: "수정 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "서버 오류" });
    }
});


/**
 * @swagger
 * /delDaily/{id}:
 *   post:
 *     tags: [일지]
 *     summary: "일지 삭제"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 일지 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       403:
 *         description: 권한 없음
 *       401:
 *         description: 인증 필요
 */
router.post("/delDaily/:id", async (req, res) => {
    const userId = req.cookies.auth;
    if (!userId)
        return res.status(401).json({ status: 401, message: "로그인 필요" });

    const { id } = req.params;

    try {
        const r = await deleteDaily(userId, id);
        if(!r) res.status(403).json({ status: 403, message: "권한 없음" })
        res.status(200).json({ status: 200, message: "삭제 완료" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "서버 오류" });
    }
});

/**
 * @swagger
 * /detailDaily/{id}:
 *   get:
 *     tags: [일지]
 *     summary: "특정 일지 상세 조회"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 일지 ID
 *     responses:
 *       200:
 *         description: 성공
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 존재하지 않는 ID
 *       500:
 *         description: 서버 오류
 */
router.get("/detailDaily/:id", async (req, res) => {
    const userId = req.cookies.auth;
    const { id } = req.params;
    if (!userId) {
        return res.status(401).json({ status: 401, message: "로그인 필요" });
    }

    try {
        const result = await getDailyDetail(userId, id);

        if (!result) {
            return res.status(404).json({ status: 404, message: "일지를 찾을 수 없습니다." });
        }

        return res.status(200).json({
            status: 200,
            data: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "서버 오류" });
    }
});

module.exports = router;
