// src/component/Diary/DiaryWritePage.js
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "diaryPosts";

const loadDiaries = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const saveDiaries = (arr) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const DiaryWritePage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // 기본값: 오늘 날짜
    const [date, setDate] = useState(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!date) {
            alert("날짜를 선택해주세요.");
            return;
        }

        const newDiary = {
            id: Date.now(), // 임시 ID (백엔드 연동 시 서버에서 받은 ID로 교체)
            title: title.trim(),
            content: content.trim(),
            date, // "YYYY-MM-DD"
        };

        const diaries = loadDiaries();
        const updated = [...diaries, newDiary];
        saveDiaries(updated);

        alert("일지가 등록되었습니다.");
        navigate("/diary/list");
    };

    const handleCancel = () => {
        navigate(-1); // 이전 페이지로
    };

    return (
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex justify-content-center align-items-center"
                style={{ paddingTop: "24px", paddingBottom: "70px" }} // FNB 고려
            >
                <Col
                    xs={12}
                    md={8}
                    lg={6}
                    style={{
                        border: "1px solid #777",
                        borderRadius: "4px",
                        padding: "16px 16px 12px",
                        backgroundColor: "#fff",
                    }}
                >
                    {/* 상단 제목 */}
                    <h5 style={{ marginBottom: "16px", fontWeight: "bold" }}>
                        나의 일지 등록
                    </h5>

                    {/* 입력 폼 (게시판 등록 화면과 비슷하게) */}
                    <Form onSubmit={handleSubmit}>
                        {/* 제목 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>제목</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="제목을 입력해주세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                size="sm"
                            />
                        </Form.Group>

                        {/* 내용 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>내용</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                placeholder="내용을 입력해주세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                size="sm"
                                style={{ resize: "none" }}
                            />
                        </Form.Group>

                        {/* 날짜 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>날짜</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                size="sm"
                            />
                        </Form.Group>

                        {/* 하단 버튼 */}
                        <div className="d-flex justify-content-end" style={{ gap: "6px" }}>
                            <Button variant="secondary" size="sm" onClick={handleCancel}>
                                취소
                            </Button>
                            <Button variant="primary" size="sm" type="submit">
                                등록
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Container>
        </div>
    );
};

export default DiaryWritePage;
