import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const DiaryListPage = () => {
    const navigate = useNavigate();
    const { year: yy, month: mm } = useParams();
    
    // 현재 날짜 설정
    const now = new Date();
    const currentYear = yy ? Number(yy) : now.getFullYear();
    const currentMonth = mm ? Number(mm) : now.getMonth() + 1;

    // 선택된 연/월 상태값
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    // 데이터 상태
    const [diaries, setDiaries] = useState([]);
    
    // [수정] 페이지네이션 6개로 축소 (스크롤 방지)
    const [currentPage, setCurrentPage] = useState(1);
    const diariesPerPage = 8; 

    // 📌 백엔드 데이터 불러오기
    const fetchDiary = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/daily/${year}/${month}`, {
                withCredentials: true,
            });
            setDiaries(res.data.data || []);
            setCurrentPage(1);
        } catch (err) {
            console.error("Diary fetch error:", err);
            setDiaries([]);
        }
    };

    useEffect(() => {
        fetchDiary();
    }, [year, month]);

    // 데이터 정렬 및 페이징 계산
    const sorted = [...diaries].sort(
        (a, b) => new Date(b.use_date || b.date) - new Date(a.use_date || a.date)
    );

    const totalPages = Math.ceil(sorted.length / diariesPerPage) || 1;
    const indexOfLast = currentPage * diariesPerPage;
    const indexOfFirst = indexOfLast - diariesPerPage;
    const currentDiaries = sorted.slice(indexOfFirst, indexOfLast);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
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
            {/* 1. 상단 헤더 */}
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
                    나의 일지 리스트
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 (스크롤 최소화) */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f8f9fa", 
                    minHeight: 0
                }}
            >
                {/* 컨트롤 바 (연/월 선택 + 등록 버튼) */}
                <Row className="align-items-center mb-3 g-2">
                    <Col xs="auto" className="d-flex gap-2">
                        <Form.Select
                            size="sm"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            style={{
                                height: "30px",
                                width: "90px",
                                borderRadius: "12px",
                                border: "1px solid #e9ecef",
                                backgroundColor: "#fff",
                                fontWeight: "600",
                                color: "#495057",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                fontSize: "0.9rem"
                            }}
                        >
                            {[2026, 2025, 2024, 2023].map(y => (
                                <option key={y} value={y}>{y}년</option>
                            ))}
                        </Form.Select>

                        <Form.Select
                            size="sm"
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            style={{
                                width: "70px",
                                borderRadius: "12px",
                                border: "1px solid #e9ecef",
                                backgroundColor: "#fff",
                                fontWeight: "600",
                                color: "#495057",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                fontSize: "0.9rem"
                            }}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col className="text-end">
                        <Button
                            onClick={() => navigate("/diary/write")}
                            style={{
                                marginLeft: "50px",
                                borderRadius: "20px",
                                fontWeight: "700",
                                fontSize: "0.9rem",
                                padding: "8px 18px",
                                backgroundColor: "#4dabf7", 
                                border: "none",
                                boxShadow: "0 4px 6px rgba(77, 171, 247, 0.2)",
                                transition: "all 0.2s"
                            }}
                        >
                            일지 쓰기
                        </Button>
                    </Col>
                </Row>

                {/* 테이블 영역 (카드 스타일) */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        border: "1px solid #f1f3f5"
                    }}>
                        <Table
                            hover
                            className="mb-0"
                            style={{ textAlign: "center", fontSize: "0.9rem", tableLayout: "fixed" }}
                        >
                            <thead style={{ backgroundColor: "#fff" }}>
                                <tr>
                                    <th style={{ width: "15%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>NO</th>
                                    <th style={{ width: "25%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>DATE</th>
                                    <th style={{ width: "60%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>TITLE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDiaries.length > 0 ? (
                                    currentDiaries.map((d, idx) => (
                                        <tr
                                            key={d.calender_id || idx}
                                            style={{ cursor: "pointer", transition: "background-color 0.1s" }}
                                            className="align-middle"
                                            onClick={() => navigate(`/diary/edit/${d.calender_id}`, { state: { year, month } })}
                                        >
                                            <td style={{ padding: "16px 10px", color: "#adb5bd", fontSize: "0.85rem", borderBottom: "1px solid #f8f9fa" }}>
                                                {/* 역순 번호 */}
                                                {sorted.length - ((currentPage - 1) * diariesPerPage) - idx}
                                            </td>
                                            <td style={{ padding: "16px 10px", color: "#4dabf7", fontWeight: "600", fontSize: "0.85rem", borderBottom: "1px solid #f8f9fa" }}>
                                                {d.use_date ? d.use_date.substring(5, 10) : "-"}
                                            </td>
                                            <td style={{
                                                padding: "16px 10px",
                                                textAlign: "left",
                                                fontWeight: "500",
                                                color: "#343a40",
                                                borderBottom: "1px solid #f8f9fa",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                {d.title}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} style={{ padding: "50px 0", color: "#adb5bd", borderBottom: "none" }}>
                                            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📝</div>
                                            작성된 일지가 없습니다.
                                        </td>
                                    </tr>
                                )}
                                
                                {/* [수정] 빈 행 채우기 (스타일 유지용) - 6개 기준 */}
                                {Array.from({ length: Math.max(0, diariesPerPage - currentDiaries.length) }).map((_, idx) => (
                                    <tr key={`empty-${idx}`}>
                                        <td style={{ padding: "6px 10px", color: "transparent", borderBottom: "1px solid #f8f9fa" }}>-</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* 3. 하단 페이지네이션 영역 (고정) */}
            <div
                style={{
                    padding: "15px",
                    borderTop: "1px solid #f1f3f5",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                    paddingBottom: "max(15px, env(safe-area-inset-bottom))",
                    gap: "8px"
                }}
            >
                <Button
                    variant="light"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        borderRadius: "12px",
                        width: "36px",
                        height: "36px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        color: currentPage === 1 ? "#dee2e6" : "#495057",
                        border: "none",
                        fontSize: "1rem"
                    }}
                >
                    &lt;
                </Button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        onClick={() => goToPage(p)}
                        style={{
                            borderRadius: "12px",
                            width: "36px",
                            height: "36px",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: p === currentPage ? "800" : "500",
                            border: "none",
                            backgroundColor: p === currentPage ? "#4dabf7" : "transparent",
                            color: p === currentPage ? "#fff" : "#868e96",
                            boxShadow: p === currentPage ? "0 4px 6px rgba(77, 171, 247, 0.3)" : "none",
                            transition: "all 0.2s"
                        }}
                    >
                        {p}
                    </Button>
                ))}

                <Button
                    variant="light"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        borderRadius: "12px",
                        width: "36px",
                        height: "36px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        color: currentPage === totalPages ? "#dee2e6" : "#495057",
                        border: "none",
                        fontSize: "1rem"
                    }}
                >
                    &gt;
                </Button>
            </div>
        </Container>
    );
};

export default DiaryListPage;