import React, { useEffect, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import BoardWrite from "./BoardWrite";
import axios from "axios";

// 더미 데이터 (테스트용)
const dummyPosts = [
    {
        id: 32,
        title: "강아지가 아파요",
        author: "user_id",
        date: "2025-10-10",
        content: "우리 강아지가 오늘부터 밥을 잘 안 먹어요...\n계속 잠만 자는데 병원에 가봐야 할까요? ㅠㅠ",
    },
    {
        id: 31,
        title: "강아지 귀여워ㅠㅠ",
        author: "user_id",
        date: "2025-10-10",
        content: "사진은 나중에 올릴게요 :)\n진짜 너무 귀엽지 않나요?",
    },
];

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const postId = Number(id);

    // 상태 관리
    const [data, setData] = useState([]);
    const [isMe, setIsMe] = useState(false); // 작성자 본인 여부
    const [loading, setLoading] = useState(true);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. 본인 확인 (API 연결 시 활성화)
                const meRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/isMeBoard`,
                    { boardId: postId },
                    { withCredentials: true }
                );
                setIsMe(meRes.data.isMe);
                // 테스트용: id가 32번이면 내 글이라고 가정
                if (postId === 32) setIsMe(true);

                // 2. 게시글 상세 조회 (API 연결 시 활성화)
                const detailRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/board/${postId}`);
                console.log(detailRes)
                if(!(detailRes.data.data.board_id)){
                    const dummy = dummyPosts.find(p => p.id === postId);
                    if (dummy) {
                        // API 응답 구조에 맞게 매핑
                        setData({
                            board_id: dummy.id,
                            title: dummy.title,
                            user_id: dummy.author,
                            board_reg_date: dummy.date,
                            board_update_date: dummy.date,
                            contents: dummy.content
                        });
                    } else {
                        setData(null);
                    }
                }else{
                    setData(detailRes.data.data);
                }


                // 테스트용: 더미 데이터에서 찾기

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId]);

    // ✅ 게시글 삭제 핸들러
    const handleDeletePost = async () => {
        if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;

        try {
            console.log("▶ 삭제 요청:", postId);
            // API 호출 (주석 해제 후 사용)
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/deleteBoard`,
                { boardId: postId },
                { withCredentials: true }
            );
            alert("게시글이 삭제되었습니다.");
            navigate("/board");
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    // 0번이면 글쓰기 화면 렌더링
    if (id == 0) {
        return <BoardWrite />;
    }

    // 로딩 중일 때
    if (loading) {
        return (
            <Container fluid className="h-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // 데이터가 없을 때
    if (!data) {
        return (
            <Container fluid className="h-100 d-flex flex-column justify-content-center align-items-center">
                <div style={{ fontSize: "1.2rem", color: "#adb5bd", marginBottom: "20px" }}>
                    존재하지 않는 게시글입니다.
                </div>
                <Button 
                    onClick={() => navigate("/board")}
                    style={{ borderRadius: "20px", padding: "8px 20px" }}
                    variant="outline-secondary"
                >
                    목록으로
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
            {/* 1. 상단 헤더 (게시판/챗봇과 통일) */}
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
                    커뮤니티
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
                    backgroundColor: "#f8f9fa", // 배경색 연한 회색 (카드 부각)
                    minHeight: 0
                }}
            >
                {/* 게시글 내용 카드 */}
                <div style={{ 
                    backgroundColor: "#fff", 
                    borderRadius: "16px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f3f5",
                    padding: "25px",
                    marginBottom: "20px"
                }}>
                    {/* 제목 영역 */}
                    <div style={{ borderBottom: "1px solid #f1f3f5", paddingBottom: "15px", marginBottom: "20px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#343a40", marginBottom: "12px", lineHeight: "1.4" }}>
                            {data.title}
                        </h4>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#868e96" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontWeight: "600", color: "#495057" }}>{data.user_id}</span>
                            </div>
                            <span>{data.board_reg_date?.substring(0, 10)}</span>
                        </div>
                    </div>

                    {/* 본문 영역 */}
                    <div style={{ 
                        fontSize: "1rem", 
                        lineHeight: "1.8", 
                        color: "#495057", 
                        whiteSpace: "pre-wrap", // 줄바꿈 적용
                        minHeight: "150px"
                    }}>
                        {data.contents}
                    </div>
                </div>

                {/* (추후 댓글 기능이 필요하면 여기에 추가) */}
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
                {/* 왼쪽: 목록 버튼 */}
                <Button
                    variant="light"
                    onClick={() => navigate("/board")}
                    style={{
                        borderRadius: "12px",
                        padding: "8px 20px",
                        fontWeight: "600",
                        color: "#495057",
                        backgroundColor: "#f8f9fa",
                        border: "none"
                    }}
                >
                    목록
                </Button>

                {/* 오른쪽: 수정/삭제 (본인일 때만 표시) */}
                {isMe && (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            variant="danger"
                            onClick={handleDeletePost}
                            style={{
                                borderRadius: "12px",
                                padding: "8px 16px",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                backgroundColor: "#fff0f3", // 연한 빨강 배경
                                color: "#e03131",
                                border: "none"
                            }}
                        >
                            삭제
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/board/edit/${postId}`, {
                                state: { title: data.title, content: data.contents }
                            })}
                            style={{
                                borderRadius: "12px",
                                padding: "8px 16px",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                backgroundColor: "#4dabf7",
                                border: "none",
                                boxShadow: "0 4px 6px rgba(77, 171, 247, 0.2)"
                            }}
                        >
                            수정
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default BoardDetail;