import React, { useRef, useState } from "react";
import CurrentMap from "../Map/CurrentMap";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const HospitalSearch = () => {
    const mapRef = useRef(null);
    const [keyword, setKeyword] = useState("");

    // 기능 함수들
    const handleSearch = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
        mapRef.current?.searchHospitals(keyword);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <Container
            fluid
            style={{
                height: "100%",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                overflow: "hidden"
            }}
        >
            {/* 1. 상단 헤더 (BoardList와 동일) */}
            <div
                style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #f1f3f5",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    height: "60px",
                    zIndex: 10,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
            >
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#343a40", letterSpacing: "-0.5px" }}>
                    동물병원 조회
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 (검색창 + 지도) */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    backgroundColor: "#f8f9fa", // 배경색 통일
                    overflow: "hidden"
                }}
            >
                {/* 검색창 */}
                <Row className="align-items-center mb-3 g-2" style={{ flexShrink: 0 }}>
                    <Col xs>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="지역명 또는 병원명 입력"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#fff",
                                    border: "1px solid #e9ecef",
                                    padding: "10px 15px",
                                    fontSize: "0.95rem",
                                    color: "#333",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
                                }}
                            />
                            <span 
                                onClick={handleSearch}
                                style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#4dabf7", cursor: "pointer" }}
                            >
                                🔍
                            </span>
                        </div>
                    </Col>
                </Row>

                {/* 지도 영역 (카드 스타일 적용) */}
                <div style={{ 
                    flex: 1, 
                    borderRadius: "16px", 
                    overflow: "hidden", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f3f5",
                    position: "relative",
                    backgroundColor: "#e9ecef"
                }}>
                    <CurrentMap ref={mapRef} />
                </div>
            </div>

            {/* 3. 하단 액션바 (기능 버튼 모음) */}
            <div
                style={{
                    padding: "15px",
                    borderTop: "1px solid #f1f3f5",
                    backgroundColor: "#fff",
                    flexShrink: 0,
                    paddingBottom: "max(15px, env(safe-area-inset-bottom))"
                }}
            >
                <Row className="g-2">
                    <Col xs={6}>
                        <Button
                            variant="light"
                            className="w-100"
                            onClick={() => mapRef.current?.goMyLocation()}
                            style={{
                                borderRadius: "12px",
                                fontWeight: "600",
                                color: "#495057",
                                backgroundColor: "#f8f9fa",
                                border: "none",
                                padding: "10px"
                            }}
                        >
                            📍 내 위치
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            variant="light"
                            className="w-100"
                            onClick={() => mapRef.current?.toggleMarkers()}
                            style={{
                                borderRadius: "12px",
                                fontWeight: "600",
                                color: "#495057",
                                backgroundColor: "#f8f9fa",
                                border: "none",
                                padding: "10px"
                            }}
                        >
                            👁 마커 토글
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            onClick={() => mapRef.current?.searchHospitals("동물병원")}
                            style={{
                                marginTop : "10px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                backgroundColor: "#4dabf7", // 브랜드 컬러
                                border: "none",
                                padding: "10px",
                                boxShadow: "0 2px 4px rgba(77, 171, 247, 0.2)"
                            }}
                        >
                            🏥 주변 병원
                        </Button>
                    </Col>
                    <Col xs={6}>
                        <Button
                            className="w-100"
                            onClick={() => mapRef.current?.openRoute()}
                            style={{
                                marginTop : "10px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                backgroundColor: "#40c057", // 길찾기는 녹색
                                border: "none",
                                padding: "10px",
                                boxShadow: "0 2px 4px rgba(64, 192, 87, 0.2)"
                            }}
                        >
                            🚀 길찾기
                        </Button>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default HospitalSearch;