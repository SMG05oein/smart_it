import React from 'react';
import { useNavigate } from "react-router-dom";

const DailyList = ({ currentMonth, monthTodos }) => {
    const navigate = useNavigate();

    const topThree = [...monthTodos]
        .sort((a, b) => b.date - a.date)
        .slice(0, 8);

    return (
        <div style={{border: "1px solid #777", borderRadius: "4px", padding: "12px", marginTop: "10px"}}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                나의 일지 {currentMonth + 1}월
                <button
                    className={"btn btn-sm btn-outline-info"}
                    style={{ padding: "4px 8px", fontSize: "0.8rem", marginLeft: "8px" }}
                    onClick={() => navigate("/diary/list")}
                >
                    나의 일지 리스트
                </button>
            </div>

            {topThree.length === 0 ? (
                <div style={{ color: "#777", fontSize: "0.9rem" }}>
                    아직 등록된 일정이 없습니다.
                </div>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {topThree.map((item, idx) => (
                        <li
                            key={`${item.key}-${idx}`}
                            style={{
                                marginBottom: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.9rem",
                            }}
                        >
                            {/* 날짜 + 제목만 심플하게 */}
                            <span style={{ flex: 1 }}>
                                {console.log("Item: ",item)}
                                {`${item.use_date_local.substr(5,2)}월 ${item.use_date_local.substr(8,2)}일 - ${item.title}`}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyList;