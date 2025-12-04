import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DiaryEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();          // URL의 :id
    const location = useLocation();
    const year = location.state?.year;
    const month = location.state?.month;
    const numericId = Number(id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // 처음 들어왔을 때 해당 일지 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. 본인 확인
                const authRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/isMeDaily`,
                    { calender_id: numericId },
                    { withCredentials: true }
                );
                
                if (!authRes.data.isMe) {
                    alert("수정 권한이 없습니다.");
                    navigate("/diary/list");
                    return;
                }

                // 2. 상세 데이터 조회
                const detailRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/detailDaily/${id}`, {
                    withCredentials: true
                });
                
                const data = detailRes.data.data;
                if (data) {
                    setTitle(data.title);
                    setContent(data.content);
                    // "YYYY-MM-DD" 형식 추출
                    setDate(data.use_date_local ? data.use_date_local.substr(0, 10) : "");
                } else {
                    setNotFound(true);
                }

            } catch (e) {
                console.error("Data fetch error:", e);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [numericId, id, navigate]);

    const handleCancel = () => {
        if (window.confirm("수정을 취소하고 뒤로 가시겠습니까?")) {
            navigate(-1);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 일지를 삭제하시겠습니까?")) return;
        
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/delDaily`, 
                { id: numericId }, 
                { withCredentials: true }
            );

            if (res.data.state === 200) {
                alert("일지가 삭제되었습니다.");
                navigate(-1); // 리스트로 이동
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (e) {
            console.error("Delete error:", e);
            alert("서버 오류가 발생했습니다.");
        }
    };

    const handleResubmit = async () => {
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
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/updateDaily`,
                {
                    id: numericId,
                    title: title,
                    content: content,
                    use_date: date
                },
                { withCredentials: true }
            );

            if (res.data.status === 200) {
                alert("일지가 수정되었습니다!");
                navigate(-1); // 리스트로 복귀
            } else {
                alert('수정 권한이 없거나 실패했습니다.');
            }
        } catch (e) {
            console.error("Update error:", e);
            alert("서버 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <Container fluid className="h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (notFound) {
        return (
            <Container fluid className="h-100 d-flex flex-column justify-content-center align-items-center">
                <div style={{ fontSize: "1.2rem", color: "#adb5bd", marginBottom: "20px" }}>
                    존재하지 않는 일지입니다.
                </div>
                <Button 
                    onClick={() => navigate(-1)}
                    style={{ borderRadius: "20px", padding: "8px 20px" }}
                    variant="outline-secondary"
                >
                    돌아가기
                </Button>
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
                    나의 일지 수정
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 */}
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

            {/* 3. 하단 액션바 */}
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
                {/* 왼쪽: 취소 */}
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

                {/* 오른쪽: 삭제 / 수정 */}
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        style={{
                            borderRadius: "12px",
                            padding: "10px 20px",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            backgroundColor: "#fff0f3", // 연한 빨강
                            color: "#e03131",
                            border: "none"
                        }}
                    >
                        삭제
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleResubmit}
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
            </div>
        </Container>
    );
};

export default DiaryEditPage;