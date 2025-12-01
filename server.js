require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { connectDB, getConnection } = require('./src_back/config/config');
const { testSql, checkId, addMember, login} = require('./src_back/sql/auth/sql');
const cookieParser = require('cookie-parser');
const { swaggerUi, specs } = require("./swagger/swagger")
const auth = require('./src_back/auth/auth');
const board = require('./src_back/board/board');
const daily = require('./src_back/daily/daily');
const port = process.env.PORT || 8008; // 포트 설정

// connectDB();

// CORS 설정
const cors = require('cors');
const {get} = require("axios");
const corsOption = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(specs))
app.use("/api", auth);
app.use("/api", board);
app.use("/api", daily);


// 4. 생성된 쿠키 확인 (request 객체의 cookies 속성으로 접근)
app.get('/getcookie', (req, res) => {
    console.log(req.cookies);
    res.send('Check console for cookies');
});

/**
 * 아래는 테스트
 * */
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
