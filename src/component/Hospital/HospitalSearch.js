// src/component/Hospital/HospitalSearch.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HospitalSearch = () => {
    return (
        <Container
            fluid
            className="py-3"
            style={{ paddingBottom: "80px" }} // 아래 FNB 높이만큼 여유
        >
            {/* 상단 안내 문구 */}
            <Row className="mb-3">
                <Col className="text-center">
                    <div style={{ fontWeight: "bold" }}>동물병원 조회</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        찾고자 하는 지역에 맞춘 후 검색을 눌러주세요
                    </div>
                </Col>
            </Row>

            {/* 가운데 카카오맵 자리 박스 */}
            <Row className="mb-3">
                <Col>
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            height: "350px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#aaa",
                            fontSize: "1.1rem",
                        }}
                    >
                        대충 카카오 맵 API
                    </div>
                </Col>
            </Row>

            {/* 아래 버튼 4개 (기능 없음, UI만) */}
            <Row className="g-2">
                <Col xs={6}>
                    <Button className="w-100" variant="outline-secondary">
                        마커 표시/숨기기
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button className="w-100" variant="outline-secondary">
                        내 위치 돌아가기
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button className="w-100" variant="outline-secondary">
                        길 찾기
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button className="w-100" variant="primary">
                        검색
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default HospitalSearch;
