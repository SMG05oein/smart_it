// src/component/Hospital/HospitalSearch.js
import React, { useRef, useState } from "react";
import CurrentMap from "../Map/CurrentMap";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const HospitalSearch = () => {
    const mapRef = useRef(null);
    const [keyword, setKeyword] = useState("동물병원");

    // 🔼 상단 검색창용: 입력된 keyword로 검색
    const handleSearch = () => {
        if (!mapRef.current) return;
        mapRef.current.searchHospitals(keyword);
    };

    const handleToggleMarkers = () => {
        mapRef.current?.toggleMarkers();
    };

    const handleGoMyLocation = () => {
        mapRef.current?.goMyLocation();
    };

    // 🔽 하단 파란 버튼용: 항상 "동물병원"으로 검색
    const handleSearchOnlyHospital = () => {
        if (!mapRef.current) return;
        mapRef.current.searchHospitals("동물병원");
    };

    const handleRoute = () => {
        mapRef.current?.openRoute();
    };

    return (
        <div className="Section">
            <Container
                fluid
                className="py-3"
                style={{ paddingBottom: "80px" }}
            >
                {/* 🔍 상단 검색 영역 */}
                <Row className="mb-2">
                    <Col xs={8}>
                        <Form.Control
                            type="text"
                            size="sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="예) 고양이 병원, 야간 동물병원..."
                        />
                    </Col>
                    <Col xs={4} className="text-end">
                        <Button
                            size="sm"
                            variant="primary"
                            className="w-100"
                            onClick={handleSearch}
                        >
                            검색
                        </Button>
                    </Col>
                </Row>

                {/* 안내 문구 */}
                <Row className="mb-3">
                    <Col className="text-center">
                        <div style={{ fontWeight: "bold" }}>동물병원 조회</div>
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            찾고자 하는 지역과 키워드를 입력한 후 검색을 눌러주세요
                        </div>
                    </Col>
                </Row>

                {/* 현재 위치 카카오맵 */}
                <Row className="mb-3">
                    <Col>
                        <CurrentMap ref={mapRef} />
                    </Col>
                </Row>

                {/* 아래 버튼들 */}
                <Row className="g-2">
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={handleToggleMarkers}
                        >
                            마커 표시/숨기기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={handleGoMyLocation}
                        >
                            내 위치 돌아가기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            variant="outline-secondary"
                            onClick={handleRoute}
                        >
                            길 찾기
                        </Button>
                    </Col>
                    <Col xs={6}>
                        {/* ⬇️ 항상 "동물병원"으로 검색 */}
                        <Button
                            className="w-100"
                            variant="primary"
                            onClick={handleSearchOnlyHospital}
                        >
                            동물병원 조회
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HospitalSearch;
