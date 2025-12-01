const express = require('express');
const router = express.Router();
const { getDailyByMonth } = require("../sql/daily/sql");

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

module.exports = router;
