import React, {useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import './User.style.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');

    function login() {
        axios.post(`${process.env.REACT_APP_API_URL}/api/Login`, {
            userId: id,
            pass: pass,
        },{withCredentials: true})
            .then(r => {
            console.log(r.data);
            if(r.data.status === 200){
                localStorage.setItem("isLogin","true");
                localStorage.setItem("userId",id);
                navigate("/");
            }else{
                alert("아이디 또는 비밀번호가 맞지 않습니다.");
            }
        })
    }

    return (
        <div className={"h-100"}>
            <Container fluid className={'h-100 justify-content-center align-content-center'}>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginTitle'}>로그인하기</Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginId'}>
                        <span>아이디</span>
                        <input type={'text'} onChange={(e) => {
                            setId(e.target.value);
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginPw'}>
                        <span>비밀번호</span>
                        <input type='password' onChange={(e) => {
                            setPass(e.target.value);
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginPw'}>
                        <button className={'btn btn-primary'} onClick={() => {
                            login()
                        }}>로그인 하기</button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} className={'d-flex justify-content-center align-content-center idSearch'}>아이디 찾기</Col>
                    <Col xs={6} className={'d-flex justify-content-center align-content-center pwSearch'}>비밀번호 찾기</Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;