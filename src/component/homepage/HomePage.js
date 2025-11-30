// src/HomePage.js
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {useMemo, useState} from "react";
import DailyList from "./DailyList";

function Homepage() {
    // 캘린더에 선택된 날짜
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 현재 보고 있는 달의 시작 날짜
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    // 입력창
    const [inputText, setInputText] = useState("");

    // 날짜별 일정 목록 { "2025-11-05": ["강아지 사료 사러가기", ...] }
    const [todosByDate, setTodosByDate] = useState({});

    // ✅ 날짜 -> "YYYY-MM-DD" (로컬 기준) 문자열
    const getDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const dateKey = getDateKey(selectedDate);

    // 선택한 날짜의 일정들
    const todayTodos = todosByDate[dateKey] || [];

    // 일정 추가
    const handleAddTodo = () => {
        if (!inputText.trim()) return;

        setTodosByDate((prev) => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), inputText.trim()],
        }));
        setInputText("");
    };

    // 현재 달(캘린더에 보이는 달)의 일정 목록 (리스트용)
    const currentYear = activeStartDate.getFullYear();
    const currentMonth = activeStartDate.getMonth(); // 0~11

    const monthTodos = useMemo(() => {
        const items = [];
        Object.entries(todosByDate).forEach(([key, list]) => {
            // "YYYY-MM-DD" → 로컬 Date 객체로 변환
            const [y, m, d] = key.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);

            if (
                dateObj.getFullYear() === currentYear &&
                dateObj.getMonth() === currentMonth
            ) {
                list.forEach((text, idx) =>
                    items.push({ date: dateObj, text, key, idxInDay: idx })
                );
            }
        });
        // 날짜 순으로 정렬
        items.sort((a, b) => a.date - b.date);
        return items;
    }, [todosByDate, currentYear, currentMonth]);

    // 🔸 나의 일지에서 삭제
    const handleDeleteTodo = (item) => {
        setTodosByDate((prev) => {
            const copy = { ...prev };
            const arr = [...(copy[item.key] || [])];
            arr.splice(item.idxInDay, 1);
            if (arr.length === 0) {
                delete copy[item.key];
            } else {
                copy[item.key] = arr;
            }
            return copy;
        });
    };

    // 🔸 나의 일지에서 수정 (간단히 prompt 사용)
    const handleEditTodo = (item) => {
        const newText = window.prompt("일정을 수정하세요.", item.text);
        if (!newText || !newText.trim()) return;

        setTodosByDate((prev) => {
            const copy = { ...prev };
            const arr = [...(copy[item.key] || [])];
            arr[item.idxInDay] = newText.trim();
            copy[item.key] = arr;
            return copy;
        });
    };

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "16px 8px",
            }}
        >
            {/* 캘린더 박스 */}
            <div
                style={{
                    border: "1px solid #777",
                    borderRadius: "4px",
                    padding: "16px",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {/* 🔹 가운데 정렬 + my-calendar 클래스로 크기 조절 */}
                <Calendar
                    className="my-calendar"
                    onChange={()=>setSelectedDate}
                    value={selectedDate}
                    onClickDay={setSelectedDate}
                    onActiveStartDateChange={({ activeStartDate }) =>
                        setActiveStartDate(activeStartDate)
                    }
                    formatMonthYear={(locale, date) =>
                        `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                    }
                    tileClassName={({ date, view }) => {
                        if (view !== "month") return null;
                        const classes = [];

                        const day = date.getDay();
                        if (day === 0) classes.push("cal-sunday");
                        if (day === 6) classes.push("cal-saturday");

                        const key = getDateKey(date);
                        if (todosByDate[key] && todosByDate[key].length > 0) {
                            classes.push("cal-has-todo");
                        }

                        return classes.join(" ");
                    }}
                />
            </div>

            {/* 선택한 날짜 + 입력 */}
            <div
                style={{
                    border: "1px solid #777",
                    borderRadius: "4px",
                    padding: "12px",
                    marginTop: "16px",
                }}
            >
                <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                    선택한 날짜: {selectedDate.getFullYear()}년{" "}
                    {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        placeholder="이 날의 할 일을 적어보세요"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ flex: 1, padding: "6px 8px" }}
                    />
                    <button className={"btn btn-primary"} onClick={handleAddTodo} style={{ padding: "6px 12px" }}>
                        추가
                    </button>
                </div>
                {todayTodos.length > 0 && (
                    <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
                        {todayTodos.map((t, i) => (
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 아래 나의 일지 리스트 */}
            <DailyList currentMonth={currentMonth} monthTodos={monthTodos} handleEditTodo={handleEditTodo} handleDeleteTodo={handleDeleteTodo}/>
        </div>
    );
}

export default Homepage;
