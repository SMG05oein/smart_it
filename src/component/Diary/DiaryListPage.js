// src/component/Diary/DiaryListPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import "./daily.style.css"

const DiaryListPage = () => {
    const navigate = useNavigate();
    const {year: yy, month: mm} = useParams();
    // 현재 날짜
    const now = new Date();
    const currentYear = yy ? Number(yy) : now.getFullYear();
    const currentMonth = mm ? Number(mm) : now.getMonth() + 1;

    // 선택된 연/월 상태값
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    // 받아온 일지 데이터
    const [diaries, setDiaries] = useState([]);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const diariesPerPage = 10;

    // 📌 ⭐ 백엔드 데이터 불러오기
    const fetchDiary = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/daily/${year}/${month}`, {
                withCredentials: true, // 쿠키 필요할 경우
            });

            setDiaries(res.data.data);
            setCurrentPage(1);

        } catch (err) {
            console.error("Diary fetch error:", err);
            setDiaries([]);
        }
    };

    // 연/월 바뀌면 자동 조회
    useEffect(() => {
        fetchDiary();
    }, [year, month]);

    // 페이지 계산
    const sorted = [...diaries].sort(
        (a, b) => new Date(b.use_date) - new Date(a.use_date)
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
        <Container fluid className="h-100 d-flex flex-column py-3" style={{ maxWidth: "900px", margin: "0 auto" }}>

            {/* 제목 */}
            <Row className="mb-2">
                <Col>
                    <h5 style={{ fontWeight: "bold" }}>나의 일지 리스트</h5>
                </Col>
            </Row>

            {/* 연/월 선택 */}
            <Row className="justify-content-between align-items-center mb-2">
                <Col xs="auto" className="d-flex gap-2">
                    <select
                        className="form-control form-control-sm"
                        style={{ width: "80px" }}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                        <option value={2026}>2026년</option>
                        <option value={2025}>2025년</option>
                        <option value={2024}>2024년</option>
                        <option value={2023}>2023년</option>
                    </select>

                    <select
                        className="form-control form-control-sm"
                        style={{ width: "80px" }}
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {m}월
                            </option>
                        ))}
                    </select>
                </Col>

                <Col xs="auto" className="text-end d-flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => navigate("/diary/write")}>
                        등록
                    </Button>
                </Col>
            </Row>

            {/* 테이블 */}
            <Row className="flex-grow-1">
                <Col className="d-flex flex-column">
                    <div style={{
                        border: "1px solid #007bff",
                        borderRadius: "4px",
                        overflow: "hidden",
                        flexGrow: 1,
                        minHeight: "280px",
                    }}>
                        <Table bordered hover size="sm" className="mb-0" style={{ textAlign: "center", fontSize: "0.85rem" }}>
                            <thead>
                            <tr style={{ backgroundColor: "#e9f3ff" }}>
                                <th>No</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>날짜</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentDiaries.map((d, idx) => (
                                <tr key={d.calender_id} style={{ cursor: "pointer" }}>
                                    <td>{indexOfFirst + idx + 1}</td>
                                    <td style={{ textAlign: "left" }} onClick={() => navigate(`/diary/edit/${d.calender_id}`)}>{d.title}</td>
                                    <td style={{ textAlign: "left" }}>
                                        {d.content.length > 15 ? d.content.slice(0, 15) + "..." : d.content}
                                    </td>
                                    <td>{d.use_date_local}</td>
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
                    <div className="mt-2 d-flex justify-content-center align-items-center" style={{ fontSize: "0.8rem", gap: "4px" }}>
                        <Button variant="outline-secondary" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "secondary" : "outline-secondary"}
                                size="sm"
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button variant="outline-secondary" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;
                        </Button>
                    </div>
                </Col>
            </Row>

        </Container>
    );
};

export default DiaryListPage;
