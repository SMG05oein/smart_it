// src/component/Board/BoardDetail.js
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import BoardWrite from "./BoardWrite";

const dummyPosts = [
    { id: 32, title: "강아지가 아파요", author: "user_id", date: "2025-10-10", content: "우리 강아지가 오늘부터 밥을 잘 안 먹어요..." },
    { id: 31, title: "강아지 귀여워ㅠㅠ", author: "user_id", date: "2025-10-10", content: "사진은 나중에 올릴게요 :)" },
    // 필요하면 더 추가
];

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const postId = Number(id);
    const post = dummyPosts.find((p) => p.id === postId);

    const [comments, setComments] = useState([
        { id: 1, author: "user_a", content: "빨리 나았으면 좋겠어요 ㅠ", date: "2025-10-11" },
    ]);
    const [commentText, setCommentText] = useState("");

    if(id == 0){ // id가 없으므로 등록 페이지 보여줘야 함
        return (
            <BoardWrite />
        )
    }
    else if (!post) { // id는 있는데 그에 맞는 데이터가 없음
        return (
            <Container className="py-3" style={{ paddingBottom: "80px" }}>
                <div>존재하지 않는 게시글입니다.</div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate("/board")}
                >
                    목록으로
                </Button>
            </Container>
        );
    }else{ // id도 있고 그게 맞는 데이터도 있음
        const handleAddComment = () => {
            if (!commentText.trim()) return;
            const newComment = {
                id: comments.length + 1,
                author: "현재유저", // 나중에 로그인 연동
                content: commentText.trim(),
                date: new Date().toISOString().slice(0, 10),
            };
            setComments([...comments, newComment]);
            setCommentText("");
        };

        return (
            <Container
                fluid
                className="py-3"
                style={{ paddingBottom: "80px" }}
            >
                {/* 상단 제목 + 뒤로가기 */}
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="mb-2"
                            onClick={() => navigate("/board")}
                        >
                            &lt; 목록
                        </Button>
                        <h5 style={{ fontWeight: "bold" }}>{post.title}</h5>
                        <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {post.author} · {post.date}
                        </div>
                    </Col>
                </Row>

                {/* 본문 내용 */}
                <Row className="mb-4">
                    <Col>
                        <div
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                minHeight: "150px",
                                padding: "12px",
                                fontSize: "0.9rem",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {post.content || "여기에 게시글 내용이 들어갑니다."}
                        </div>
                    </Col>
                </Row>

                {/* 댓글 리스트 */}
                <Row className="mb-3">
                    <Col>
                        <h6 style={{ fontWeight: "bold", fontSize: "0.95rem" }}>댓글</h6>
                        <div
                            style={{
                                border: "1px solid #eee",
                                borderRadius: "4px",
                                padding: "8px",
                                maxHeight: "200px",
                                overflowY: "auto",
                                fontSize: "0.85rem",
                            }}
                        >
                            {comments.length === 0 && (
                                <div style={{ color: "#999" }}>아직 댓글이 없습니다.</div>
                            )}
                            {comments.map((c) => (
                                <div
                                    key={c.id}
                                    style={{
                                        borderBottom: "1px solid #f1f1f1",
                                        padding: "4px 0",
                                    }}
                                >
                                    <div style={{ fontWeight: "bold" }}>{c.author}</div>
                                    <div>{c.content}</div>
                                    <div style={{ fontSize: "0.75rem", color: "#999" }}>
                                        {c.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* 댓글 입력 */}
                <Row>
                    <Col>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="댓글을 입력하세요"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            style={{ fontSize: "0.85rem" }}
                        />
                        <div className="text-end mt-2">
                            <Button size="sm" onClick={handleAddComment}>
                                댓글 등록
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default BoardDetail;
