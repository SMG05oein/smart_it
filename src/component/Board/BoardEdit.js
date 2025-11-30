// src/component/Board/BoardEdit.js
import React, { useState } from "react";
import { Container, Col, Form, Button } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BoardEdit = () => {
    const { id } = useParams();              // URL의 :id -> 수정할 게시글 번호
    const navigate = useNavigate();
    const location = useLocation();

    // 상세 페이지에서 넘어올 때 제목/내용을 같이 넘겨줄 예정
    const initialPost = location.state || { title: "", content: "" };

    const [title, setTitle] = useState(initialPost.title);
    const [content, setContent] = useState(initialPost.content);

    // ▶ 수정 요청
    const handleUpdate = async () => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            console.log("▶ /updateBoard 요청 보냄", { id, title, content });

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/updateBoard`,
                {
                    boardId: Number(id),          // 중요: 수정할 글 번호
                    title: title.trim(),
                    content: content.trim(),
                },
                { withCredentials: true }
            );

            console.log("▶ /updateBoard 응답:", res);

            if (res.status === 200) {
                alert("게시글이 수정되었습니다.");
                // 수정 후 상세 화면으로 돌아가기
                navigate(`/board/${id}`);
            } else {
                alert("게시글 수정에 실패했습니다.");
            }
        } catch (err) {
            console.error("▶ /updateBoard 에러:", err);
            const status = err.response?.status;

            if (status === 400) {
                alert("게시글이 없거나 수정 권한이 없습니다.");
            } else if (status === 404) {
                alert("서버의 /updateBoard 주소를 찾을 수 없습니다.");
            } else {
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);   // 이전 페이지로
    };

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
                        게시글 수정
                    </h5>

                    <Form>
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

                        <div className="d-flex justify-content-end" style={{ gap: "6px" }}>
                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                onClick={handleCancel}
                            >
                                취소
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={handleUpdate}
                            >
                                수정
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Container>
        </div>
    );
};

export default BoardEdit;
