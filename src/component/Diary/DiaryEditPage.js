// src/component/Diary/DiaryEditPage.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const STORAGE_KEY = "diaryPosts";

const loadDiaries = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const saveDiaries = (arr) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const DiaryEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();          // URL의 :id
    const location = useLocation();
    const year = location.state?.year;
    const month = location.state?.month;
    const numericId = Number(id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isMe, setIsMe] = useState(false);

    // 처음 들어왔을 때 해당 일지 불러오기
    useEffect(() => {

        try{
            axios.post(`${process.env.REACT_APP_API_URL}/api/isMeDaily`,{calender_id: numericId},{withCredentials: true})
                .then(res => {
                    // console.log(res.data);
                    if(!(res.data.isMe)){
                        alert("비정상적인 접근입니다.")
                        navigate("/diary/list");
                    }
                })

        }catch(e){
            console.error(e);
        }

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/detailDaily/${id}`,{withCredentials: true})
                .then(r => {
                    const rr = r.data.data;
                    // console.log(r.data);
                    // console.log(rr.use_date.substr(0, 10));
                    setTitle(rr.title);
                    setContent(rr.content);
                    setDate(rr.use_date_local.substr(0, 10));   // "YYYY-MM-DD"
                })
        }catch (e) {
            console.log(e)
        }

        setLoading(false);
    }, [numericId]);

    const handleCancel = () => {
        navigate(`/diary/list/${year}/${month}`);
    };

    const handleDelete = () => {
        if (!window.confirm("이 일지를 삭제하시겠습니까?")) return;
        try{
            axios.post(`${process.env.REACT_APP_API_URL}/api/delDaily`,{id: numericId},{withCredentials: true})
                .then(res => {
                    if(res.data.state == 200){
                        navigate(`/diary/list/${year}/${month}`);
                    }
                })

        }catch(e){
            console.error(e);
        }
        alert("일지가 삭제되었습니다.");
        navigate(`/diary/list/${year}/${month}`);
    };

    const handleResubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!date) {
            alert("날짜를 선택해주세요.");
            return;
        }

        try{
            axios.post(`${process.env.REACT_APP_API_URL}/api/updateDaily`,
                {
                    id: numericId,
                    title: title,
                    content: content,
                    use_date: date
                },
                {withCredentials: true})
                .then(res => {
                    console.log(res.data)
                    if(res.data.status == 200){
                        alert("일지가 수정되었습니다!")
                        // navigate(`/diary/list/${year}/${month}`);
                    }else{
                        alert('수정 권한이 없습니다.')
                        navigate(`/diary/list/${year}/${month}`);
                    }
                })

        }catch(e){
            console.error(e);
        }

        // alert("일지가 수정되었습니다.");
        // navigate("/diary/list");
    };

    if (loading) {
        return (
            <Container className="py-3">
                <div>불러오는 중...</div>
            </Container>
        );
    }

    if (notFound) {
        return (
            <Container className="py-3">
                <div>존재하지 않는 일지입니다.</div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/diary/list/${year}/${month}`)}
                >
                    목록으로
                </Button>
            </Container>
        );
    }

    return (
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex justify-content-center align-items-center"
                style={{ paddingTop: "24px", paddingBottom: "70px" }}
            >
                <Col
                    xs={12}
                    md={8}
                    lg={6}
                    style={{
                        border: "1px solid #777",
                        borderRadius: "4px",
                        padding: "16px 16px 12px",
                        backgroundColor: "#fff",
                    }}
                >
                    <h5 style={{ marginBottom: "16px", fontWeight: "bold" }}>
                        나의 일지 수정
                    </h5>

                    <Form onSubmit={handleResubmit}>
                        {/* 제목 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>제목</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="제목을 입력해주세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                size="sm"
                            />
                        </Form.Group>

                        {/* 내용 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>내용</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                placeholder="내용을 입력해주세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                size="sm"
                                style={{ resize: "none" }}
                            />
                        </Form.Group>

                        {/* 날짜 */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: "bold" }}>날짜</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                size="sm"
                            />
                        </Form.Group>

                        {/* 아래 버튼: 취소 / 삭제 / 재등록 */}
                        <div className="d-flex justify-content-end" style={{ gap: "6px" }}>
                            <Button variant="secondary" size="sm" onClick={handleCancel}>
                                취소
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                onClick={handleDelete}
                            >
                                삭제
                            </Button>
                            <Button variant="primary" size="sm" type="submit">
                                재등록
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Container>
        </div>
    );
};

export default DiaryEditPage;
