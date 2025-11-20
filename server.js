require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { connectDB, getConnection } = require('./src_back/config/config');
const { testSql } = require('./src_back/sql/sql');

const port = process.env.PORT || 8008; // 포트 설정


// connectDB();

// CORS 설정
const cors = require('cors');
const corsOption = {
    origin: "*",
    optionSuccessStatus: 200,
};
app.use(cors(corsOption));
app.use(express.json());

// API 예제 : /api/tests 요청 시 데이터 전송 (message 변수에 Hi)
app.get('/api/tests', async (req, res) => {
    let result = await testSql();
    res.send({message:'Test', result:result});
});

// 정적 파일 제공 (리액트 build 결과물)
app.use(express.static(path.join(__dirname, '/build')));

// 그 외 모든 요청은 index.html 반환
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log('server.js: 서버 시작 포트 ' + port);
});
