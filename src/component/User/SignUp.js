import React, { useState } from 'react';
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [isCheckId, setCheckId] = useState(false);

    // 1. 아이디 중복 확인
    const checkId = async () => {
        if (!id.trim()) {
            alert('아이디를 입력해주세요');
            return;
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkId/${id}`);
            
            if (res.data.status !== 200) {
                alert('사용 가능한 아이디 입니다.');
                setCheckId(true);
            } else {
                alert('중복된 아이디 입니다.');
                setCheckId(false);
            }
        } catch (error) {
            console.error("ID Check Error:", error);
            alert("중복 확인 중 오류가 발생했습니다.");
        }
    };

    // 2. 회원가입 요청
    const signUp = async () => {
        if (!isCheckId) {
            alert("아이디 중복 확인을 먼저 해주세요.");
            return;
        }
        if (!pass.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        if (pass !== passConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/signUp`, {
                userId: id,
                pass: pass,
                isAdmin: 0
            });

            const statusData = res.data.status ? res.data.status[0] : null;
            
            if (statusData && statusData.serverStatus === 2) {
                alert("회원가입이 완료되었습니다! 로그인해주세요.");
                navigate('/Login');
            } else {
                alert('회원 가입 중 문제가 생겼습니다.\n관리자에게 문의해주세요.');
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="user-wrapper">
            {/* 내부 스타일 정의 (CSS 파일 없이 한 곳에서 관리) */}
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

                    /* 버튼 공통 스타일 */
                    .btn-custom {
                        border-radius: 12px !important;
                        font-weight: 700 !important;
                        padding: 12px !important;
                        font-size: 1rem !important;
                        border: none !important;
                        transition: all 0.2s;
                    }

                    /* 메인 버튼 (가입하기) */
                    .btn-primary-custom {
                        background-color: #4dabf7 !important;
                        color: white !important;
                        box-shadow: 0 4px 6px rgba(77, 171, 247, 0.2);
                    }
                    .btn-primary-custom:hover {
                        background-color: #3b93d1 !important;
                        transform: translateY(-1px);
                    }

                    /* 중복확인 버튼 */
                    .btn-outline-custom {
                        background-color: #fff !important;
                        border: 1px solid #dee2e6 !important;
                        color: #495057 !important;
                        font-size: 0.85rem !important;
                        padding: 8px 12px !important;
                        font-weight: 600 !important;
                    }
                    .btn-outline-custom:hover:not(:disabled) {
                        background-color: #f1f3f5 !important;
                        color: #333 !important;
                    }
                `}
            </style>

            <div className="user-card">
                {/* 타이틀 */}
                <h2 className="user-title">회원가입</h2>

                <Form>
                    {/* 아이디 입력 */}
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">아이디</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control 
                                type="text" 
                                placeholder="아이디 입력"
                                value={id}
                                onChange={(e) => {
                                    setId(e.target.value);
                                    setCheckId(false); 
                                }}
                                disabled={isCheckId} 
                                className="form-control-custom"
                            />
                            <Button 
                                variant="outline-secondary" 
                                className="btn-custom btn-outline-custom"
                                onClick={checkId}
                                disabled={isCheckId}
                                style={{ whiteSpace: "nowrap" }}
                            >
                                {isCheckId ? "확인완료" : "중복확인"}
                            </Button>
                        </div>
                        {isCheckId && <div style={{fontSize: "0.8rem", color: "#4dabf7", marginTop: "4px", fontWeight: "600"}}>✓ 사용 가능한 아이디입니다.</div>}
                    </Form.Group>

                    {/* 비밀번호 입력 */}
                    <Form.Group className="mb-3">
                        <Form.Label className="form-label-custom">비밀번호</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="비밀번호 입력"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="form-control-custom"
                        />
                    </Form.Group>

                    {/* 비밀번호 확인 */}
                    <Form.Group className="mb-4">
                        <Form.Label className="form-label-custom">비밀번호 확인</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="비밀번호 재입력"
                            value={passConfirm}
                            onChange={(e) => setPassConfirm(e.target.value)}
                            className="form-control-custom"
                            style={{
                                borderColor: (pass && passConfirm && pass !== passConfirm) ? "#ff6b6b" : ""
                            }}
                        />
                        {pass && passConfirm && pass !== passConfirm && (
                            <div style={{fontSize: "0.8rem", color: "#ff6b6b", marginTop: "4px", fontWeight: "600"}}>
                                ⚠ 비밀번호가 일치하지 않습니다.
                            </div>
                        )}
                    </Form.Group>

                    {/* 가입 버튼 */}
                    <Button 
                        className="w-100 btn-custom btn-primary-custom"
                        onClick={signUp}
                    >
                        가입하기
                    </Button>

                    <div className="text-center mt-3">
                        <span 
                            style={{ fontSize: "0.9rem", color: "#868e96", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => navigate('/Login')}
                        >
                            이미 계정이 있으신가요? 로그인
                        </span>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SignUp;