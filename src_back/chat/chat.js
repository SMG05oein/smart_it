const express = require('express');
const axios = require('axios');

const router = express.Router();

// Python Docker 서버 주소
const AI_SERVER_URL = 'http://127.0.0.1:5000/chat';

const askBot = async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: '질문 내용(message)이 없습니다.' });
        }

        console.log(`[Controller] 사용자 질문 수신: ${userMessage}`);
        console.log(`[Controller] Python AI 서버(${AI_SERVER_URL})로 연결 시도...`);

        // Python AI 서버로 요청
        const aiResponse = await axios.post(AI_SERVER_URL, {
            user_input: userMessage
        });

        const aiData = aiResponse.data;
        console.log('[Controller] AI 응답 수신 성공:', aiData);

        return res.json({
            success: true,
            original_question: userMessage,
            answer: aiData.reply,
            score: aiData.score,
            is_generated: aiData.is_generated
        });

    } catch (error) {
        // [디버깅] 에러 원인을 콘솔에 자세히 출력
        console.error('====================================');
        console.error('[Controller] 에러 발생!');
        console.error('- 메시지:', error.message);
        if (error.response) {
            console.error('- Python 서버 응답 상태:', error.response.status);
            console.error('- Python 서버 응답 데이터:', error.response.data);
        }
        console.error('====================================');
        
        // 연결 거부 (Python 서버 꺼짐)
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                success: false, 
                error: 'AI 서버(Port 5000)에 연결할 수 없습니다. Docker가 켜져 있는지 확인하세요.' 
            });
        }

        // 클라이언트에게 진짜 에러 내용 전달 (디버깅용)
        return res.status(500).json({ 
            success: false, 
            error: `AI 서버 통신 오류: ${error.message}`,
            details: error.response ? error.response.data : null
        });
    }
};

router.post('/ask', askBot);

module.exports = router;