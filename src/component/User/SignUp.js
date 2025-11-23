import React, {useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import './User.style.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SignUp = () => {

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [isCheckId, setCheckId] = useState(false);

    // const isId = useCheckId(id, temp)

    function checkId(e) {
        if (id == '' || id == null) {
            alert('아이디를 입력해주세요')
            return;
        }

        axios.get(`${process.env.REACT_APP_API_URL}/api/checkId/${id}`)
            .then(r => {
                console.log(r.data);
                if (r.data.status !== 200) {
                    alert('사용 가능한 아이디 입니다.');
                    setCheckId(!isCheckId);
                } else {
                    alert('중복된 아이디 입니다.');
                }
            })
    }

    function signUp() {
        if (!isCheckId) {
            alert("아이디 중복 확인 먼저해주세요");
            return;
        }
        if (pass == '') {
            alert("비밀번호 입력해주세요")
            return;
        }
        axios.post(`${process.env.REACT_APP_API_URL}/api/signUp`, {
            userId: id,
            pass: pass,
            isAdmin: 0
        })
            .then(r => {
                const rr = r.data.status[0];
                console.log(r.data.status[0].serverStatus);
                if (rr.serverStatus === 2) {
                    navigate('/Login')
                }else{
                    alert('회원 가입 중 문제가 생겼습니다.\n관리자한테 문의해주세요.')
                }
            })
    }

    return (
        <div className={"h-100"}>
            <Container fluid className={'h-100 justify-content-center align-content-center'}>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginTitle'}>회원가입하기</Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginId'}>
                        <span>아이디</span>
                        <input {...(isCheckId && {disabled: true})} type={'text'} onChange={(e) => {
                            setId(e.target.value);
                        }}/>
                        <button className={'btn btn-sm btn-secondary'} onClick={(e) => {
                            if (isCheckId) {
                                return;
                            }
                            checkId(e);
                        }}>아이디 중복 확인
                        </button>
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
                        <span>비밀번호 <br/> 확인</span>
                        <input type='password'/>
                    </Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center align-content-center LoginPw'}>
                        <button className={'btn btn-primary'} onClick={() => {
                            signUp()
                        }}>회원가입하기 하기
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignUp;