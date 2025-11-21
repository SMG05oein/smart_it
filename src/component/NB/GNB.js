import React from 'react';
import './NB.style.css'
import {Outlet, useNavigate} from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

const Gnb = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="border-bottom py-3" style={{maxHeight:'60px'}}>
                <Container>
                    <Row className="align-items-center">
                        <Col xs={6}>
                            <h4 className="m-0 text-primary" onClick={()=>navigate('/')}>로고</h4>
                        </Col>

                        <Col xs={6}>
                            <div className={"d-flex justify-content-end"} style={{gap: "10px"}}>
                                <div className="text-secondary cursor-pointer" onClick={()=>navigate('/Login')}>로그인</div>
                                <div className="text-secondary cursor-pointer" onClick={()=>navigate('/SignUp')}>회원가입</div>
                            </div>
                        </Col>

                    </Row>
                </Container>

            </div>
        <Outlet/>
        </>
    );
};

export default Gnb;