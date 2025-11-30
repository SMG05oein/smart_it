// src/component/Diary/DiaryEditPage.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

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

const DiaryEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();          // URL의 :id
    const numericId = Number(id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // 처음 들어왔을 때 해당 일지 불러오기
    useEffect(() => {
        const diaries = loadDiaries();
        const target = diaries.find((d) => d.id === numericId);

        if (!target) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        setTitle(target.title);
        setContent(target.content);
        setDate(target.date);   // "YYYY-MM-DD"
        setLoading(false);
    }, [numericId]);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleDelete = () => {
        if (!window.confirm("이 일지를 삭제하시겠습니까?")) return;

        const diaries = loadDiaries();
        const updated = diaries.filter((d) => d.id !== numericId);
        saveDiaries(updated);

        alert("일지가 삭제되었습니다.");
        navigate("/diary/list");
    };

    const handleResubmit = (e) => {
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

        const diaries = loadDiaries();
        const updated = diaries.map((d) =>
            d.id === numericId
                ? {
                    ...d,
                    title: title.trim(),
                    content: content.trim(),
                    date,              // 날짜 변경 가능
                }
                : d
        );

        saveDiaries(updated);
        alert("일지가 수정되었습니다.");
        navigate("/diary/list");
    };

    if (loading) {
        return (
            <Container className="py-3">
                <div>불러오는 중...</div>
            </Container>
        );
    }

    if (notFound) {
        return (
            <Container className="py-3">
                <div>존재하지 않는 일지입니다.</div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate("/diary/list")}
                >
                    목록으로
                </Button>
            </Container>
        );
    }

    return (
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex justify-content-center align-items-center"
                style={{ paddingTop: "24px", paddingBottom: "70px" }}
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
                    <h5 style={{ marginBottom: "16px", fontWeight: "bold" }}>
                        나의 일지 수정
                    </h5>

                    <Form onSubmit={handleResubmit}>
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

                        {/* 아래 버튼: 취소 / 삭제 / 재등록 */}
                        <div className="d-flex justify-content-end" style={{ gap: "6px" }}>
                            <Button variant="secondary" size="sm" onClick={handleCancel}>
                                취소
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                onClick={handleDelete}
                            >
                                삭제
                            </Button>
                            <Button variant="primary" size="sm" type="submit">
                                재등록
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Container>
        </div>
    );
};

export default DiaryEditPage;
