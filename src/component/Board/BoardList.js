// src/component/Board/BoardList.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const dummyPosts = [
    { id: 24, title: "마셔", author: "user_id", date: "2025-10-10" },
    { id: 25, title: "또 엄청나 돌아가지롱", author: "user_id", date: "2025-10-10" },
    { id: 26, title: "너가 제일 좋아하지 해", author: "user_id", date: "2025-10-10" },
    { id: 27, title: "집사가 돌아왔지", author: "user_id", date: "2025-10-10" },
    { id: 28, title: "김치찌개가 먹고 싶어", author: "user_id", date: "2025-10-10" },
    { id: 29, title: "뭐 먹고 싶어?", author: "user_id", date: "2025-10-10" },
    { id: 30, title: "배고파", author: "user_id", date: "2025-10-10" },
    { id: 31, title: "강아지 귀여워ㅠㅠ", author: "user_id", date: "2025-10-10" },
    { id: 32, title: "강아지가 아파요", author: "user_id", date: "2025-10-10" },
    // 실제로는 여기서 계속 데이터가 늘어난다고 생각하면 됨
];

const BoardList = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    // 🔹 한 페이지 당 글 수 = 10
    const postsPerPage = 10;

    // 🔹 항상 "최근 글 먼저" 보이도록 정렬 (id가 클수록 최근이라고 가정)
    const sorted = [...dummyPosts].sort((a, b) => b.id - a.id);

    // 검색 적용
    const filtered = sorted.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
    );

    // 페이지 관련 상태
    const [currentPage, setCurrentPage] = useState(1);

    // 검색어가 바뀌면 1페이지부터 다시 보기
    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    // 전체 페이지 수 (글 수에 따라 자동)
    const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;

    // 현재 페이지에 보여줄 데이터 잘라내기
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = filtered.slice(indexOfFirst, indexOfLast);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <Container
            fluid
            className="py-3"
            style={{ paddingBottom: "80px" }} // 아래 FNB 공간
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
                    <Button variant="primary" size="sm">
                        등록
                    </Button>
                </Col>
            </Row>

            {/* 게시글 리스트 테이블 */}
            <Row>
                <Col>
                    <div
                        style={{
                            border: "1px solid #007bff",
                            borderRadius: "4px",
                            overflow: "hidden",
                        }}
                    >
                        <Table
                            bordered
                            hover
                            size="sm"
                            className="mb-0"
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
    );
};

export default BoardList;
