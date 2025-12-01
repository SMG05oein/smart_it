import React from 'react';
import { useNavigate } from "react-router-dom";
const DailyList = ({currentMonth, monthTodos, handleEditTodo, handleDeleteTodo}) => {
    const navigate = useNavigate();
    return (
        <div style={{border: "1px solid #777", borderRadius: "4px", padding: "12px", marginTop: "16px"}}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                나의 일지 {currentMonth + 1}월
                {/* 🔹 여기: 나의 일지 리스트 버튼 */}
                <button className={"btn btn-sm btn-outline-info"}
                    style={{ padding: "4px 8px", fontSize: "0.8rem", marginLeft: "8px" }}
                    onClick={() => navigate("/diary/list")}
                >
                    나의 일지 리스트
                </button>
            </div>
            {monthTodos.length === 0 ? (
                <div style={{ color: "#777", fontSize: "0.9rem" }}>
                    아직 등록된 일정이 없습니다.
                </div>
            ) : (
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {monthTodos.map((item, idx) => (
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
                            <input type="checkbox" />
                            <span style={{ flex: 1 }}>
                                    {`${item.date.getMonth() + 1}월 ${item.date.getDate()}일 - ${
                                        item.text
                                    }`}
                                </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyList;