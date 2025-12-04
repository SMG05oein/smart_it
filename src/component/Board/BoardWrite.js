import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BoardWrite = () => {
    // 🔹 글쓰기 화면이 렌더링될 때마다 찍힘
    console.log("▶ BoardWrite 컴포넌트 렌더링");

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // ▶ 게시글 등록
    const handleSubmit = async () => {
        console.log("▶ BoardWrite handleSubmit 실행됨", { title, content });

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            console.log("▶ /createBoard 요청 보내는 중...");

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/createBoard`, // 필요하면 /api/createBoard 로 수정
                {
                    title: title.trim(),
                    content: content.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            console.log("▶ /createBoard 응답:", res);

            // swagger 기준 201 성공
            if (res.status === 201 || res.data?.code === 201) {
                alert("게시글이 등록되었습니다.");
                navigate("/board");
            } else {
                alert("게시글 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("▶ /createBoard 에러:", err);
            const status = err.response?.status;

            if (status === 400) {
                alert("필수 항목 누락 또는 로그인 상태가 아닙니다.");
            } else if (status === 404) {
                alert("서버의 /createBoard 주소를 찾을 수 없습니다.");
            } else {
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm("글 작성을 취소하시겠습니까?")) {
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
            {/* 1. 상단 헤더 (디자인 통일) */}
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
                    게시글 등록
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
                        <Form.Group className="mb-4">
                            <Form.Label style={{ fontWeight: "700", color: "#495057", marginBottom: "8px", fontSize: "0.95rem" }}>
                                제목
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="제목을 입력해주세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    borderRadius: "12px",
                                    backgroundColor: "#f8f9fa", // 입력창 배경 회색
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "1rem",
                                    color: "#333"
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label style={{ fontWeight: "700", color: "#495057", marginBottom: "8px", fontSize: "0.95rem" }}>
                                내용
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                placeholder="내용을 입력해주세요"
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
                    justifyContent: "space-between", // 양쪽 정렬
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
                    onClick={handleSubmit}
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
                    등록
                </Button>
            </div>
        </Container>
    );
};

export default BoardWrite;