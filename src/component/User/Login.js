import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');

    const login = async () => {
        if (!id.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }
        if (!pass.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/Login`, {
                userId: id,
                pass: pass,
            }, { withCredentials: true });

            console.log(res.data);

            if (res.data.status === 200) {
                // 로그인 성공 처리
                localStorage.setItem("isLogin", "true");
                localStorage.setItem("userId", id);
                navigate("/");
            } else {
                alert("아이디 또는 비밀번호가 맞지 않습니다.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("서버 통신 중 오류가 발생했습니다.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div className="user-wrapper">
            {/* 내부 스타일 정의 (회원가입 페이지와 통일) */}
            <style>
                {`
                    /* 전체 배경 및 중앙 정렬 */
                    .user-wrapper {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #fff;
                        padding: 20px;
                    }

                    /* 카드 박스 스타일 */
                    .user-card {
                        width: 100%;
                        max-width: 400px;
                        padding: 40px 30px;
                        border-radius: 20px;
                        background-color: #fff;
                        border: 1px solid #f1f3f5;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    }

                    /* 제목 스타일 */
                    .user-title {
                        font-size: 1.5rem;
                        font-weight: 800;
                        text-align: center;
                        color: #343a40;
                        margin-bottom: 30px;
                        letter-spacing: -0.5px;
                    }

                    /* 라벨 스타일 */
                    .form-label-custom {
                        font-size: 0.9rem;
                        font-weight: 700;
                        color: #495057;
                        margin-bottom: 8px;
                    }

                    /* 입력창 스타일 */
                    .form-control-custom {
                        border-radius: 12px !important;
                        border: 1px solid #dee2e6 !important;
                        padding: 12px 15px !important;
                        font-size: 0.95rem !important;
                        background-color: #f8f9fa !important;
                        transition: all 0.2s;
                    }

                    .form-control-custom:focus {
                        background-color: #fff !important;
                        border-color: #4dabf7 !important;
                        box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1) !important;
                    }

                    /* 버튼 스타일 */
                    .btn-custom {
                        border-radius: 12px !important;
                        font-weight: 700 !important;
                        padding: 12px !important;
                        font-size: 1rem !important;
                        border: none !important;
                    }

                    .btn-primary-custom {
                        background-color: #4dabf7 !important;
                        color: white !important;
                        box-shadow: 0 4px 6px rgba(77, 171, 247, 0.2);
                        margin-top: 10px;
                    }
                    .btn-primary-custom:hover {
                        background-color: #3b93d1 !important;
                        transform: translateY(-1px);
                    }

                    /* 하단 링크 스타일 */
                    .link-text {
                        font-size: 0.85rem;
                        color: #868e96;
                        cursor: pointer;
                        text-decoration: none;
                        margin: 0 8px;
                    }
                    .link-text:hover {
                        color: #343a40;
                        text-decoration: underline;
                    }
                    .divider {
                        color: #dee2e6;
                        font-size: 0.8rem;
                    }
                `}
            </style>

            <div className="user-card">
                {/* 타이틀 */}
                <h2 className="user-title">로그인</h2>

                <Form>
                    {/* 아이디 입력 */}
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">아이디</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="아이디를 입력하세요"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="form-control-custom"
                        />
                    </Form.Group>

                    {/* 비밀번호 입력 */}
                    <Form.Group className="mb-4">
                        <Form.Label className="form-label-custom">비밀번호</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="비밀번호를 입력하세요"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="form-control-custom"
                        />
                    </Form.Group>

                    {/* 로그인 버튼 */}
                    <Button 
                        className="w-100 btn-custom btn-primary-custom"
                        onClick={login}
                    >
                        로그인
                    </Button>

                    {/* 하단 링크들 */}
                    <div className="d-flex justify-content-center mt-4 align-items-center">
                        <span 
                            className="link-text" 
                            style={{ color: "#4dabf7", fontWeight: "600" }}
                            onClick={() => navigate('/SignUp')}
                        >
                            회원가입
                        </span>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;