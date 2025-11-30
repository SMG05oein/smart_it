import React from 'react';

const DailyList = ({currentMonth, monthTodos, handleEditTodo, handleDeleteTodo}) => {
    return (
        <div style={{border: "1px solid #777", borderRadius: "4px", padding: "12px", marginTop: "16px"}}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                나의 일지 {currentMonth + 1}월
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
                            <button
                                style={{ fontSize: "0.75rem", padding: "2px 6px" }}
                                onClick={() => handleEditTodo(item)}
                            >
                                수정
                            </button>
                            <button
                                style={{
                                    fontSize: "0.75rem",
                                    padding: "2px 6px",
                                    marginLeft: "2px",
                                }}
                                onClick={() => handleDeleteTodo(item)}
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DailyList;