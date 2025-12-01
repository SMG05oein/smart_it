// src/component/Hospital/HospitalSearch.js
import React, { useRef } from "react";
import CurrentMap from "../Map/CurrentMap";
import { Container, Row, Col, Button } from "react-bootstrap";

const HospitalSearch = () => {
    const mapRef = useRef(null);

    return (
        <div className="Section">
            <Container
                fluid
                className="py-3"
                style={{ paddingBottom: "80px" }}
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

                {/* 현재 위치 카카오맵 */}
                <Row className="mb-3">
                    <Col>
                        {/* 버튼에서 조작할 수 있도록 ref 전달 */}
                        <CurrentMap ref={mapRef} />
                    </Col>
                </Row>

                {/* 아래 버튼 4개 */}
                <Row className="g-2">
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={() => mapRef.current?.toggleMarkers()}
                        >
                            마커 표시/숨기기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={() => mapRef.current?.goMyLocation()}
                        >
                            내 위치 돌아가기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={() => mapRef.current?.openRoute()}
                        >
                            길 찾기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="primary"
                            onClick={() => mapRef.current?.searchHospitals()}
                        >
                            검색
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HospitalSearch;
