import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Col, Container, Row, Button } from "react-bootstrap";
import appLogo from "../assets/app-logo.png"; 
// import './NB.style.css'; // 기존 CSS가 방해된다면 주석 처리하세요.

const Gnb = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const flag = localStorage.getItem("isLogin") === "true";
        setIsLogin(true);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userId");
        setIsLogin(false);
        navigate("/");
    };

    const navButtonStyle = {
        borderRadius: "20px",
        padding: "6px 16px",
        fontSize: "0.9rem",
        fontWeight: "600",
        border: "none",
        transition: "all 0.2s",
        backgroundColor: "transparent",
        color: "#666"
    };

    return (
        <>
            {/* 상단 네비게이션 바 */}
            <div 
                className="sticky-top" // 상단 고정
                style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)", // 살짝 투명한 배경
                    backdropFilter: "blur(10px)", // 블러 효과 (아이폰 스타일)
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)", // 부드러운 그림자
                    zIndex: 1000
                }}
            >
                <Container>
                    <Row 
                        className="align-items-center" 
                        style={{ height: "65px" }} // 높이 살짝 키움
                    >
                        {/* 1. 왼쪽: 로고 영역 */}
                        <Col xs={6} className="d-flex align-items-center">
                            <div 
                                onClick={() => navigate('/')}
                                style={{ 
                                    cursor: "pointer", 
                                    display: "flex", 
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <img 
                                    src={appLogo} 
                                    alt="Logo" 
                                    style={{ 
                                        width: "36px", 
                                        height: "36px", 
                                        borderRadius: "10px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <span style={{ 
                                    fontSize: "1.2rem", 
                                    fontWeight: "800", 
                                    color: "#343a40",
                                    letterSpacing: "-0.5px"
                                }}>
                                    멍멍케어
                                </span>
                            </div>
                        </Col>

                        {/* 2. 오른쪽: 메뉴 영역 */}
                        <Col xs={6}>
                            <div className="d-flex justify-content-end align-items-center" style={{ gap: "5px" }}>
                                {isLogin ? (
                                    <>
                                        <Button 
                                            variant="light"
                                            style={{navButtonStyle,
                                                textWrap:'nowrap',
                                            }}
                                            onClick={() => navigate('/mypage')}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f1f3f5"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                        >
                                            마이페이지
                                        </Button>
                                        <Button 
                                            style={{
                                                textWrap:'nowrap',
                                                ...navButtonStyle,
                                                backgroundColor: "#4dabf7", // 로그아웃은 회색 배경
                                                color: "#fff",
                                            }}
                                            onClick={handleLogout}
                                        >
                                            로그아웃
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            variant="light"
                                            style={navButtonStyle}
                                            onClick={() => navigate('/Login')}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#e7f5ff";
                                                e.target.style.color = "#4dabf7";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "transparent";
                                                e.target.style.color = "#666";
                                            }}
                                        >
                                            로그인
                                        </Button>
                                        <Button 
                                            style={{
                                                ...navButtonStyle,
                                                backgroundColor: "#4dabf7", // 회원가입은 포인트 컬러(파랑)
                                                color: "#fff",
                                                padding: "6px 18px",
                                                boxShadow: "0 2px 4px rgba(77, 171, 247, 0.3)"
                                            }}
                                            onClick={() => navigate('/SignUp')}
                                        >
                                            회원가입
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            
            {/* 실제 컨텐츠가 렌더링되는 곳 */}
            <div style={{ minHeight: "calc(100vh - 65px)", backgroundColor: "#fff" }}>
                <Outlet />
            </div>
        </>
    );
};

export default Gnb;