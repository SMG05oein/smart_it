// src/component/Chat/ChatBot.js
import React from "react";
import { Container } from "react-bootstrap";

const ChatBot = () => {
    return (
        <Container
            fluid
            className="py-3"
            style={{ paddingBottom: "80px" }} // 아래 FNB 자리 확보
        >
            <div
                style={{
                    border: "1px solid #888",
                    borderRadius: "4px",
                    height: "750px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "300px"
                }}
            >
                {/* 검색 입력칸 (나중에 GPT 연동할 부분) */}
                <input
                    type="text"
                    style={{
                        width: "80%",
                        maxWidth: "260px",
                        padding: "6px 8px",
                        border: "1px solid #777",
                        borderRadius: "2px",
                        marginBottom: "24px",
                    }}
                />

                {/* 중앙 텍스트 */}
                <div style={{ fontSize: "0.95rem" }}>무엇이든 물어보세요</div>
            </div>
        </Container>
    );
};

export default ChatBot;
