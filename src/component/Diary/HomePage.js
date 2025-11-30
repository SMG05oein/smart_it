// src/component/homepage/HomePage.js
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import DailyList from "./DailyList";

const STORAGE_KEY = "diaryPosts";

function Homepage() {
    // 캘린더에 선택된 날짜
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 현재 보고 있는 달의 시작 날짜
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    // 🔹 이 달에 해당하는 일지 목록 (나의 11월 일지 박스용)
    const [monthTodos, setMonthTodos] = useState([]);

    // 🔹 일지가 있는 날짜들 (캘린더 초록색 표시용)
    const [diaryDateKeys, setDiaryDateKeys] = useState([]);

    // 날짜 -> "YYYY-MM-DD"
    const getDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const currentYear = activeStartDate.getFullYear();
    const currentMonth = activeStartDate.getMonth(); // 0~11

    // 🔸 홈 화면이 켜질 때 + 보고 있는 달이 바뀔 때마다 localStorage에서 읽어오기
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const arr = raw ? JSON.parse(raw) : [];

            const items = [];
            const dateSet = new Set(); // 캘린더 색칠용

            arr.forEach((d) => {
                if (!d.date) return;

                // 날짜 문자열 모아두기 (예: "2025-11-30")
                dateSet.add(d.date);

                // "YYYY-MM-DD" → Date 객체
                const [y, m, day] = d.date.split("-").map(Number);
                const dateObj = new Date(y, m - 1, day);

                // 지금 보고 있는 달에 해당하는 것만 '나의 11월 일지' 리스트에 포함
                if (
                    dateObj.getFullYear() === currentYear &&
                    dateObj.getMonth() === currentMonth
                ) {
                    items.push({
                        date: dateObj,     // Date 객체 (표시용)
                        text: d.title,     // 일지 제목
                        key: d.date,       // 고유 키로 날짜 문자열 사용
                        idxInDay: 0,       // (예전 구조 맞추기용, 지금은 의미 없음)
                    });
                }
            });

            // 날짜 오름차순 정렬
            items.sort((a, b) => a.date - b.date);

            setMonthTodos(items);
            setDiaryDateKeys(Array.from(dateSet));
        } catch (e) {
            console.error(e);
        }
    }, [currentYear, currentMonth]);

    // 지금은 홈 화면에서 바로 수정/삭제 안 쓸 거라서 일단 빈 함수로 둠
    const handleEditTodo = () => {};
    const handleDeleteTodo = () => {};

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
                <Calendar
                    className="my-calendar"
                    value={selectedDate}
                    onChange={setSelectedDate}
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
                        if (day === 0) classes.push("cal-sunday");    // 일요일
                        if (day === 6) classes.push("cal-saturday");  // 토요일

                        const key = getDateKey(date);

                        // 🔹 이 날짜에 일지가 하나라도 있으면 초록색 표시
                        if (diaryDateKeys.includes(key)) {
                            classes.push("cal-has-todo");
                        }

                        return classes.join(" ");
                    }}
                />
            </div>

            {/* 아래 나의 일지 리스트 */}
            <DailyList
                currentMonth={currentMonth}
                monthTodos={monthTodos}
                handleEditTodo={handleEditTodo}
                handleDeleteTodo={handleDeleteTodo}
            />
        </div>
    );
}

export default Homepage;
