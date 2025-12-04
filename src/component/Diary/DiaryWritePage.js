import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryWritePage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    // 기본값: 오늘 날짜 (YYYY-MM-DD 형식)
    const [date, setDate] = useState(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    });

    const handleSubmit = async (e) => {
        // Form의 기본 submit 동작 방지 (엔터키 등)
        if (e) e.preventDefault();

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

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/createDaily`,
                {
                    title: title.trim(),
                    content: content.trim(),
                    use_date: date
                }, 
                { withCredentials: true }
            );

            if (res.data.status === 200) {
                alert("일지가 등록되었습니다.");
                navigate("/diary/list");
            } else {
                alert("등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("Diary create error:", err);
            alert("서버 오류가 발생했습니다.");
        }
    };

    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까?")) {
            navigate(-1); 
        }
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
                    나의 일지 등록
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 (스크롤 가능) */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f8f9fa", // 배경색 연한 회색
                    minHeight: 0
                }}
            >
                <div style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "16px", 
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f3f5"
                }}>
                    <Form>
                        {/* 날짜 선택 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "700", color: "#495057", marginBottom: "8px", fontSize: "0.9rem" }}>
                                날짜
                            </Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "#f8f9fa",
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "1rem",
                                    color: "#333"
                                }}
                            />
                        </Form.Group>

                        {/* 제목 입력 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "700", color: "#495057", marginBottom: "8px", fontSize: "0.9rem" }}>
                                제목
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="제목을 입력해주세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "#f8f9fa",
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "1rem",
                                    color: "#333"
                                }}
                            />
                        </Form.Group>

                        {/* 내용 입력 */}
                        <Form.Group className="mb-2">
                            <Form.Label style={{ fontWeight: "700", color: "#495057", marginBottom: "8px", fontSize: "0.9rem" }}>
                                내용
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                placeholder="오늘의 일지를 작성해주세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "#f8f9fa",
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "1rem",
                                    resize: "none",
                                    color: "#333",
                                    lineHeight: "1.6"
                                }}
                            />
                        </Form.Group>
                    </Form>
                </div>
            </div>

            {/* 3. 하단 액션바 (고정 영역) */}
            <div
                style={{
                    padding: "15px",
                    borderTop: "1px solid #f1f3f5",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between", 
                    alignItems: "center",
                    flexShrink: 0,
                    paddingBottom: "max(15px, env(safe-area-inset-bottom))"
                }}
            >
                <Button
                    variant="light"
                    onClick={handleCancel}
                    style={{
                        borderRadius: "12px",
                        padding: "10px 24px",
                        fontWeight: "600",
                        color: "#495057",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        fontSize: "0.95rem"
                    }}
                >
                    취소
                </Button>

                <Button
                    variant="primary"
                    onClick={() => handleSubmit()}
                    style={{
                        borderRadius: "12px",
                        padding: "10px 24px",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        backgroundColor: "#4dabf7", // 브랜드 컬러
                        border: "none",
                        boxShadow: "0 4px 6px rgba(77, 171, 247, 0.2)"
                    }}
                >
                    등록 완료
                </Button>
            </div>
        </Container>
    );
};

export default DiaryWritePage;