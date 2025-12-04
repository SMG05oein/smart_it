import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BoardEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 초기값 설정 (location.state가 없으면 빈 값)
    const initialPost = location.state || { title: "", content: "" };

    const [title, setTitle] = useState(initialPost.title);
    const [content, setContent] = useState(initialPost.content);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 권한 체크
    useEffect(() => {
        // location.state가 없거나 비정상적인 경우 1차 필터링
        if (!initialPost.title && !initialPost.content) {
            // (필요 시 API로 데이터를 다시 불러오는 로직을 여기에 추가 가능)
            // 현재는 간단히 경고 후 이동
            alert("잘못된 접근입니다.");
            navigate("/board");
            return;
        }

        const checkPermission = async () => {
            try {
                // 본인 확인 API (주석 해제 후 사용)
                const res = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/isMeBoard`, 
                    { boardId: id }, 
                    { withCredentials: true }
                );
                if (!res.data.isMe) {
                    alert("수정 권한이 없습니다.");
                    navigate("/board");
                }
               // 테스트용: 로딩 시늉만 하고 통과
               setTimeout(() => setLoading(false), 300);

            } catch (error) {
                console.error("권한 확인 실패:", error);
                navigate("/board");
                setLoading(false);
            }
        };

        checkPermission();
    }, [id, navigate, initialPost]);

    // 수정 요청
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
            console.log("▶ 수정 요청:", { id, title, content });

            // API 호출 (주석 해제 후 사용)
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/updateBoard`,
                {
                    boardId: Number(id),
                    title: title.trim(),
                    content: content.trim(),
                },
                { withCredentials: true }
            );

            if (res.status === 200) {
                alert("게시글이 수정되었습니다.");
                navigate(`/board/${id}`);
            } else {
                alert("수정에 실패했습니다.");
            }

            // 테스트용 성공 처리
            // alert("게시글이 수정되었습니다.");
            navigate(`/board/${id}`);

        } catch (err) {
            console.error("수정 에러:", err);
            const status = err.response?.status;
            if (status === 400) alert("권한이 없거나 잘못된 요청입니다.");
            else if (status === 404) alert("게시글을 찾을 수 없습니다.");
            else alert("서버 오류가 발생했습니다.");
        }
    };

    const handleCancel = () => {
        if (window.confirm("수정을 취소하고 뒤로 가시겠습니까?")) {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <Container fluid className="h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

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
            {/* 1. 상단 헤더 (통일된 디자인) */}
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
                    게시글 수정
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
                    onClick={handleUpdate}
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
                    수정 완료
                </Button>
            </div>
        </Container>
    );
};

export default BoardEdit;