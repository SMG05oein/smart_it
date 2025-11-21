import React from 'react';
import {CiChat2, CiHome, CiMap, CiViewBoard} from "react-icons/ci";
import {Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Fnb = () => {
    const navigate = useNavigate();
    return (
        <div className="FNB fixed-bottom bg-white border-top py-2" style={{height: '70px'}}>
            <Container fluid className="h-100 d-flex justify-content-center align-items-center">

                <Row className="w-100 h-100 m-0">
                    <Col xs={3} className="d-flex flex-column justify-content-center align-items-center text-center">
                        <i className="bi bi-search" style={{fontSize: '1.2rem'}}><CiMap /></i>
                        {/*<small>병원 조회</small>*/}
                    </Col>
                    <Col xs={3} className="d-flex flex-column justify-content-center align-items-center text-center">
                        <i className="bi bi-chat-dots" style={{fontSize: '1.2rem'}}><CiChat2 /></i>
                        {/*<small>챗봇</small>*/}
                    </Col>
                    <Col xs={3} className="d-flex flex-column justify-content-center align-items-center text-center">
                        <i className="bi bi-house-door" style={{fontSize: '1.2rem'}}><CiHome onClick={()=>navigate('/')}/></i>
                        {/*<small>홈</small>*/}
                    </Col>
                    <Col xs={3} className="d-flex flex-column justify-content-center align-items-center text-center">
                        <i className="bi bi-clipboard-check" style={{fontSize: '1.2rem'}}><CiViewBoard /></i>
                        {/*<small>게시판</small>*/}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Fnb;