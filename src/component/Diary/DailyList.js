import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap"; // 부트스트랩 버튼 사용

const DailyList = ({ currentMonth, monthTodos, currentYear }) => {
    const navigate = useNavigate();

    // 날짜 내림차순 정렬 후 상위 8개 자르기
    const topThree = [...monthTodos]
        .sort((a, b) => new Date(b.use_date_local) - new Date(a.use_date_local)) // 날짜 객체 비교로 수정 (문자열도 작동하지만 안전하게)
        .slice(0, 8);

    return (
        <div style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // 부드러운 그림자
            border: "1px solid #f1f3f5",
            padding: "20px",
            marginTop: "20px",
            marginBottom: "20px"
        }}>
            {/* 카드 헤더 영역 */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f8f9fa"
            }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#343a40", letterSpacing: "-0.5px" }}>
                    📅 나의 일지 <span style={{ color: "#4dabf7" }}>{currentMonth + 1}월</span>
                </span>
                
                <Button
                    variant="light"
                    size="sm"
                    onClick={() => navigate(`/diary/list/${currentYear}/${currentMonth + 1}`)}
                    style={{
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#495057",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        padding: "6px 12px"
                    }}
                >
                    전체 보기 &gt;
                </Button>
            </div>

            {/* 리스트 영역 */}
            {topThree.length === 0 ? (
                <div style={{ 
                    textAlign: "center", 
                    padding: "40px 0", 
                    color: "#adb5bd", 
                    fontSize: "0.9rem" 
                }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📝</div>
                    아직 등록된 일정이 없습니다.
                </div>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                    {topThree.map((item, idx) => (
                        <li
                            key={`${item.key}-${idx}`}
                            style={{
                                padding: "10px 4px",
                                borderBottom: idx === topThree.length - 1 ? "none" : "1px solid #f8f9fa",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontSize: "0.95rem",
                                color: "#495057",
                                cursor: "default"
                            }}
                        >
                            {/* 날짜 뱃지 */}
                            <span style={{ 
                                backgroundColor: "#e7f5ff",
                                color: "#4dabf7",
                                padding: "4px 8px",
                                borderRadius: "8px",
                                fontSize: "0.8rem",
                                fontWeight: "700",
                                minWidth: "50px",
                                textAlign: "center"
                            }}>
                                {item.use_date_local.substr(5, 2)}.{item.use_date_local.substr(8, 2)}
                            </span>

                            {/* 제목 */}
                            <span style={{ 
                                flex: 1, 
                                overflow: "hidden", 
                                textOverflow: "ellipsis", 
                                whiteSpace: "nowrap",
                                fontWeight: "500"
                            }}>
                                {item.title}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyList;