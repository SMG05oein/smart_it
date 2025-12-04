import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 원래 있던 더미 데이터 유지 (서버 연결 실패 시 백업용)
const dummyPosts = [
    { id: 32, title: "강아지가 아파요", author: "user_id", date: "2025-10-10" },
    { id: 31, title: "강아지 귀여워ㅠㅠ", author: "user_id", date: "2025-10-10" },
    { id: 30, title: "배고파", author: "user_id", date: "2025-10-10" },
    { id: 29, title: "뭐 먹고 싶어?", author: "user_id", date: "2025-10-10" },
    { id: 28, title: "김치찌개가 먹고 싶어", author: "user_id", date: "2025-10-10" },
    { id: 27, title: "집사가 돌아왔지", author: "user_id", date: "2025-10-10" },
    { id: 26, title: "너가 제일 좋아하지 해", author: "user_id", date: "2025-10-10" },
    { id: 25, title: "또 엄청나 돌아가지롱", author: "user_id", date: "2025-10-10" },
    { id: 24, title: "마셔", author: "user_id", date: "2025-10-10" },
];

const BoardList = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    // 한 페이지당 게시글 수
    const postsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    // API 연동 상태
    const [totalPage, setTotalPage] = useState(1);
    const [totalContent, setTotalContent] = useState(0);
    const [data, setData] = useState([]);

    const goToPage = (p) => {
        if (p < 1 || p > totalPage) return;
        setCurrentPage(p);
    };

    // 1. 검색어 변경 감지 -> 페이지 리셋
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [keyword]);

    // 2. 메인 데이터 로드 (페이지 변경 또는 키워드 변경 시 실행)
    useEffect(() => {
        const pageToLoad = currentPage ?? 1;
        const trimmedKeyword = keyword ? keyword.trim() : "";
        const keywordPath = trimmedKeyword !== "" ? `/${trimmedKeyword}` : "";
        const url = `${process.env.REACT_APP_API_URL}/api/boardAll/${pageToLoad}${keywordPath}`;

        console.log("▶ 데이터 요청 URL:", url);

        axios.get(url)
            .then(r => {
                let result = r.data;
                // API 응답 구조에 맞춰 상태 업데이트
                if (result.data) {
                    setTotalPage(result.data.totalPages);
                    setData(result.data.data); // 실제 DB 데이터
                    setTotalContent(result.data.totalCount);
                    if (result.page) setCurrentPage(result.page);
                }
                console.log("▶ 데이터 수신 성공:", result);
            })
            .catch(error => {
                console.warn("게시글 조회 실패 (더미 데이터로 전환):", error);
                
                // [Fallback] 서버 연결 실패 시 더미 데이터 사용 로직
                const formattedDummy = dummyPosts.map(p => ({
                    board_id: p.id,
                    title: p.title,
                    user_id: p.author,
                    board_reg_date: p.date
                }));

                // 더미 데이터 검색 필터링
                const filtered = formattedDummy.filter(p => 
                    p.title.toLowerCase().includes(trimmedKeyword.toLowerCase())
                );

                // 더미 데이터 페이징
                const indexOfLast = pageToLoad * postsPerPage;
                const indexOfFirst = indexOfLast - postsPerPage;
                const slicedData = filtered.slice(indexOfFirst, indexOfLast);

                setData(slicedData);
                setTotalPage(Math.ceil(filtered.length / postsPerPage) || 1);
                setTotalContent(filtered.length);
            });

    }, [currentPage, keyword]);

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
            {/* 1. 상단 헤더 (AI 챗봇과 디자인 통일) */}
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
                    커뮤니티
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 */}
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
                {/* 검색 및 등록 버튼 영역 */}
                <Row className="align-items-center mb-3 g-2">
                    <Col xs>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="관심있는 내용을 검색해보세요"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
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
                            <span style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }}>
                                🔍
                            </span>
                        </div>
                    </Col>
                    <Col xs="auto">
                        <Button
                            onClick={() => navigate("/board/0")}
                            style={{
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
                            글쓰기
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
                                    <th style={{ width: "50%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>TITLE</th>
                                    <th style={{ width: "20%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>USER</th>
                                    <th style={{ width: "15%", padding: "15px 10px", borderBottom: "1px solid #f1f3f5", color: "#868e96", fontWeight: "600", fontSize: "0.8rem" }}>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((d, idx) => (
                                        <tr
                                            key={d.board_id}
                                            style={{ cursor: "pointer", transition: "background-color 0.1s" }}
                                            className="align-middle"
                                            onClick={() => navigate(`/board/${d.board_id}`)}
                                        >
                                            <td style={{ padding: "16px 10px", color: "#adb5bd", fontSize: "0.85rem", borderBottom: "1px solid #f8f9fa" }}>
                                                {/* 전체 글 수 기준 역순 번호 계산 */}
                                                {totalContent - (currentPage - 1) * postsPerPage - idx}
                                            </td>
                                            <td style={{
                                                padding: "16px 10px",
                                                textAlign: "left",
                                                fontWeight: "600",
                                                color: "#495057",
                                                borderBottom: "1px solid #f8f9fa",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                {d.title}
                                            </td>
                                            <td style={{ padding: "16px 10px", color: "#868e96", fontSize: "0.85rem", borderBottom: "1px solid #f8f9fa" }}>
                                                {d.user_id}
                                            </td>
                                            <td style={{ padding: "16px 10px", color: "#adb5bd", fontSize: "0.8rem", borderBottom: "1px solid #f8f9fa" }}>
                                                {d.board_reg_date ? d.board_reg_date.substring(5, 10) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: "60px 0", color: "#adb5bd", borderBottom: "none" }}>
                                            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</div>
                                            등록된 게시글이 없습니다.
                                        </td>
                                    </tr>
                                )}

                                {/* 빈 행 채우기 (스타일 유지용 - 8개 기준) */}
                                {Array.from({ length: Math.max(0, postsPerPage - data.length) }).map((_, idx) => (
                                    <tr key={`empty-${idx}`}>
                                        <td style={{ padding: "16px 10px", color: "transparent", borderBottom: "1px solid #f8f9fa" }}>-</td>
                                        <td style={{ padding: "16px 10px", color: "transparent", borderBottom: "1px solid #f8f9fa" }}>-</td>
                                        <td style={{ padding: "16px 10px", color: "transparent", borderBottom: "1px solid #f8f9fa" }}>-</td>
                                        <td style={{ padding: "16px 10px", color: "transparent", borderBottom: "1px solid #f8f9fa" }}>-</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* 3. 하단 페이지네이션 영역 */}
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

                {Array.from({ length: totalPage }, (_, idx) => idx + 1).map(
                    (p) => (
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
                    )
                )}

                <Button
                    variant="light"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPage}
                    style={{
                        borderRadius: "12px",
                        width: "36px",
                        height: "36px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        color: currentPage === totalPage ? "#dee2e6" : "#495057",
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

export default BoardList;