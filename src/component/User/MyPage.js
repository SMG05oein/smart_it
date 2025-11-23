// src/component/User/MyPage.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();

    // Login.js에서 localStorage.setItem("userId", id) 해 준 값
    const userId = localStorage.getItem("userId") || "로그인이 필요합니다";

    return (
        <div className="h-100">
            <Container
                fluid
                className="h-100 justify-content-center align-content-start"
                style={{ paddingTop: "20px" }}
            >
                {/* 제목 */}
                <Row className="mb-3">
                    <Col className="d-flex justify-content-center">
                        <h4>마이페이지</h4>
                    </Col>
                </Row>

                {/* 아이디 */}
                <Row className="mb-2">
                    <Col
                        xs={12}
                        md={6}
                        className="d-flex justify-content-between align-items-center mx-auto"
                        style={{ maxWidth: "400px" }}
                    >
                        <span style={{ fontWeight: "bold" }}>아이디</span>
                        <span>{userId}</span>
                    </Col>
                </Row>

                {/* 비밀번호 (실제 값은 표시 X, 마스크 + 안내문) */}
                <Row className="mb-2">
                    <Col
                        xs={12}
                        md={6}
                        className="d-flex justify-content-between align-items-center mx-auto"
                        style={{ maxWidth: "400px" }}
                    >
                        <span style={{ fontWeight: "bold" }}>비밀번호</span>
                        <span>********</span>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col
                        xs={12}
                        md={6}
                        className="mx-auto"
                        style={{ maxWidth: "400px", fontSize: "0.8rem", color: "#777" }}
                    >
                        ※ 보안을 위해 실제 비밀번호는 저장하거나 화면에 표시하지 않습니다.
                    </Col>
                </Row>

                {/* 버튼들 */}
                <Row className="mt-3">
                    <Col className="d-flex justify-content-center" style={{ gap: "10px" }}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(-1)}
                        >
                            뒤로가기
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/")}
                        >
                            홈으로
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyPage;
