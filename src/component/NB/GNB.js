import React, { useEffect, useState } from 'react';
import './NB.style.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

const Gnb = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setIsLogin] = useState(false);

    // 주소가 바뀔 때마다 localStorage에서 로그인 상태 갱신
    useEffect(() => {
        const flag = localStorage.getItem("isLogin") === "true";
        setIsLogin(flag);
    }, [location]);

    const handleLogout = () => {
        // 필요하면 여기서 서버 로그아웃 API 호출 가능

        localStorage.removeItem("isLogin");
        localStorage.removeItem("userId");

        setIsLogin(false);
        navigate("/");
    };

    return (
        <>
            <div className="border-bottom py-3" style={{ maxHeight: '60px' }}>
                <Container>
                    <Row className="align-items-center">
                        {/* 로고 */}
                        <Col xs={6}>
                            <h4
                                className="m-0 text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate('/')}
                            >
                                로고
                            </h4>
                        </Col>

                        {/* 오른쪽: 로그인 전/후 버튼 변경 */}
                        <Col xs={6}>
                            <div className={"d-flex justify-content-end"} style={{ gap: "10px" }}>
                                {isLogin ? (
                                    <>
                                        <div
                                            className="text-secondary cursor-pointer"
                                            onClick={() => navigate('/mypage')}
                                        >
                                            마이페이지
                                        </div>
                                        <div
                                            className="text-secondary cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            로그아웃
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="text-secondary cursor-pointer"
                                            onClick={() => navigate('/Login')}
                                        >
                                            로그인
                                        </div>
                                        <div
                                            className="text-secondary cursor-pointer"
                                            onClick={() => navigate('/SignUp')}
                                        >
                                            회원가입
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Outlet />
        </>
    );
};

export default Gnb;
