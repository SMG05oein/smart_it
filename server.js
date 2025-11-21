require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { connectDB, getConnection } = require('./src_back/config/config');
const { testSql, checkId, addMember, login} = require('./src_back/sql/sql');
const cookieParser = require('cookie-parser');

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

// 4. 생성된 쿠키 확인 (request 객체의 cookies 속성으로 접근)
app.get('/getcookie', (req, res) => {
    console.log(req.cookies);
    res.send('Check console for cookies');
});

/** 로그인, 회원가입 API 시작*/
app.get(`/api/checkId/:id`, async (req, res) => {
    const id = req.params.id;
    let cc = await checkId(id);
    let status = cc === true ? 401 : 200;
    res.send({status: status});
})

app.post(`/api/signUp`, async (req, res) => {
    console.log(req.body);
    const req2 = req.body;
    let result = await addMember(req2);
    res.send({status: result});
})

app.post(`/api/Login`, async (req, res) => {
    console.log(req.body);
    const req2 = req.body;
    let result = await login(req2);
    let status = result === true ? 401 : 200;
    // res.cookie('cookieName', 'cookieValue'); // 기본 쿠키 생성

    res.cookie('auth', req2.userId, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).send({status: status});
})

app.get('/Test', async (req, res) => {
    res.cookie('testCookie', 'Temp'); // 기본 쿠키 생성
    res.send({status: 'Sss'});


})
/** 로그인, 회원가입 API 끝 */

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
