import React, { useState, useRef, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const ChatBot = () => {
    const [input, setInput] = useState(""); // 사용자 입력
    const [messages, setMessages] = useState([]); // 대화 목록 (현재 질문+답변만 저장)
    const [loading, setLoading] = useState(false); // 로딩 상태
    
    // Node.js 서버 주소 (8008번 포트)
    const SERVER_URL = "http://localhost:8008/api/ask";

    // 스크롤 제어용
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > 0 || loading) {
            scrollToBottom();
        }
    }, [messages, loading]);

    // 질문 전송 함수
    const handleSendMessage = async () => {
        if (!input.trim()) return; 

        const userMessage = { role: "user", text: input };
        
        setMessages([userMessage]); 
        setInput(""); 
        setLoading(true);

        try {
            const res = await axios.post(SERVER_URL, {
                message: userMessage.text
            });

            const botMessage = { 
                role: "bot", 
                text: res.data.answer || "죄송해요, 답변을 가져오지 못했어요." 
            };
            
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("API Error:", error);
            const errorMessage = { 
                role: "bot", 
                text: "서버와 연결할 수 없거나 오류가 발생했습니다." 
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <Container
            fluid
            style={{ 
                height: "100%",     
                overflow: "hidden",  
                padding: 0,          
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column"
            }} 
        >
            {/* [추가] 말풍선 애니메이션 스타일 정의 */}
            <style>
                {`
                    @keyframes bubblePop {
                        0% { opacity: 0; transform: scale(0.8) translateY(10px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .msg-bubble {
                        animation: bubblePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                `}
            </style>

            {/* 상단 헤더 (게시판과 동일한 스타일 적용) */}
            <div style={{ 
                padding: "10px", 
                borderBottom: "1px solid #f1f3f5", // 연한 테두리
                backgroundColor: "#fff",           // 흰색 배경
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                height: "60px",                    // 높이 통일
                zIndex: 10,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#343a40", letterSpacing: "-0.5px" }}>
                    🐶 강아지 AI 상담소
                </span>
            </div>

            {/* 1. 대화 내용 표시 영역 */}
            <div 
                style={{ 
                    flex: 1, 
                    overflowY: "auto", 
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    backgroundColor: "#fff", // 본문 배경 흰색
                    minHeight: 0 
                }}
            >
                {messages.length === 0 && !loading && (
                    <div style={{ 
                        textAlign: "center", 
                        marginTop: "auto", 
                        marginBottom: "auto",
                        color: "#adb5bd",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🐕</div>
                        <h5 style={{ fontWeight: "bold", color: "#495057" }}>무엇을 도와드릴까요?</h5>
                        <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                            질문할 때마다 새로운 상담이 시작됩니다.<br/>
                            (이전 대화는 사라집니다)
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className="msg-bubble" // 애니메이션 클래스 적용
                        style={{ 
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                        }}
                    >
                        <div style={{ 
                            fontSize: "0.8rem", 
                            marginBottom: "6px", 
                            color: "#868e96",
                            padding: "0 4px",
                            fontWeight: "600"
                        }}>
                            {msg.role === "user" ? "나" : "AI 수의사"}
                        </div>

                        <div style={{ 
                            maxWidth: "85%",
                            padding: "14px 18px",
                            borderRadius: "18px",
                            fontSize: "1rem",
                            lineHeight: "1.6",
                            position: "relative",
                            wordBreak: "break-word",
                            // 색상 통일: 유저는 브랜드 컬러, 봇은 연한 회색 배경
                            backgroundColor: msg.role === "user" ? "#4dabf7" : "#f8f9fa",
                            color: msg.role === "user" ? "#fff" : "#343a40",
                            borderBottomRightRadius: msg.role === "user" ? "4px" : "18px",
                            borderBottomLeftRadius: msg.role === "bot" ? "4px" : "18px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                            border: msg.role === "bot" ? "1px solid #f1f3f5" : "none"
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {/* 로딩 인디케이터 */}
                {loading && (
                    <div 
                        className="msg-bubble"
                        style={{ alignSelf: "flex-start", marginTop: "10px" }}
                    >
                         <div style={{ 
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 16px",
                            backgroundColor: "#fff",
                            borderRadius: "18px",
                            borderBottomLeftRadius: "4px",
                            border: "1px solid #f1f3f5",
                            color: "#868e96",
                            fontSize: "0.9rem",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                         }}>
                            <Spinner 
                                animation="border" 
                                size="sm" 
                                variant="primary" 
                                style={{ marginRight: "10px", width: "1rem", height: "1rem", borderWidth: "2px" }} 
                            />
                            <span>답변을 생성하고 있습니다...</span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 2. 입력 영역 (게시판 하단과 통일감) */}
            <div 
                style={{ 
                    padding: "15px", 
                    borderTop: "1px solid #f1f3f5", 
                    backgroundColor: "#fff",
                    display: "flex",
                    gap: "10px",
                    flexShrink: 0, 
                    paddingBottom: "max(15px, env(safe-area-inset-bottom))"
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="증상을 입력해주세요..."
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: "none", // 테두리 없애고 배경색 활용
                        borderRadius: "20px",
                        outline: "none",
                        fontSize: "1rem",
                        backgroundColor: "#f8f9fa", // 게시판 검색창과 동일한 연한 회색
                        color: "#333",
                        transition: "background-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.backgroundColor = "#f1f3f5"}
                    onBlur={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                />
                <Button 
                    onClick={handleSendMessage} 
                    disabled={loading || !input.trim()}
                    style={{ 
                        borderRadius: "20px", 
                        padding: "0 20px", 
                        fontWeight: "700",
                        backgroundColor: "#4dabf7", // 브랜드 컬러
                        border: "none",
                        boxShadow: "0 4px 6px rgba(77, 171, 247, 0.2)"
                    }}
                >
                    전송
                </Button>
            </div>
        </Container>
    );
};

export default ChatBot;