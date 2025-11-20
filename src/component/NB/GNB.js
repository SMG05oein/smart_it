import React from 'react';
import './NB.style.css'
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

const Gnb = () => {
    return (
        <>
            <div className="border-bottom py-3">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={6}>
                            <h4 className="m-0 text-primary">로고</h4>
                        </Col>

                        <Col xs={6}>
                            <div className={"d-flex justify-content-end"} style={{gap: "10px"}}>
                                <div className="text-secondary cursor-pointer">로그인</div>
                                <div className="text-secondary cursor-pointer">회원가입</div>
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