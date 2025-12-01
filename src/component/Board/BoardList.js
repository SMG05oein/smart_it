// src/component/Board/BoardList.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 필요 없으면 []로 두고 써도 됨
const dummyPosts = [
    { id: 32, title: "강아지가 아파요", author: "user_id", date: "2025-10-10" },
    { id: 31, title: "강아지 귀여워ㅠㅠ", author: "user_id", date: "2025-10-10" },
    { id: 30, title: "배고파", author: "user_id", date: "2025-10-10" },
    { id: 29, title: "뭐 먹고 싶어?", author: "user_id", date: "2025-10-10" },
    { id: 28, title: "김치찌개가 먹고 싶어", author: "user_id", date: "2025-10-10" },
    { id: 27, title: "집사가 돌아왔지", author: "user_id", date: "2025-10-10" },
    { id: 26, title: "너가 제일 좋아하지 해", author: "user_id", date: "2025-10-10" },
    { id: 25, title: "또 엄청나 돌아가지롱", author: "user_id", date: "2025-10-10" },
    { id: 24, title: "마셔", author: "user_id", date: "2025-10-10" },
];

const BoardList = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    // 한 페이지 10개
    const postsPerPage = 10;

    // 최근 글 먼저
    const sorted = [...dummyPosts].sort((a, b) => b.id - a.id);

    const filtered = sorted.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [keyword]);

    const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = filtered.slice(indexOfFirst, indexOfLast);

    // const goToPage = (page) => {
    //     // if (page < 1 || page > totalPages) return;
    //     // console.log(page);
    //     if(page >= totalPage)
    //     setCurrentPage(page);
    // };

    /**
     * 서민관 시작
     */
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalContent, setTotalContent] = useState(0);
    const [data, setData] = useState([]);
    const goToPage = (p) => {
        // if (page < 1 || page > totalPages) return;
        // console.log(page);
        if(p > totalPage) return;
        setCurrentPage(p);
    };

    /**useEffect(() => {
        if(keyword.trim() == '') {
            console.log('sdad');
            setCurrentPage(1);
            return;
        }
        axios.get(`${process.env.REACT_APP_API_URL}/api/boardAll/${currentPage ?? 0}/${keyword}`)
            .then(r => {
                let result = r.data;
                setPage(result.page);
                setTotalPage(result.data.totalPages)
                setData(result.data.data);
                setTotalContent(result.data.totalCount)
                console.log(result)
            })
    }, [keyword]);

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/boardAll/${currentPage ?? 0}`)
            .then(r => {
                let result = r.data;
                setPage(result.page);
                setTotalPage(result.data.totalPages)
                setData(result.data.data);
                setTotalContent(result.data.totalCount)
                console.log(result)
            })
    },[currentPage])*/

    // 새로운 검색이 시작될 때 페이지를 1로 리셋하는 훅 (이전 페이지 상태를 초기화)
    useEffect(() => {
        // 키워드가 비어 있지 않은 상태에서, 새로운 키워드가 입력되었거나
        // 키워드가 완전히 지워졌을 때 currentPage를 1로 재설정합니다.

        // **중요:** API 호출은 아래의 메인 훅(loadDataEffect)이 담당합니다.
        // 이 훅은 currentPage 상태를 변경하여 메인 훅을 트리거하는 역할만 합니다.

        if (currentPage !== 1) {
            // 현재 페이지가 1이 아니라면 1로 설정하여 메인 로드 훅을 트리거합니다.
            setCurrentPage(1);
        }
        // currentPage가 이미 1이라면 상태 변경이 없으므로, 메인 훅이 keyword 변경을 감지하고 바로 실행됩니다.

    }, [keyword]); // keyword가 변경될 때마다 실행

// 메인 데이터 로딩 훅 (페이지 변경 또는 키워드 변경 시 실행)
    useEffect(() => {
        // URL 구성: 키워드 유무에 따라 경로를 동적으로 결정합니다.
        const pageToLoad = currentPage ?? 1;
        const trimmedKeyword = keyword ? keyword.trim() : "";

        // 키워드가 있을 때만 /:keyword 경로를 추가합니다.
        const keywordPath = trimmedKeyword !== "" ? `/${trimmedKeyword}` : "";

        // 예: keyword가 ""이면 /api/boardAll/1
        // 예: keyword가 "페이징"이면 /api/boardAll/1/페이징
        const url = `${process.env.REACT_APP_API_URL}/api/boardAll/${pageToLoad}${keywordPath}`;

        // 데이터 로드 시작
        axios.get(url)
            .then(r => {
                let result = r.data;

                // 응답 데이터 사용
                setTotalPage(result.data.totalPages);
                setData(result.data.data);
                setTotalContent(result.data.totalCount);

                // 서버에서 받은 페이지로 동기화 (선택 사항)
                setCurrentPage(result.page);

                console.log(result);
            })
            .catch(error => {
                console.error("게시글 조회 실패:", error);
                // 실패 시 목록 초기화
                setData([]);
                setTotalPage(1);
                setTotalContent(0);
            });

    }, [currentPage, keyword]); // currentPage 또는 keyword가 바뀔 때 실행
    /**
     * 서민관 끝
     */



    return (
        // 🔹 Section을 써서 화면 높이 꽉 채우기
        <div className="Section">
            <Container
                fluid
                className="h-100 d-flex flex-column py-3"
                style={{
                    maxWidth: "900px",   // 전체 폭
                    margin: "0 auto",
                    paddingBottom: "70px", // FNB 만큼 여백
                }}
            >
                {/* 상단 제목 */}
                <Row className="mb-2">
                    <Col>
                        <h5 style={{ fontWeight: "bold" }}>게시판</h5>
                    </Col>
                </Row>

                {/* 검색 영역 */}
                <Row className="align-items-center mb-2">
                    <Col xs="auto">
                        <Button variant="outline-dark" size="sm">
                            제목 &gt;
                        </Button>
                    </Col>
                    <Col xs>
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="검색"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="dark" size="sm" onClick={()=>{setKeyword('')}}>
                            초기화
                        </Button>
                    </Col>
                    <Col xs="auto" className="text-end">
                        <Button onClick={()=>navigate("/board/0")} variant="primary" size="sm">
                            등록
                        </Button>
                    </Col>
                </Row>

                {/* 🔹 가운데 영역을 flex-grow로 키워서 화면을 꽉 채움 */}
                <Row className="flex-grow-1">
                    <Col className="d-flex flex-column">
                        {/* 테이블 박스 (세로로 넓게) */}
                        <div
                            style={{
                                border: "1px solid #007bff",
                                borderRadius: "4px",
                                overflow: "hidden",
                                flexGrow: 1,           // 남는 세로 공간 채우기
                                minHeight: "280px",    // 최소 높이
                            }}
                        >
                            <Table
                                bordered
                                hover
                                size="sm"
                                className="mb-0 h-100"
                                style={{ textAlign: "center", fontSize: "0.85rem" }}
                            >
                                <thead>
                                <tr style={{ backgroundColor: "#e9f3ff" }}>
                                    <th style={{ width: "10%" }}>No</th>
                                    <th style={{ width: "40%" }}>제목</th>
                                    <th style={{ width: "20%" }}>작성자</th>
                                    <th style={{ width: "30%" }}>등록일</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((d, idx) => (
                                    <tr
                                        key={d.board_id}
                                        style={{ cursor: "pointer" }}
                                        // onClick={() => navigate(`/board/${d.board_id}`)}
                                    >
                                        <td>{totalContent - (currentPage - 1) * 10 - idx}</td>
                                        <td style={{ textAlign: "left" }} onClick={() => navigate(`/board/${d.board_id}`)}>{d.title}</td>
                                        <td>{d.user_id}</td>
                                        <td>{d.board_reg_date ? d.board_reg_date.substring(0, 10) : '날짜 없음'}</td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={4}>검색 결과가 없습니다.</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* 하단 페이지네이션 */}
                        <div
                            className="mt-2 d-flex justify-content-center align-items-center"
                            style={{ fontSize: "0.8rem", gap: "4px" }}
                        >
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </Button>

                            {Array.from({ length: totalPage  }, (_, idx) => idx + 1).map(
                                (p) => (
                                    <Button
                                        key={p}
                                        variant={
                                            p === currentPage ? "secondary" : "outline-secondary"
                                        }
                                        size="sm"
                                        onClick={() => goToPage(p)}
                                    >
                                        {p}
                                    </Button>
                                )
                            )}

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPage}
                            >
                                &gt;
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BoardList;
