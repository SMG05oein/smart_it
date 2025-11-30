// src/component/Board/BoardList.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// 필요 없으면 []로 두고 써도 됨
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

    // 한 페이지 10개
    const postsPerPage = 10;

    // 최근 글 먼저
    const sorted = [...dummyPosts].sort((a, b) => b.id - a.id);

    const filtered = sorted.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = filtered.slice(indexOfFirst, indexOfLast);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        // 🔹 Section을 써서 화면 높이 꽉 채우기
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex flex-column py-3"
                style={{
                    maxWidth: "900px",   // 전체 폭
                    margin: "0 auto",
                    paddingBottom: "70px", // FNB 만큼 여백
                }}
            >
                {/* 상단 제목 */}
                <Row className="mb-2">
                    <Col>
                        <h5 style={{ fontWeight: "bold" }}>게시판</h5>
                    </Col>
                </Row>

                {/* 검색 영역 */}
                <Row className="align-items-center mb-2">
                    <Col xs="auto">
                        <Button variant="outline-dark" size="sm">
                            제목 &gt;
                        </Button>
                    </Col>
                    <Col xs>
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="dark" size="sm">
                            검색
                        </Button>
                    </Col>
                    <Col xs="auto" className="text-end">
                        <Button onClick={()=>navigate("/board/0")} variant="primary" size="sm">
                            등록
                        </Button>
                    </Col>
                </Row>

                {/* 🔹 가운데 영역을 flex-grow로 키워서 화면을 꽉 채움 */}
                <Row className="flex-grow-1">
                    <Col className="d-flex flex-column">
                        {/* 테이블 박스 (세로로 넓게) */}
                        <div
                            style={{
                                border: "1px solid #007bff",
                                borderRadius: "4px",
                                overflow: "hidden",
                                flexGrow: 1,           // 남는 세로 공간 채우기
                                minHeight: "280px",    // 최소 높이
                            }}
                        >
                            <Table
                                bordered
                                hover
                                size="sm"
                                className="mb-0 h-100"
                                style={{ textAlign: "center", fontSize: "0.85rem" }}
                            >
                                <thead>
                                <tr style={{ backgroundColor: "#e9f3ff" }}>
                                    <th style={{ width: "10%" }}>No</th>
                                    <th style={{ width: "40%" }}>제목</th>
                                    <th style={{ width: "20%" }}>작성자</th>
                                    <th style={{ width: "30%" }}>등록일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentPosts.map((post) => (
                                    <tr
                                        key={post.id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate(`/board/${post.id}`)}
                                    >
                                        <td>{post.id}</td>
                                        <td style={{ textAlign: "left" }}>{post.title}</td>
                                        <td>{post.author}</td>
                                        <td>{post.date}</td>
                                    </tr>
                                ))}
                                {currentPosts.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>검색 결과가 없습니다.</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>

                        {/* 하단 페이지네이션 */}
                        <div
                            className="mt-2 d-flex justify-content-center align-items-center"
                            style={{ fontSize: "0.8rem", gap: "4px" }}
                        >
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </Button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            page === currentPage ? "secondary" : "outline-secondary"
                                        }
                                        size="sm"
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </Button>
                                )
                            )}

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &gt;
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BoardList;
