import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();

    // 로그인된 사용자 ID 가져오기
    const userId = localStorage.getItem("userId") || "로그인이 필요합니다";

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
                    마이페이지
                </span>
            </div>

            {/* 2. 중간 콘텐츠 영역 (프로필 카드) */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // 중앙 정렬
                    backgroundColor: "#f8f9fa", // 배경색 연한 회색
                    minHeight: 0
                }}
            >
                {/* 프로필 카드 */}
                <div style={{
                    width: "100%",
                    maxWidth: "400px", // 너무 넓어지지 않게 제한
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    padding: "30px 20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f3f5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px"
                }}>
                    {/* 프로필 아이콘 */}
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#e7f5ff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                        color: "#4dabf7",
                        fontSize: "2.5rem"
                    }}>
                        👤
                    </div>

                    {/* 사용자 정보 리스트 */}
                    <div style={{ width: "100%", marginBottom: "20px" }}>
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            padding: "15px 10px", 
                            borderBottom: "1px solid #f8f9fa" 
                        }}>
                            <span style={{ fontWeight: "600", color: "#868e96" }}>아이디</span>
                            <span style={{ fontWeight: "700", color: "#343a40" }}>{userId}</span>
                        </div>
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            padding: "15px 10px", 
                            borderBottom: "1px solid #f8f9fa" 
                        }}>
                            <span style={{ fontWeight: "600", color: "#868e96" }}>비밀번호</span>
                            <span style={{ fontWeight: "700", color: "#343a40", letterSpacing: "2px" }}>••••••••</span>
                        </div>
                    </div>

                    {/* 안내 문구 */}
                    <div style={{ 
                        backgroundColor: "#fff9db", 
                        padding: "12px", 
                        borderRadius: "12px", 
                        fontSize: "0.85rem", 
                        color: "#e67700",
                        width: "100%",
                        textAlign: "center",
                        lineHeight: "1.4"
                    }}>
                        🔒 개인정보 보호를 위해<br/>비밀번호는 표시되지 않습니다.
                    </div>
                </div>
            </div>

            {/* 3. 하단 액션바 (고정 영역) */}
            <div
                style={{
                    padding: "15px",
                    borderTop: "1px solid #f1f3f5",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0,
                    paddingBottom: "max(15px, env(safe-area-inset-bottom))",
                    gap: "10px"
                }}
            >
                <Button
                    variant="light"
                    onClick={() => navigate(-1)} // 뒤로가기
                    style={{
                        borderRadius: "12px",
                        padding: "12px 24px",
                        fontWeight: "600",
                        color: "#495057",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        fontSize: "0.95rem",
                        flex: 1, // 버튼 너비 균등 분배
                        maxWidth: "150px"
                    }}
                >
                    뒤로가기
                </Button>

                <Button
                    variant="primary"
                    onClick={() => navigate("/")}
                    style={{
                        borderRadius: "12px",
                        padding: "12px 24px",
                        fontWeight: "700",
                        fontSize: "0.95rem",
                        backgroundColor: "#4dabf7", // 브랜드 컬러
                        border: "none",
                        boxShadow: "0 4px 6px rgba(77, 171, 247, 0.2)",
                        flex: 1,
                        maxWidth: "150px"
                    }}
                >
                    홈으로
                </Button>
            </div>
        </Container>
    );
};

export default MyPage;