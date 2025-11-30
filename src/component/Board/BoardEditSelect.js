// src/component/Board/BoardEditSelect.js
import React from "react";
import {Container, Table, Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

// 임시 더미 데이터 (나중에 백엔드 연동 시 삭제 예정)
const dummyPosts = [
    {id: 32, title: "강아지가 아파요", author: "user_id", date: "2025-10-10"},
    {id: 31, title: "강아지 귀여워ㅠㅠ", author: "user_id", date: "2025-10-10"},
    {id: 30, title: "배고파", author: "user_id", date: "2025-10-10"},
    {id: 29, title: "뭐 먹고 싶어?", author: "user_id", date: "2025-10-10"},
];

const BoardEditSelect = () => {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    // 나중에 백엔드에서는 여기서 내 글만 가져오기:
    // useEffect(() => {
    //   axios.get("/api/board/my", { withCredentials: true })
    //     .then(res => setMyPosts(res.data));
    // }, []);

    const myPosts = dummyPosts.filter(
        (p) => !userId || p.author === userId // 지금은 그냥 author 기준 필터
    );

    return (
        <div className="Section">
            <Container
                className="h-100 d-flex flex-column py-3"
                style={{maxWidth: "900px"}}
            >
                <h5 style={{fontWeight: "bold", marginBottom: "12px"}}>
                    수정할 게시글 선택
                </h5>

                <div
                    style={{
                        border: "1px solid #007bff",
                        borderRadius: "4px",
                        overflow: "hidden",
                        flexGrow: 1,
                    }}
                >
                    <Table
                        bordered
                        hover
                        size="sm"
                        className="mb-0"
                        style={{textAlign: "center", fontSize: "0.85rem"}}
                    >
                        <thead>
                        <tr style={{backgroundColor: "#e9f3ff"}}>
                            <th style={{width: "10%"}}>No</th>
                            <th style={{width: "50%"}}>제목</th>
                            <th style={{width: "20%"}}>작성일</th>
                            <th style={{width: "20%"}}>선택</th>
                        </tr>
                        </thead>
                        <tbody>
                        {myPosts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td style={{textAlign: "left"}}>{post.title}</td>
                                <td>{post.date}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => navigate(`/board/edit/${post.id}`)}
                                    >
                                        선택
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {myPosts.length === 0 && (
                            <tr>
                                <td colSpan={4}>내가 작성한 게시글이 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>

                <div className="mt-2 d-flex justify-content-end">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate("/board")}
                    >
                        목록으로
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default BoardEditSelect;
