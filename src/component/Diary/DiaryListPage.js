// src/component/Diary/DiaryListPage.js
import React, {useEffect, useState} from "react";
import {Container, Row, Col, Table, Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const STORAGE_KEY = "diaryPosts";

// localStorage 에서 일지 목록 불러오기
const loadDiaries = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const DiaryListPage = () => {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [diaries, setDiaries] = useState([]);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const diariesPerPage = 10;

    // 처음 들어왔을 때 localStorage에서 로딩
    useEffect(() => {
        setDiaries(loadDiaries());
    }, []);

    // 검색 버튼 눌렀을 때만 실제 검색어 변경
    const handleSearch = () => {
        setKeyword(searchInput.trim());
        setCurrentPage(1);
    };

    // 최신 순 정렬
    const sorted = [...diaries].sort((a, b) => b.id - a.id);

    // 제목으로 필터
    const filtered = sorted.filter((d) =>
        d.title.toLowerCase().includes(keyword.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / diariesPerPage) || 1;
    const indexOfLast = currentPage * diariesPerPage;
    const indexOfFirst = indexOfLast - diariesPerPage;
    const currentDiaries = filtered.slice(indexOfFirst, indexOfLast);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex flex-column py-3"
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    paddingBottom: "70px", // FNB랑 안 겹치게 여백
                }}
            >
                {/* 상단 제목 */}
                <Row className="mb-2">
                    <Col>
                        <h5 style={{fontWeight: "bold"}}>나의 일지 리스트</h5>
                    </Col>
                </Row>

                {/* 검색 + 등록 버튼 */}
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
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="dark" size="sm" onClick={handleSearch}>
                            검색
                        </Button>
                    </Col>
                    <Col xs="auto" className="text-end">
                        {/* 수정 버튼: 아래 목록에서 클릭해서 수정하라는 안내용 */}
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-1"
                            onClick={() =>
                                alert("수정할 일지를 아래 목록에서 클릭해주세요.")
                            }
                        >
                            수정
                        </Button>

                        {/* 등록 버튼 */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/diary/write")}
                        >
                            등록
                        </Button>
                    </Col>
                </Row>

                {/* 리스트 테이블 */}
                <Row className="flex-grow-1">
                    <Col className="d-flex flex-column">
                        <div
                            style={{
                                border: "1px solid #007bff",
                                borderRadius: "4px",
                                overflow: "hidden",
                                flexGrow: 1,
                                minHeight: "280px",
                            }}
                        >
                            <Table
                                bordered
                                hover
                                size="sm"
                                className="mb-0 h-100"
                                style={{textAlign: "center", fontSize: "0.85rem"}}
                            >
                                <thead>
                                <tr style={{backgroundColor: "#e9f3ff"}}>
                                    <th style={{width: "10%"}}>No</th>
                                    <th style={{width: "40%"}}>제목</th>
                                    <th style={{width: "30%"}}>내용</th>
                                    <th style={{width: "20%"}}>날짜</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentDiaries.map((d, idx) => (
                                    <tr
                                        key={d.id}
                                        style={{cursor: "pointer"}}
                                        onClick={() => navigate(`/diary/edit/${d.id}`)}
                                    >
                                        <td>{indexOfFirst + idx + 1}</td>
                                        <td style={{textAlign: "left"}}>{d.title}</td>
                                        <td style={{textAlign: "left"}}>
                                            {d.content.length > 15
                                                ? d.content.slice(0, 15) + "..."
                                                : d.content}
                                        </td>
                                        <td>{d.date}</td>
                                    </tr>
                                ))}
                                {currentDiaries.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>등록된 일지가 없습니다.</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>

                        {/* 페이지네이션 */}
                        <div
                            className="mt-2 d-flex justify-content-center align-items-center"
                            style={{fontSize: "0.8rem", gap: "4px"}}
                        >
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </Button>

                            {Array.from({length: totalPages}, (_, i) => i + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            page === currentPage
                                                ? "secondary"
                                                : "outline-secondary"
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

export default DiaryListPage;
